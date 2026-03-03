import { Flex, Spinner } from '@chakra-ui/react';
import React from 'react';

export interface LoadingProps {
  size?: string;
}

const Loading: React.FC<LoadingProps> = ({ size = 'xl' }) => {
  return (
    <Flex justify={'center'} alignItems={'center'} height={'75%'} p={8}>
      <Spinner
        speed="0.8s"
        emptyColor="whiteAlpha.100"
        color="brand.400"
        size={size}
        thickness="3px"
      />
    </Flex>
  );
};

export default Loading;
