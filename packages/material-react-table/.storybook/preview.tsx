import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';

import React, { useEffect, useState } from 'react';
import { Classes } from '@blueprintjs/core';
import { addons } from '@storybook/preview-api';
import { Preview } from '@storybook/react';
import { DARK_MODE_EVENT_NAME } from 'storybook-dark-mode';

import { ThemeProvider } from '@emotion/react';
import { CustomTheme } from '../src/theme';

const channel = addons.getChannel();

const commonTheme = {
  direction: 'ltr' as const,
  zIndex: {
    modal: 1300,
  },
  palette: {
    common: {
      black: '#000',
      white: '#fff',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
};

const lightTheme: CustomTheme = {
  ...commonTheme,
  palette: {
    ...commonTheme.palette,
    info: {
      main: '#1976d2',
    },
    mode: 'light',
    background: { default: '#f5f5f5' },
  },
};

const darkTheme: CustomTheme = {
  ...commonTheme,
  palette: {
    ...commonTheme.palette,
    info: {
      main: '#90caf9',
    },
    mode: 'dark',
    background: { default: '#30404d' },
    grey: {
      50: '#f5f5f5',
      100: '#eeeeee',
      200: '#e0e0e0',
      300: '#bdbdbd',
      400: '#9e9e9e',
      500: '#757575',
      600: '#616161',
      700: '#424242',
      800: '#212121',
      900: '#212121',
    },
  },
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const [isDark, setDark] = useState(true);
      const theme = isDark ? darkTheme : lightTheme;

      useEffect(() => {
        const sbRoot = document.getElementsByClassName(
          'sb-show-main',
        )[0] as HTMLElement;
        channel.on(DARK_MODE_EVENT_NAME, setDark);
        if (sbRoot) {
          sbRoot.style.backgroundColor = theme.palette.background.default;
        }
        return () => channel.off(DARK_MODE_EVENT_NAME, setDark);
      }, [theme]);

      useEffect(() => {
        if (process.env.NODE_ENV === 'development') return;
        const script = document.createElement('script');
        script.src = 'https://plausible.io/js/script.js';
        script.setAttribute('data-domain', 'material-react-table.dev');
        script.defer = true;

        document.body.appendChild(script);
        return () => {
          document.body.removeChild(script);
        };
      }, []);

      return (
        <ThemeProvider theme={theme}>
          <div className={isDark ? Classes.DARK : undefined}>
            <Story {...context} />
          </div>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
