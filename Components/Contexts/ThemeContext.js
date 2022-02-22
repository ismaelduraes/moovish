import { createContext } from "react";

//make sure all colors are in hex
export const themes = {
    light: {
        type: 'light',
        accent: '#fc0303', //tomato-ish
        accentAlt: '#ffffff', //white
        background: '#ffffff', //black
        foreground: '#000000', //white
        gray: '#cccccc',
        fontRegular: 'AtkinsonHyperlegible',
        fontBold: 'AtkinsonHyperlegible-Bold',
        defaultPadding: 20,
        borderRadius: 12,
        homeComponentsBottomMargin: '9%'
    },
    dark: {
        type: 'dark',
        accent: '#fc0303',
        accentAlt: '#000000', // black
        background: '#000000', //black
        foreground: '#f9e7e7',
        gray: '#0f0f0f',
        fontRegular: 'AtkinsonHyperlegible',
        fontBold: 'AtkinsonHyperlegible-Bold',
        defaultPadding: 20,
        borderRadius: 15,
        homeComponentsBottomMargin: '9%'
    }
}
export const ThemeContext = createContext({})