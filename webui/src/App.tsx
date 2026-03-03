import './App.css';
import {
  Box,
  Button,
  ButtonProps,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  IconButton,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';

import { Link, Outlet, useLinkClickHandler, useMatch } from 'react-router-dom';
import { FiGitBranch, FiHome, FiLink } from 'react-icons/fi';
import { CloudSidebar, UserProfile } from './lib/CloudComponents';
import { usePing } from './lib/data_fetching';
import ApiUnavailable from './routes/not_found/ApiUnavailable';
import Loading from './components/Loading';
import React, { ReactNode, createContext, useContext, useState } from 'react';
import { getTourContextValue, TourContext } from './tour';
import { getLocalUdfsContextValue, LocalUdfsContext } from './udf_state';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import useLocalStorage from 'use-local-storage';
import { IconType } from 'react-icons';

function logout() {
  // TODO: also send a request to the server to delete the session
  //clearSession();
  location.reload();
}

interface NavButtonProps extends ButtonProps {
  icon: IconType;
  label: string;
  to?: string;
  collapsed: boolean;
  isActive?: boolean;
}

export const NavButton = (props: NavButtonProps) => {
  const { icon, label, collapsed, ...buttonProps } = props;

  let isActive = props.isActive || useMatch(props.to + '/*');

  let onClick = props.to ? useLinkClickHandler(props.to) : props.onClick;

  const button = (
    <Button
      variant="ghost"
      justifyContent="start"
      width="full"
      position="relative"
      /* @ts-ignore */
      onClick={onClick}
      aria-current={isActive ? 'page' : 'false'}
      title={label}
      borderRadius="lg"
      py={2.5}
      px={collapsed ? 2.5 : 3}
      bg={isActive ? 'whiteAlpha.100' : 'transparent'}
      color={isActive ? 'white' : 'gray.400'}
      _hover={{
        bg: 'whiteAlpha.100',
        color: 'white',
      }}
      {...buttonProps}
    >
      {isActive && (
        <Box
          position="absolute"
          left={0}
          top="50%"
          transform="translateY(-50%)"
          w="3px"
          h="60%"
          bg="brand.400"
          borderRadius="full"
        />
      )}
      <HStack spacing="3" justify={collapsed ? 'center' : 'start'} w="full">
        <Icon
          as={icon}
          boxSize="5"
          color={isActive ? 'brand.400' : 'gray.400'}
          transition="color 0.15s ease"
        />
        {!collapsed && (
          <Text fontSize="sm" fontWeight={isActive ? '600' : '400'} whiteSpace="nowrap">
            {label}
          </Text>
        )}
      </HStack>
    </Button>
  );

  if (collapsed) {
    return (
      <Tooltip label={label} placement="right" hasArrow openDelay={200}>
        {button}
      </Tooltip>
    );
  }

  return button;
};

const Sidebar = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
}) => {
  const { menuItems } = useNavbar();

  return (
    <GridItem className="sidebar" area={'nav'} overflow="hidden">
      <Flex as="section" minH="100vh">
        <Flex
          flex="1"
          bg="#12141A"
          borderRight="1px solid"
          borderColor="gray.800"
          maxW={'xs'}
          py={4}
          px={3}
          justify={'center'}
          overflow="hidden"
        >
          <Stack justify="space-between" spacing="1" width="full">
            <Stack spacing="5" shouldWrapChildren>
              <Flex justify={'center'} py={1}>
                <Link to={'/'}>
                  <img
                    style={{ height: 32 }}
                    src={
                      window.__ARROYO_BASENAME +
                      (collapsed ? '/assets/icon.svg' : '/assets/logo.svg')
                    }
                  />
                </Link>
              </Flex>
              <Stack spacing="1">
                <NavButton label="Home" to="/" icon={FiHome} collapsed={collapsed} />
                <NavButton
                  label="Connections"
                  to="connections"
                  icon={FiLink}
                  collapsed={collapsed}
                />
                <NavButton
                  label="Pipelines"
                  to="pipelines"
                  icon={FiGitBranch}
                  collapsed={collapsed}
                />
              </Stack>
              <Box h="1px" bg="gray.800" mx={-1} />
              <Stack>
                <CloudSidebar />
              </Stack>
              <Stack spacing="1">
                {menuItems.map(item => (
                  <NavButton
                    key={item.label}
                    label={item.label}
                    onClick={item.onClick}
                    icon={item.icon}
                    isActive={item.selected}
                    collapsed={collapsed}
                  />
                ))}
              </Stack>
            </Stack>
            <Stack display={'none'}>
              <Box h="1px" bg="gray.800" />
              <UserProfile />
            </Stack>
            <Flex justify={'center'}>
              <IconButton
                aria-label="collapse sidebar"
                onClick={() => setCollapsed(!collapsed)}
                variant="ghost"
                size="sm"
                borderRadius="full"
                color="gray.500"
                _hover={{ bg: 'whiteAlpha.100', color: 'gray.200' }}
                icon={
                  collapsed ? <ChevronRightIcon boxSize={5} /> : <ChevronLeftIcon boxSize={5} />
                }
              />
            </Flex>
          </Stack>
        </Flex>
      </Flex>
    </GridItem>
  );
};

export type SubnavType = {
  icon: IconType;
  label: string;
  onClick: () => void;
  selected: boolean;
};

interface NavbarContextType {
  menuItems: SubnavType[];
  setMenuItems: (items: SubnavType[]) => void;
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export const NavbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<SubnavType[]>([]);

  return (
    <NavbarContext.Provider value={{ menuItems, setMenuItems }}>{children}</NavbarContext.Provider>
  );
};

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (context === undefined) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
};

function App() {
  const { ping, pingLoading, pingError } = usePing();
  const tourContextValue = getTourContextValue();
  const localUdfsContextValue = getLocalUdfsContextValue();
  const [collapsed, setCollapsed] = useLocalStorage('sidebar-collapse', false);

  let content = (
    <GridItem className="main" area={'main'} overflow={'auto'} bg="#0D0F14">
      {<Outlet />}
    </GridItem>
  );

  if (pingLoading) {
    return <Loading />;
  }

  if (!ping || pingError) {
    content = <ApiUnavailable />;
  }

  return (
    <TourContext.Provider value={tourContextValue}>
      <LocalUdfsContext.Provider value={localUdfsContextValue}>
        <NavbarProvider>
          <Grid
            templateAreas={'"nav main"'}
            gridTemplateColumns={`${collapsed ? '80px' : '175px'} 1fr`}
            h="100vh"
            transition="grid-template-columns 0.2s ease"
            sx={{
              '& > *': {
                transition: 'all 0.2s ease',
              },
            }}
          >
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            {content}
          </Grid>
        </NavbarProvider>
      </LocalUdfsContext.Provider>
    </TourContext.Provider>
  );
}

export default App;
