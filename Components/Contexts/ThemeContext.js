import { createContext } from "react";

export const themes = {
    light: {
        type: 'light',
        accent: 'blue',
        accentLight: '#8E9FDC',
        background: 'white',
        foreground: 'black',
        gray: 'lightgray',
        fontRegular: 'AtkinsonHyperlegible',
        fontBold: 'AtkinsonHyperlegible-Bold',
        defaultPadding: 20,
        borderRadius: 15,
        homeComponentsBottomMargin: '15%'
    },
    dark: {
        type: 'dark',
        accent: '#2E282A',
        accentLight: '#bfae78',
        background: 'black',
        foreground: '#F9E7E7',
        gray: '#0f0f0f',
        fontRegular: 'AtkinsonHyperlegible',
        fontBold: 'AtkinsonHyperlegible-Bold',
        defaultPadding: 20,
        borderRadius: 15,
        homeComponentsBottomMargin: '15%'
    }
}
export const ThemeContext = createContext({})