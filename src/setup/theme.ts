import '@fontsource-variable/work-sans';
import { createTheme } from '@mui/material';

export const theme = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                sizeLarge: {
                    borderRadius: 0,
                },
            },
        },
        MuiListItemText: {
            styleOverrides: {
                multiline: {
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    justifyContent: 'flex-end',
                    gap: 4,
                },
                secondary: {
                    width: 30,
                },
            },
        },
    },
    palette: {
        mode: 'dark',
    },
    typography: {
        fontFamily: 'Work Sans Variable, sans-serif',
    },
});