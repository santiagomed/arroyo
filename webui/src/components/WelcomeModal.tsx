import React, { useContext } from 'react';
import {
  Button,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { TourContext, TourSteps } from '../tour';

const WelcomeModal: React.FC = () => {
  const { tourStep, setTourStep, disableTour } = useContext(TourContext);

  return (
    <Modal
      isOpen={tourStep == TourSteps.WelcomeModal}
      onClose={() => {}}
      isCentered
      size={'xl'}
      variant={'tour'}
    >
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
      <ModalContent padding={8} borderRadius="2xl">
        <ModalCloseButton onClick={disableTour} />
        <ModalBody display={'flex'} gap={6} flexDirection={'column'} alignItems={'center'}>
          <img width="160" src={`${window.__ARROYO_BASENAME}/assets/logo.svg`} />
          <Text fontSize={'md'} textAlign="center" lineHeight="tall">
            Welcome! Arroyo is a distributed stream processing engine, designed to efficiently
            perform stateful computations on streams of data.
            <br />
            <br />
            Want some help running your first pipeline?
          </Text>
        </ModalBody>
        <ModalFooter
          display={'flex'}
          flexDirection={'column'}
          gap={3}
          justifyContent={'center'}
          border="none"
        >
          <Button
            colorScheme={'blue'}
            onClick={() => setTourStep(TourSteps.CreatePipelineButton)}
            borderRadius="lg"
            px={8}
          >
            Let's do it!
          </Button>
          <Link>
            <Text fontSize={'sm'} color={'gray.500'} onClick={disableTour} _hover={{ color: 'gray.400' }}>
              No thanks
            </Text>
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WelcomeModal;
