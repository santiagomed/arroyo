import React from 'react';
import { Job, Pipeline, usePipelineJobs } from '../lib/data_fetching';
import { Badge, Flex, IconButton, Link, Td, Tr, Text } from '@chakra-ui/react';
import { formatDate, relativeTime } from '../lib/util';
import { FiCopy, FiXCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export interface IndicatorProps {
  content: string | undefined;
  label?: string;
  color?: string;
}

const Indicator: React.FC<IndicatorProps> = ({ content, label, color }) => {
  return (
    <Flex direction={'column'} justifyContent={'center'} flex={'0 0 100px'}>
      <Text
        fontWeight="500"
        fontSize="sm"
        textOverflow={'ellipsis'}
        whiteSpace={'normal'}
        wordBreak={'break-all'}
        noOfLines={1}
        color={color || 'gray.100'}
      >
        {content}
      </Text>
      {label && <Text fontSize="xs" color="gray.500" mt={0.5}>{label}</Text>}
    </Flex>
  );
};

export interface JobCardProps {
  job: Job;
}

const jobDuration = (job: Job) => {
  if (job.start_time == null) {
    return 0;
  } else if (job.finish_time == null) {
    return Date.now() * 1000 - Number(job.start_time);
  } else {
    return job.finish_time - job.start_time;
  }
};

function stateColorScheme(state: string): string {
  switch (state) {
    case 'Running':
      return 'green';
    case 'Failed':
      return 'red';
    case 'Stopping':
      return 'orange';
    case 'Checkpointing':
    case 'Compacting':
      return 'blue';
    case 'Finished':
      return 'cyan';
  }
  return 'gray';
}

function formatDuration(micros: number): string {
  let millis = micros / 1000;
  let secs = Math.floor(millis / 1000);
  if (secs < 60) {
    return `${secs}s`;
  } else if (millis / 1000 < 60 * 60) {
    let minutes = Math.floor(secs / 60);
    let seconds = secs - minutes * 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  } else {
    let hours = Math.floor(secs / (60 * 60));
    let minutes = Math.floor((secs - hours * 60 * 60) / 60);
    let seconds = secs - hours * 60 * 60 - minutes * 60;
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
}

export interface PipelineRowProps {
  pipeline: Pipeline;
  setPipelineIdToBeDeleted: (pipelineId: string) => void;
  onOpen: () => void;
}

const PipelineRow: React.FC<PipelineRowProps> = ({
  pipeline,
  setPipelineIdToBeDeleted,
  onOpen,
}) => {
  const { jobs } = usePipelineJobs(pipeline.id);
  let navigate = useNavigate();

  if (!jobs) {
    return <></>;
  }

  let job = jobs[0];

  return (
    <Tr key={pipeline.id}>
      <Td key={'name'} minWidth={230} maxWidth={'400px'}>
        <Link onClick={() => navigate(`/pipelines/${pipeline.id}`)}>
          <Indicator content={pipeline.name} label={pipeline.id} />
        </Link>
      </Td>
      <Td key={'created_at'} minWidth={230}>
        <Indicator
          content={formatDate(BigInt(pipeline.created_at))}
          label={relativeTime(pipeline.created_at)}
        />
      </Td>
      <Td key={'state'}>
        {job?.state ? (
          <Badge colorScheme={stateColorScheme(job?.state)} variant="subtle" px={2.5} py={0.5} borderRadius="full" fontSize="xs">
            {job?.state}
          </Badge>
        ) : (
          <Text color="gray.500" fontSize="sm">—</Text>
        )}
      </Td>
      <Td>
        <Indicator content={job ? formatDuration(jobDuration(job)) : undefined} />
      </Td>
      <Td>
        <Indicator content={job?.tasks ? job.tasks.toString() : 'n/a'} />
      </Td>
      <Td key={'actions'} textAlign="right">
        <IconButton
          onClick={() => navigate('/pipelines/new?from=' + pipeline.id)}
          icon={<FiCopy fontSize="1.25rem" />}
          variant="ghost"
          aria-label="Duplicate"
          title="Copy"
        />
        <IconButton
          icon={<FiXCircle fontSize="1.25rem" />}
          variant="ghost"
          aria-label="Delete source"
          onClick={() => {
            setPipelineIdToBeDeleted(pipeline.id);
            onOpen();
          }}
          title="Delete"
        />
      </Td>
    </Tr>
  );
};

export default PipelineRow;
