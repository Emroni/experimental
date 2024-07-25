'use client';
import { experiments } from '@/setup';
import { Box, Button, ListItemText, MenuItem } from '@mui/material';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {

    const pathname = usePathname();

    return <Box bgcolor="grey.900" component="nav" display="flex" flexDirection="column" height="100vh">
        <Button color="inherit" href="/" LinkComponent={NextLink} size="large" variant="contained">
            Experimental
        </Button>
        <Box flex={1} sx={{ overflowY: 'auto' }}>
            {experiments.map((experiment, index) => (
                <MenuItem component={NextLink} disabled={experiment.disabled} href={experiment.path} key={index} selected={experiment.path === pathname}>
                    <ListItemText
                        primary={experiment.title}
                        secondary={(experiments.length - index).toString().padStart(3, '0')}
                    />
                </MenuItem>
            ))}
        </Box>
    </Box>;

}