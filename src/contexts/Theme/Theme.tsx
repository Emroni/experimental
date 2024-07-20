'use client';
import { theme } from '@/setup';
import { CssBaseline, ThemeProvider as MuiThemeProvider, Theme } from '@mui/material';
import { createContext, useContext } from 'react';

const ThemeContext = createContext<Theme>({} as Theme);

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: ThemeProviderProps) {

    return <ThemeContext.Provider value={theme}>
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </MuiThemeProvider>
    </ThemeContext.Provider>;

}