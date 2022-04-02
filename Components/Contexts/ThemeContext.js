import {createContext} from 'react';

//make sure all colors are in hex
export const themes = {
  light: {
    type: 'light',
    accent: '#b31b34', //tomato-ish
    accentAlt: '#b84239', //white
    background: '#ffffff', //black
    foreground: '#000000', //white
    gray: '#e3e3e3',
    fontRegular: 'Rubik-Regular',
    fontBold: 'Rubik-Bold',
    defaultPadding: 20,
    borderRadius: 10,
    homeComponentsBottomMargin: '10%',
  },
  dark: {
    type: 'dark',
    accent: '#e42e4c',
    accentAlt: '#266DD3',
    background: '#000000', //black
    foreground: '#f9e7e7',
    gray: '#0a0a0a',
    fontRegular: 'Rubik-Regular',
    fontBold: 'Rubik-Bold',
    defaultPadding: 20,
    borderRadius: 10,
    homeComponentsBottomMargin: '10%',
  },
};
export const ThemeContext = createContext({});
