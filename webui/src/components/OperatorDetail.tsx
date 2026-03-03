import {
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  Box,
  Code,
  HStack,
  Spacer,
} from '@chakra-ui/react';

import { getCurrentMaxMetric, transformMetricGroup } from '../lib/util';
import React from 'react';
import { TimeSeriesGraph } from './TimeSeriesGraph';
import Loading from './Loading';
import { useJobMetrics, usePipeline } from '../lib/data_fetching';
import { components } from '../gen/api-types';

export interface OperatorDetailProps {
  pipelineId: string;
  jobId: string;
  nodeId: number;
}

const OperatorDetail: React.FC<OperatorDetailProps> = ({ pipelineId, jobId, nodeId }) => {
  const { pipeline } = usePipeline(pipelineId);
  const { operatorMetricGroups, operatorMetricGroupsLoading, operatorMetricGroupsError } =
    useJobMetrics(pipelineId, jobId);

  if (operatorMetricGroupsError) {
    return (
      <Alert status="warning">
        <AlertIcon />
        <AlertDescription>Failed to get job metrics.</AlertDescription>
      </Alert>
    );
  }

  if (!pipeline || !operatorMetricGroups || operatorMetricGroupsLoading) {
    return <Loading size={'lg'} />;
  }

  const node = pipeline.graph.nodes.find(n => n.node_id == nodeId);
  const operatorMetricGroup = operatorMetricGroups.find(o => o.node_id == nodeId);

  if (!operatorMetricGroup) {
    return <Loading size={'lg'} />;
  }

  const metricGroups = operatorMetricGroup.metric_groups;

  const backpressureGroup = metricGroups.find(m => m.name == 'backpressure');
  const backpressure = backpressureGroup ? getCurrentMaxMetric(backpressureGroup) : 0;
  let backpressureBadge;
  if (backpressure < 0.33) {
    backpressureBadge = <Badge colorScheme={'green'}>LOW</Badge>;
  } else if (backpressure < 0.66) {
    backpressureBadge = <Badge colorScheme={'yellow'}>MEDIUM</Badge>;
  } else {
    backpressureBadge = <Badge colorScheme={'red'}>HIGH</Badge>;
  }

  function createGraph(
    metricGroups: components['schemas']['MetricGroup'][],
    groupName: string,
    graphTitle: string
  ) {
    let msgCount = 0;
    let graph = <></>;
    const group = metricGroups.find(m => m.name === groupName);
    if (
      group &&
      group.subtasks.length > 0 &&
      group.subtasks.map(s => s.metrics.length).every(l => l > 0)
    ) {
      msgCount = group.subtasks
        .map(s => s.metrics[s.metrics.length - 1].value)
        .reduce((a, c) => a + c, 0);
      const data = transformMetricGroup(group);
      graph = (
        <Box className="chart" marginTop="20px" fontSize={14}>
          {graphTitle}
          <TimeSeriesGraph data={data} timeWindowMs={5 * 60 * 1000} />
        </Box>
      );
    }
    return { msgCount, graph };
  }

  const { msgCount: msgRecv, graph: eventsReceivedGraph } = createGraph(
    metricGroups,
    'messages_recv',
    'Events RX'
  );
  const { msgCount: msgSent, graph: eventsSentGraph } = createGraph(
    metricGroups,
    'messages_sent',
    'Events TX'
  );

  return (
    <Box
      className="operatorDetail"
      marginTop={6}
      padding="16px"
      border="1px solid"
      borderColor="gray.700"
      borderRadius="xl"
      bg="#1A1D24"
    >
      <HStack fontWeight="600" fontSize="sm">
        <Box color="gray.200">Operator</Box>
        <Spacer />
        <Badge variant="subtle" colorScheme="gray" fontSize="xs" title="parallelism for this operator">
          ×{node?.parallelism}
        </Badge>
      </HStack>
      <Box marginTop="12px" fontSize="sm">Backpressure: {backpressureBadge}</Box>
      <Box marginTop="12px" fontSize="sm">
        <Badge variant="outline" colorScheme="gray" fontSize="xs" mr={2} title={'ID of this node'}>
          #{node?.node_id}
        </Badge>
        <Box as="span" color="gray.300">{node?.description}</Box>
      </Box>
      <Box marginTop="12px" fontFamily="'IBM Plex Mono', monospace" fontSize="xs">
        <Code bg="whiteAlpha.100" color="green.300" px={2} py={0.5} borderRadius="md">{Math.round(msgRecv)} eps</Code>
        <Box as="span" color="gray.500" mx={1}>rx</Box>
        <Code bg="whiteAlpha.100" color="blue.300" px={2} py={0.5} borderRadius="md" ml={2}>{Math.round(msgSent)} eps</Code>
        <Box as="span" color="gray.500" mx={1}>tx</Box>
      </Box>
      {eventsReceivedGraph}
      {eventsSentGraph}
    </Box>
  );
};

export default OperatorDetail;
