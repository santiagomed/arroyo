import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInputField,
  NumberInput,
  Stack,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Box,
} from '@chakra-ui/react';
import React from 'react';
import { SqlOptions } from '../lib/types';

export interface StartPipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  startError: string | null;
  options: SqlOptions;
  setOptions: (s: SqlOptions) => void;
  start: () => void;
}

const StartPipelineModal: React.FC<StartPipelineModalProps> = ({
  isOpen,
  onClose,
  startError,
  options,
  setOptions,
  start,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={startError ? '4xl' : 'xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Start Pipeline</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={6}>
            {startError ? (
              <Alert status="error" borderRadius="lg">
                <AlertIcon />
                <AlertDescription overflowY={'auto'} maxH={400} whiteSpace={'pre-wrap'} fontSize="sm">
                  {startError}
                </AlertDescription>
              </Alert>
            ) : null}

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500" color="gray.300">Name</FormLabel>
              <Input
                type="text"
                value={options.name || ''}
                onChange={v => setOptions({ ...options, name: v.target.value })}
                bg="whiteAlpha.50"
                border="1px solid"
                borderColor="gray.700"
                borderRadius="lg"
                _hover={{ borderColor: 'gray.600' }}
                _focus={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)' }}
              />
              <FormHelperText color="gray.500" fontSize="xs">Give this pipeline a name to help you identify it</FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500" color="gray.300">Parallelism</FormLabel>
              <Box>
                <NumberInput
                  step={1}
                  min={1}
                  max={1024}
                  value={options.parallelism || 1}
                  onChange={v => setOptions({ ...options, parallelism: Number(v) })}
                >
                  <NumberInputField
                    bg="whiteAlpha.50"
                    border="1px solid"
                    borderColor="gray.700"
                    borderRadius="lg"
                    _hover={{ borderColor: 'gray.600' }}
                    _focus={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)' }}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper borderColor="gray.700" />
                    <NumberDecrementStepper borderColor="gray.700" />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
              <FormHelperText color="gray.500" fontSize="xs">
                How many parallel subtasks should be used for this pipeline
              </FormHelperText>
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose} variant="ghost">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={start}
            isDisabled={options.name == '' || options.parallelism == null}
          >
            Start
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StartPipelineModal;
