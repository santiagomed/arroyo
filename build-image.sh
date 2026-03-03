#!/usr/bin/env bash
#
# build-image.sh — Build and push arroyo Docker image on the coder instance.
#
# This script works around three coder-instance limitations:
#   1. rootless buildah broken (newuidmap lacks setuid)
#   2. no internet except Artifactory + GitHub
#   3. CentOS 9 ships Rust 1.85 but the project needs ≥1.88
#
# Solution: build natively on the host using the Rust toolchain extracted
# from the rust:1-bookworm Docker image on Artifactory, then assemble
# a minimal Docker image with buildah (COPY-only, no apt-get inside).
#
# Usage:
#   ./build-image.sh                          # defaults
#   IMAGE_TAG=0.16.0-rc1 ./build-image.sh    # custom tag
#
set -euo pipefail

###############################################################################
# Config
###############################################################################
REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
IMAGE_TAG="${IMAGE_TAG:-0.15.0-mtls-pgtls}"
REGISTRY="docker-releases-local.artifactory.local.twitter.com"
IMAGE_NAME="ghcr.io/arroyosystems/arroyo"
FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
GIT_SHA="$(git -C "$REPO_ROOT" rev-parse HEAD)"
ARTIFACTS="/tmp/docker-artifacts"
RUST_IMAGE="docker-virtual.artifactory.local.twitter.com/library/rust:1-bookworm"
RUNTIME_IMAGE="docker-virtual.artifactory.local.twitter.com/library/debian:bookworm-slim"

###############################################################################
# 1. Install build deps via dnf (idempotent)
###############################################################################
echo "==> Installing build dependencies via dnf..."
sudo dnf install -y --quiet \
  cmake cyrus-sasl-devel postgresql-server mold \
  protobuf-compiler python3.12 python3.12-devel 2>/dev/null || true

###############################################################################
# 2. Extract Rust toolchain from Docker image (if not already done)
###############################################################################
RUSTUP_HOME="${RUSTUP_HOME:-/tmp/rustup-extracted}"
CARGO_HOME="${CARGO_HOME:-/tmp/cargo-extracted}"
export RUSTUP_HOME CARGO_HOME
export PATH="$CARGO_HOME/bin:$PATH"

if ! rustc --version 2>/dev/null | grep -q '1\.\(8[89]\|9[0-9]\)'; then
  echo "==> Extracting Rust toolchain from $RUST_IMAGE..."
  CONTAINER=$(sudo buildah --storage-driver vfs from "$RUST_IMAGE" 2>/dev/null)
  MOUNT=$(sudo buildah --storage-driver vfs mount "$CONTAINER" 2>/dev/null)
  sudo rm -rf "$RUSTUP_HOME" "$CARGO_HOME"
  sudo cp -a "$MOUNT/usr/local/rustup" "$RUSTUP_HOME"
  sudo cp -a "$MOUNT/usr/local/cargo"  "$CARGO_HOME"
  sudo chown -R "$(id -u):$(id -g)" "$RUSTUP_HOME" "$CARGO_HOME"
  # Set default toolchain (pick whatever is installed in the image)
  TOOLCHAIN=$(ls "$RUSTUP_HOME/toolchains/" | head -1)
  "$CARGO_HOME/bin/rustup" default "$TOOLCHAIN"
  sudo buildah --storage-driver vfs rm "$CONTAINER" &>/dev/null || true
fi
echo "    Using $(rustc --version)"

###############################################################################
# 3. Start PostgreSQL (needed by cornucopia build.rs)
###############################################################################
echo "==> Setting up PostgreSQL..."
PGDATA=/tmp/pgdata
if [ ! -d "$PGDATA" ]; then
  sudo mkdir -p /var/run/postgresql
  sudo chown postgres:postgres /var/run/postgresql
  sudo -u postgres initdb -D "$PGDATA" &>/dev/null
fi
if ! sudo -u postgres pg_isready -q 2>/dev/null; then
  sudo -u postgres pg_ctl -D "$PGDATA" -l "$PGDATA/logfile" start -w
fi
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='arroyo'" \
  | grep -q 1 || sudo -u postgres psql -c "CREATE USER arroyo WITH PASSWORD 'arroyo' SUPERUSER;"
sudo -u postgres psql -lqt | cut -d\| -f1 | grep -qw arroyo \
  || sudo -u postgres createdb arroyo

###############################################################################
# 4. Run database migrations
###############################################################################
echo "==> Running migrations..."
if ! command -v refinery &>/dev/null; then
  cargo install refinery_cli --features=postgresql --locked 2>&1 | tail -1
fi
refinery migrate -c "$REPO_ROOT/docker/refinery.toml" \
  -p "$REPO_ROOT/crates/arroyo-api/migrations" 2>/dev/null || true

###############################################################################
# 5. Build web UI
###############################################################################
echo "==> Building web UI..."
(cd "$REPO_ROOT/webui" && pnpm install --silent && pnpm build --silent)

###############################################################################
# 6. Download artifacts for Docker image (Python standalone + protoc)
###############################################################################
echo "==> Downloading Python standalone + protoc from GitHub..."
mkdir -p "$ARTIFACTS"
if [ ! -f "$ARTIFACTS/python/bin/python3.12" ]; then
  curl -sfL "https://github.com/indygreg/python-build-standalone/releases/download/20240814/cpython-3.12.5+20240814-x86_64-unknown-linux-gnu-install_only.tar.gz" \
    | tar xz -C "$ARTIFACTS"
fi
if [ ! -f "$ARTIFACTS/protoc-dir/bin/protoc" ]; then
  curl -sfL "https://github.com/protocolbuffers/protobuf/releases/download/v21.8/protoc-21.8-linux-x86_64.zip" \
    -o "$ARTIFACTS/protoc.zip"
  unzip -qo "$ARTIFACTS/protoc.zip" -d "$ARTIFACTS/protoc-dir"
  rm -f "$ARTIFACTS/protoc.zip"
fi

###############################################################################
# 7. Build arroyo binary
###############################################################################
echo "==> Building arroyo binary (release)..."
cd "$REPO_ROOT"
export VERGEN_GIT_SHA="$GIT_SHA"
export CARGO_NET_GIT_FETCH_WITH_CLI=true
export CARGO_PROFILE_RELEASE_DEBUG=false
export PYO3_PYTHON=python3.12

cargo build --features python --profile release --bin arroyo 2>&1 \
  | grep -E '(Compiling arroyo |Finished|error)' || true

BINARY="$REPO_ROOT/target/release/arroyo"
if [ ! -f "$BINARY" ]; then
  echo "ERROR: binary not found at $BINARY"
  exit 1
fi
echo "    Binary: $BINARY ($(du -h "$BINARY" | cut -f1))"

###############################################################################
# 8. Assemble Docker image with buildah using Dockerfile.prebuilt
###############################################################################
echo "==> Assembling Docker image via Dockerfile.prebuilt..."
sudo buildah --storage-driver vfs build --isolation chroot \
  -f "$REPO_ROOT/docker/Dockerfile.prebuilt" \
  --build-arg BINARY="$BINARY" \
  --build-arg PYTHON_DIR="$ARTIFACTS/python" \
  --build-arg PROTOC_DIR="$ARTIFACTS/protoc-dir" \
  -t "$FULL_IMAGE" \
  /

echo "==> Image built: $FULL_IMAGE"

###############################################################################
# 9. Push
###############################################################################
echo "==> Pushing image..."
sudo buildah --storage-driver vfs push "$FULL_IMAGE"

echo "==> Done! Image pushed to $FULL_IMAGE"
