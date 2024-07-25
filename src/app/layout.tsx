import { Sidebar } from '@/components';
import { ThemeProvider } from '@/contexts/Theme/Theme';
import { Box } from '@mui/material';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Experimental - Emre Koc',
    description: 'Generated by create next app',
    openGraph: {
        description: 'Just some experimental digital artwork',
        images: [
            {
                height: 630,
                width: 1200,
                url: 'https://experimental.emroni.com/assets/share.png',
            },
        ],
        siteName: 'Experimental',
        title: 'Experimental',
        type: 'website',
        url: 'https://experimental.emroni.com',
    },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

    return <html lang="en">
        <ThemeProvider>
            <Box component="body" display="flex" height="100vh">
                <Sidebar />
                <Box component="main" display="flex" flex={1} flexDirection="column" overflow="hidden" position="relative">
                    {children}
                </Box>
            </Box>
        </ThemeProvider>
    </html>;

}
