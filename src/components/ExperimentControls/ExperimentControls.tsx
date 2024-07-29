'use client';
import { Close, Settings, SettingsBackupRestore } from '@mui/icons-material';
import { Box, IconButton, Slider, Typography } from '@mui/material';
import _ from 'lodash';
import { useEffect, useState } from 'react';

export default function ExperimentControls({ items, onChange }: ExperimentControlsProps) {

    const [initial, setInitial] = useState<Map<string, number>>();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!initial) {
            const newInitial = new Map();
            Object.entries(items).forEach(([name, item]) => {
                newInitial.set(name, item.value);
            });
            setInitial(newInitial);
        }
    }, [
        initial,
        items,
    ]);

    function handleChange(name: string, value: number) {
        const newItems = { ...items };
        newItems[name].value = value;
        onChange(newItems);
    }

    function handleReset() {
        const newItems = { ...items };
        initial?.forEach((value, name) => {
            newItems[name].value = value;
        });
        onChange(newItems);
    }

    return <Box color="grey.500" position="absolute" right={0} top={0} zIndex={1}>
        {!open && (
            <IconButton color="inherit" title="Controls" onClick={() => setOpen(true)}>
                <Settings />
            </IconButton>
        )}
        {open && (
            <Box bgcolor="grey.900">
                <Box textAlign="right">
                    <IconButton color="inherit" title="Reset" onClick={handleReset}>
                        <SettingsBackupRestore />
                    </IconButton>
                    <IconButton color="inherit" title="Close" onClick={() => setOpen(false)}>
                        <Close />
                    </IconButton>
                </Box>
                <Box paddingX={2} width={200}>
                    {Object.entries(items).map(([name, item]) => (
                        <Box key={name}>
                            <Box display="flex" justifyContent="space-between">
                                <Typography>
                                    {_.startCase(name)}
                                </Typography>
                                <Typography>
                                    {item.value.toLocaleString()}
                                </Typography>
                            </Box>
                            <Slider
                                max={item.max}
                                min={item.min}
                                size="small"
                                step={item.step || ((item.max - item.min) / 100)}
                                value={item.value}
                                onChange={(_, value) => handleChange(name, value as number)}
                            />
                        </Box>
                    ))}
                </Box>
            </Box>
        )}
    </Box>;

}