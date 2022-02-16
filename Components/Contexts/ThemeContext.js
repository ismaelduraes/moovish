import { createContext } from "react";

export const themes = {
    default: {
        accent: 'crimson',
        accentLight: '8E9FDC',
        background: 'black',
        foreground: 'white',
        gray: '#0f0f0f',
        fontRegular: 'AtkinsonHyperlegible',
        fontBold: 'AtkinsonHyperlegible-Bold'
    }
}
export const ThemeContext = createContext({})