import { createContext } from "react";

//make sure all colors are in hex
export const themes = {
    light: {
        type: 'light',
        accent: '#de3400', //tomato-ish
        accentAlt: '#b84239', //white
        background: '#ffffff', //black
        foreground: '#000000', //white
        gray: '#e3e3e3',
        fontRegular: 'Rubik-Regular',
        fontBold: 'Rubik-Bold',
        defaultPadding: 20,
        borderRadius: 12,
        homeComponentsBottomMargin: '9%'
    },
    dark: {
        type: 'dark',
        accent: '#E4572E',
        accentAlt: '#266DD3',
        background: '#000000', //black
        foreground: '#f9e7e7',
        gray: '#0f0f0f',
        fontRegular: 'Rubik-Regular',
        fontBold: 'Rubik-Bold',
        defaultPadding: 20,
        borderRadius: 15,
        homeComponentsBottomMargin: '10%'
    }
}
export const ThemeContext = createContext({})