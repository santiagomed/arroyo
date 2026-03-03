import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../../lib/data_fetching';
import Loading from '../../components/Loading';
import React, { useContext, useEffect } from 'react';
import WelcomeModal from '../../components/WelcomeModal';
import { TourContext, TourSteps } from '../../tour';
import { useNavbar } from '../../App';
import { FiActivity, FiCheckCircle, FiLayers, FiAlertTriangle } from 'react-icons/fi';
import { IconType } from 'react-icons';

interface Props {
  label: string;
  value?: string;
  color?: string;
  icon?: IconType;
  accentColor?: string;
}
export const Stat = (props: Props) => {
  const { label, value, color, icon, accentColor, ...boxProps } = props;
  return (
    <Box
      px={{ base: '5', md: '6' }}
      py={{ base: '5', md: '6' }}
      bg="#1A1D24"
      height={130}
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.800"
      position="relative"
      overflow="hidden"
      transition="all 0.2s ease"
      _hover={{
        borderColor: 'gray.700',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
      {...boxProps}
    >
      {accentColor && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          h="2px"
          bgGradient={`linear(to-r, ${accentColor}, transparent)`}
        />
      )}
      <Flex justify="space-between" align="flex-start">
        <Stack spacing={2}>
          <Text fontSize="xs" color="gray.400" fontWeight="500" textTransform="uppercase" letterSpacing="0.05em">
            {label}
          </Text>
          <Heading size="lg" color={color || 'white'} fontWeight="700">
            {value}
          </Heading>
        </Stack>
        {icon && (
          <Flex
            w={10}
            h={10}
            bg="whiteAlpha.50"
            borderRadius="lg"
            align="center"
            justify="center"
          >
            <Icon as={icon} boxSize={5} color={accentColor || 'gray.400'} />
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export function Home() {
  const { jobs, jobsLoading } = useJobs();
  const navigate = useNavigate();

  const { setMenuItems } = useNavbar();

  useEffect(() => {
    setMenuItems([]);
  }, []);

  const { tourActive, tourStep, setTourStep, disableTour } = useContext(TourContext);

  useEffect(() => {
    if (tourActive) {
      setTourStep(TourSteps.WelcomeModal);
    }
  }, []);

  let runningJobs = 0;
  let allJobs = 0;
  let finishedJobs = 0;
  let failedJobs = 0;

  if (!jobs || jobsLoading) {
    return <Loading />;
  }

  if (jobs) {
    runningJobs = jobs.filter(
      j => j.state == 'Running' || j.state == 'Checkpointing' || j.state == 'Compacting'
    ).length;
    allJobs = jobs.length;
    finishedJobs = jobs.filter(j => j.state == 'Finished').length;
    failedJobs = jobs.filter(j => j.state == 'Failed').length;
  }

  const createPipelineButton = (
    <Popover
      isOpen={tourStep == TourSteps.CreatePipelineButton}
      closeOnBlur={false}
      variant={'tour'}
    >
      <PopoverTrigger>
        <Button
          variant="primary"
          onClick={() => {
            navigate('/pipelines/new');
            setTourStep(TourSteps.CreatePipelineModal);
          }}
        >
          Create Pipeline
        </Button>
      </PopoverTrigger>
      <PopoverContent overflow={'unset'}>
        <PopoverArrow />
        <PopoverCloseButton onClick={disableTour} />
        <PopoverHeader>Create Pipeline</PopoverHeader>
        <PopoverBody>Click here to start creating a pipeline.</PopoverBody>
      </PopoverContent>
    </Popover>
  );

  return (
    <Container py="8" flex="1" maxW="container.xl">
      <WelcomeModal />
      <Stack spacing={{ base: '8', lg: '6' }}>
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          justify="space-between"
          align={{ base: 'start', lg: 'center' }}
        >
          <Stack spacing="1">
            <Heading size="md" fontWeight="600" color="white">
              Dashboard
            </Heading>
            <Text fontSize="sm" color="gray.400">
              Overview of your streaming pipelines
            </Text>
          </Stack>
          <HStack spacing="3" mt={{ base: 4, lg: 0 }}>{createPipelineButton}</HStack>
        </Flex>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="5">
          <Stat
            label="Running Jobs"
            value={runningJobs?.toString()}
            icon={FiActivity}
            accentColor="green.400"
          />
          <Stat
            label="All Jobs"
            value={allJobs?.toString()}
            icon={FiLayers}
            accentColor="brand.400"
          />
          <Stat
            label="Finished Jobs"
            value={finishedJobs?.toString()}
            icon={FiCheckCircle}
            accentColor="blue.300"
          />
          <Stat
            label="Failed Jobs"
            value={failedJobs?.toString()}
            color={failedJobs != null && failedJobs > 0 ? 'red.300' : undefined}
            icon={FiAlertTriangle}
            accentColor={failedJobs != null && failedJobs > 0 ? 'red.400' : 'gray.500'}
          />
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
