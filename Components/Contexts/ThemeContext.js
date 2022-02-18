import { createContext } from "react";

//make sure all colors are in hex
export const themes = {
    light: {
        type: 'light',
        accent: '#9c0a00', //tomato-ish
        accentAlt: '#ffffff', //white
        background: '#ffffff', //black
        foreground: '#000000', //white
        gray: '#0f0f0f',
        fontRegular: 'AtkinsonHyperlegible',
        fontBold: 'AtkinsonHyperlegible-Bold',
        defaultPadding: 20,
        borderRadius: 12,
        homeComponentsBottomMargin: '12%'
    },
    dark: {
        type: 'dark',
        accent: '#d6be81',
        accentAlt: '#000000', // black
        background: '#000000', //black
        foreground: '#F9e7e7',
        gray: '#0f0f0f',
        fontRegular: 'AtkinsonHyperlegible',
        fontBold: 'AtkinsonHyperlegible-Bold',
        defaultPadding: 20,
        borderRadius: 15,
        homeComponentsBottomMargin: '12%'
    }
}
export const ThemeContext = createContext({})