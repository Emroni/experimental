'use client';
import { Code } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export default function ExperimentSource() {

    const pathname = usePathname();

    const source = useMemo(() => {
        if (pathname === '/') {
            return null;
        }

        return `https://github.com/Emroni/experimental/tree/master/src/app/${pathname}/page.tsx`;
    }, [
        pathname,
    ]);

    return source && (
        <Box color="grey.500" position="fixed" right={40} top={0}>
            <IconButton color="inherit" href={source} target="_blank">
                <Code />
            </IconButton>
        </Box>
    );

}