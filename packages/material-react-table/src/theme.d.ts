// theme.ts
export interface CustomTheme {
  direction: 'ltr' | 'rtl';
  zIndex: {
    modal: number;
  };
  palette: {
    mode: 'light' | 'dark';
    info: {
      main: string;
    };
    background: { default: string };
    grey: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    common: {
      black: string;
      white: string;
    };
  };
}

// emotion.d.ts
import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme extends CustomTheme {}
}
