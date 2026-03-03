import React from 'react';
import { Button, Flex, Heading, Text, VStack, Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const PageNotFound: React.FC = () => {
  const navigate = useNavigate();

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
          <Heading size="2xl" color="gray.500" fontWeight="700">
            ?
          </Heading>
        </Box>
        <VStack spacing={2}>
          <Heading size="md" color="white" fontWeight="600">
            Page not found
          </Heading>
          <Text color="gray.400" fontSize="sm">
            The page you're looking for doesn't exist or has been moved.
          </Text>
        </VStack>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/')}
        >
          Go back home
        </Button>
      </VStack>
    </Flex>
  );
};

export default PageNotFound;
