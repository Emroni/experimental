'use client';
import { experiments } from '@/setup';
import { ContactPage, GitHub } from '@mui/icons-material';
import { Box, Button, IconButton, ListItemText, MenuItem } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';

export default function Sidebar() {

    const pathname = usePathname();

    const selectedItemRef = useCallback((ref: HTMLAnchorElement) => {
        ref.scrollIntoView();
    }, []);

    return <Box bgcolor="grey.900" component="nav" display="flex" flexDirection="column" height="100vh">
        <Box bgcolor="grey.800" display="flex" justifyContent="space-between">
            <Button color="inherit" disableElevation href="/" variant="contained">
                Experiments
            </Button>
            <Box>
                <IconButton color="inherit" href="https://github.com/Emroni/experimental" target="_blank">
                    <ContactPage />
                </IconButton>
                <IconButton color="inherit" href="https://github.com/Emroni/experimental" target="_blank">
                    <GitHub />
                </IconButton>
            </Box>
        </Box>
        <Box flex={1} sx={{ overflowY: 'auto' }}>
            {experiments.map((experiment, index) => (
                <MenuItem
                    component="a"
                    disabled={experiment.disabled}
                    href={experiment.path}
                    ref={experiment.path === pathname ? selectedItemRef : undefined}
                    key={index}
                    selected={experiment.path === pathname}
                >
                    <ListItemText primary={experiment.title} secondary={experiment.index} />
                </MenuItem>
            ))}
        </Box>
    </Box>;

}