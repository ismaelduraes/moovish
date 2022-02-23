import { createContext } from "react";

//make sure all colors are in hex
export const themes = {
    light: {
        type: 'light',
        accent: '#b84239', //tomato-ish
        accentAlt: '#b84239', //white
        background: '#ffffff', //black
        foreground: '#000000', //white
        gray: '#d6d6d6',
        fontRegular: 'Manrope-Regular',
        fontBold: 'Manrope-ExtraBold',
        defaultPadding: 20,
        borderRadius: 12,
        homeComponentsBottomMargin: '9%'
    },
    dark: {
        type: 'dark',
        accent: '#b84239',
        accentAlt: '#1a0706', // black
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