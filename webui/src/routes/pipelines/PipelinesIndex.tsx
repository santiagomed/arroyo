import './pipelines.css';

import { Button, Container, Flex, Heading, HStack, Stack, Text } from '@chakra-ui/react';
import { useLinkClickHandler } from 'react-router-dom';
import React, { useEffect } from 'react';
import PipelinesTable from '../../components/PipelinesTable';
import { useNavbar } from '../../App';

export function PipelinesIndex() {
  const { setMenuItems } = useNavbar();

  useEffect(() => {
    setMenuItems([]);
  }, []);

  return (
    <Container py="8" flex="1" maxW="container.xl">
      <Stack spacing={{ base: '8', lg: '6' }}>
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          justify="space-between"
          align={{ base: 'start', lg: 'center' }}
        >
          <Stack spacing="1">
            <Heading size="md" fontWeight="600" color="white">
              Pipelines
            </Heading>
            <Text fontSize="sm" color="gray.400">
              Manage your streaming pipelines
            </Text>
          </Stack>
          <HStack spacing="3" mt={{ base: 4, lg: 0 }}>
            <Button variant="primary" onClick={useLinkClickHandler('/pipelines/new')}>
              Create Pipeline
            </Button>
          </HStack>
        </Flex>
        <Stack spacing={{ base: '5', lg: '6' }}>
          <PipelinesTable />
        </Stack>
      </Stack>
    </Container>
  );
}
