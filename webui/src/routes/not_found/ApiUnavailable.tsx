import React from 'react';
import { Button, Flex, Heading, Icon, Text, VStack, Box } from '@chakra-ui/react';
import { BiTransferAlt } from 'react-icons/bi';

const ApiUnavailable: React.FC = () => {
  return (
    <Flex justify="center" align="center" height="90vh" direction="column">
      <VStack spacing={6}>
        <Box
          w={20}
          h={20}
          borderRadius="2xl"
          bg="whiteAlpha.50"
          display="flex"
          alignItems="center"
          justifyContent="center"
          border="1px solid"
          borderColor="gray.800"
        >
          <Icon as={BiTransferAlt} boxSize={10} color="gray.500" />
        </Box>
        <VStack spacing={2}>
          <Heading size="md" color="white" fontWeight="600">
            API Unavailable
          </Heading>
          <Text color="gray.400" fontSize="sm" textAlign="center" maxW="sm">
            The Arroyo API is currently unavailable. Please check that the server is running.
          </Text>
        </VStack>
        <Button
          variant="primary"
          size="sm"
          onClick={() => location.reload()}
        >
          Try again
        </Button>
      </VStack>
    </Flex>
  );
};

export default ApiUnavailable;
