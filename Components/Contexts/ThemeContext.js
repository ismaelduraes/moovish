import { createContext } from "react";

//make sure all colors are in hex
export const themes = {
    light: {
        type: 'light',
        accent: '#b56d19', //tomato-ish
        accentAlt: '#b84239', //white
        background: '#ffffff', //black
        foreground: '#000000', //white
        gray: '#e3e3e3',
        fontRegular: 'Manrope-Regular',
        fontBold: 'Manrope-ExtraBold',
        defaultPadding: 20,
        borderRadius: 12,
        homeComponentsBottomMargin: '9%'
    },
    dark: {
        type: 'dark',
        accent: '#9FC2CC',
        accentAlt: '#266DD3',
        background: '#000000', //black
        foreground: '#f9e7e7',
        gray: '#0f0f0f',
        fontRegular: 'Manrope-Regular',
        fontBold: 'Manrope-ExtraBold',
        defaultPadding: 20,
        borderRadius: 15,
        homeComponentsBottomMargin: '9%'
    }
}
export const ThemeContext = createContext({})