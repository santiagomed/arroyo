import { modalAnatomy, popoverAnatomy, tabsAnatomy, tableAnatomy, cardAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyleConfig } from '@chakra-ui/styled-system';

const { definePartsStyle: modalPartsStyle, defineMultiStyleConfig: defineModalMultiStyleConfig } =
  createMultiStyleConfigHelpers(modalAnatomy.keys);

export const modalTheme = defineModalMultiStyleConfig({
  baseStyle: modalPartsStyle({
    dialog: {
      bg: '#1A1D24',
      border: '1px solid',
      borderColor: 'gray.700',
      borderRadius: 'xl',
      boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.5)',
    },
    header: {
      borderBottomWidth: '1px',
      borderColor: 'gray.700',
      fontWeight: '600',
      py: 4,
    },
    body: {
      py: 5,
    },
    footer: {
      borderTopWidth: '1px',
      borderColor: 'gray.700',
      py: 4,
    },
    closeButton: {
      borderRadius: 'full',
      _hover: { bg: 'whiteAlpha.100' },
    },
  }),
  variants: {
    tour: modalPartsStyle({
      dialog: {
        bg: `gray.100`,
        color: `black`,
        border: 'none',
      },
      header: {
        borderColor: 'gray.200',
      },
      footer: {
        borderColor: 'gray.200',
      },
    }),
  },
});

const {
  definePartsStyle: popoverPartsStyle,
  defineMultiStyleConfig: definePopoverMultiStyleConfig,
} = createMultiStyleConfigHelpers(popoverAnatomy.keys);

export const popoverTheme = definePopoverMultiStyleConfig({
  baseStyle: popoverPartsStyle({
    content: {
      overflow: 'unset',
      bg: '#1A1D24',
      border: '1px solid',
      borderColor: 'gray.700',
      borderRadius: 'lg',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
    },
    arrow: {
      '--popper-arrow-bg': '#1A1D24',
    },
  }),
  variants: {
    tour: popoverPartsStyle({
      content: {
        color: 'black',
        borderRadius: 'lg',
        bg: `gray.100`,
        overflow: 'unset',
        border: 'none',
      },
      header: {
        bg: `gray.100`,
        borderBottomWidth: 0,
        fontWeight: `bold`,
        paddingBottom: 0,
      },
      body: {
        bg: `gray.100`,
      },
      arrow: {
        '--popper-arrow-bg': 'var(--chakra-colors-gray-100)',
      },
    }),
  },
});

const {
  definePartsStyle: defineTabsPartsStyle,
  defineMultiStyleConfig: defineTabsMultiStyleConfig,
} = createMultiStyleConfigHelpers(tabsAnatomy.keys);

export const tabsTheme = defineTabsMultiStyleConfig({
  baseStyle: defineTabsPartsStyle({
    tab: {
      fontWeight: '500',
      fontSize: 'sm',
      transition: 'all 0.2s ease',
      _selected: {
        color: 'brand.400',
        borderColor: 'brand.400',
      },
      _hover: {
        color: 'gray.100',
      },
    },
    tablist: {
      borderColor: 'gray.700',
    },
  }),
  variants: {
    colorful: defineTabsPartsStyle({
      tab: {
        bg: 'gray.200',
        borderRadius: 10,
        _selected: {
          bg: 'gray.600',
          color: 'green',
        },
      },
    }),
  },
});

// Button theme
export const buttonTheme = defineStyleConfig({
  baseStyle: {
    fontWeight: '500',
    borderRadius: 'lg',
    transition: 'all 0.2s ease',
  },
  variants: {
    primary: {
      bg: 'brand.500',
      color: 'white',
      _hover: {
        bg: 'brand.400',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(0, 115, 230, 0.3)',
        _disabled: {
          bg: 'brand.500',
          transform: 'none',
          boxShadow: 'none',
        },
      },
      _active: {
        bg: 'brand.600',
        transform: 'translateY(0)',
      },
    },
    ghost: {
      _hover: {
        bg: 'whiteAlpha.100',
      },
    },
    solid: {
      bg: 'gray.700',
      _hover: {
        bg: 'gray.600',
        transform: 'translateY(-1px)',
        _disabled: {
          bg: 'gray.700',
          transform: 'none',
        },
      },
    },
    outline: {
      borderColor: 'gray.600',
      _hover: {
        bg: 'whiteAlpha.50',
        borderColor: 'gray.500',
      },
    },
  },
});

// Badge theme
export const badgeTheme = defineStyleConfig({
  baseStyle: {
    borderRadius: 'full',
    px: 2.5,
    py: 0.5,
    fontWeight: '500',
    fontSize: 'xs',
    textTransform: 'capitalize',
    letterSpacing: '0.02em',
  },
});

// Table theme
const {
  definePartsStyle: defineTablePartsStyle,
  defineMultiStyleConfig: defineTableMultiStyleConfig,
} = createMultiStyleConfigHelpers(tableAnatomy.keys);

export const tableTheme = defineTableMultiStyleConfig({
  baseStyle: defineTablePartsStyle({
    th: {
      color: 'gray.400',
      fontWeight: '600',
      textTransform: 'uppercase',
      fontSize: 'xs',
      letterSpacing: '0.06em',
      borderColor: 'gray.700',
    },
    td: {
      borderColor: 'gray.800',
      fontSize: 'sm',
    },
    tr: {
      transition: 'background-color 0.15s ease',
      _hover: {
        bg: 'whiteAlpha.50',
      },
    },
  }),
});

// Heading theme
export const headingTheme = defineStyleConfig({
  baseStyle: {
    fontWeight: '600',
    letterSpacing: '-0.01em',
  },
});

// Card theme
const {
  definePartsStyle: defineCardPartsStyle,
  defineMultiStyleConfig: defineCardMultiStyleConfig,
} = createMultiStyleConfigHelpers(cardAnatomy.keys);

export const cardTheme = defineCardMultiStyleConfig({
  baseStyle: defineCardPartsStyle({
    container: {
      bg: '#1A1D24',
      border: '1px solid',
      borderColor: 'gray.800',
      borderRadius: 'xl',
    },
  }),
});
