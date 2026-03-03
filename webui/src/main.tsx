import './index.css';

import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import { theme as proTheme } from '@chakra-ui/pro-theme';
import '@fontsource/inter/variable.css';

import { modalTheme, popoverTheme, tabsTheme, buttonTheme, badgeTheme, tableTheme, headingTheme, cardTheme } from './theming';
import { createRoot } from './lib/CloudComponents';

declare global {
  interface Window {
    __ARROYO_BASENAME: string;
  }
}

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme(proTheme, {
  colors: {
    ...proTheme.colors,
    brand: {
      50: '#e6f2ff',
      100: '#b3d9ff',
      200: '#80bfff',
      300: '#4da6ff',
      400: '#1a8cff',
      500: '#0073e6',
      600: '#005bb4',
      700: '#004282',
      800: '#002a50',
      900: '#00111f',
    },
    gray: {
      ...proTheme.colors.gray,
      750: '#1E2028',
      850: '#151720',
      950: '#0D0F14',
    },
  },
  config: config,
  fonts: {
    heading: `'InterVariable', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`,
    body: `'InterVariable', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: '#0D0F14',
        color: 'gray.100',
      },
    },
  },
  shadows: {
    'sm-dark': '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
    'md-dark': '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.4)',
    glow: '0 0 20px rgba(0, 115, 230, 0.15)',
    'glow-sm': '0 0 10px rgba(0, 115, 230, 0.1)',
  },
  components: {
    Modal: modalTheme,
    Popover: popoverTheme,
    Tabs: tabsTheme,
    Button: buttonTheme,
    Badge: badgeTheme,
    Table: tableTheme,
    Heading: headingTheme,
    Card: cardTheme,
  },
});

const rootElement = document.getElementById('root');
createRoot(rootElement!, theme);
