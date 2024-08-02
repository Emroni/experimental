'use client';
import { Close, Settings, SettingsBackupRestore } from '@mui/icons-material';
import { Box, IconButton, Slider, Typography } from '@mui/material';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';

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

    const elements = useMemo(() => {
        return Object.entries(items).map(([name, item]) => {
            const step = item.step || ((item.max - item.min) / 100);
            const decimals = parseInt(step.toString().split('.')[1]) || 0;

            return {
                ...item,
                formattedValue: item.value.toLocaleString(undefined, {
                    maximumFractionDigits: decimals,
                    minimumFractionDigits: decimals,
                }),
                label: _.startCase(name),
                name,
                step,
            }
        });
    }, [
        items,
    ]);

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
                    {elements.map(element => (
                        <Box key={element.name}>
                            <Box display="flex" justifyContent="space-between">
                                <Typography>
                                    {element.label}
                                </Typography>
                                <Typography>
                                    {element.formattedValue}
                                </Typography>
                            </Box>
                            <Slider
                                max={element.max}
                                min={element.min}
                                size="small"
                                step={element.step}
                                value={element.value}
                                onChange={(_, value) => handleChange(element.name, value as number)}
                            />
                        </Box>
                    ))}
                </Box>
            </Box>
        )}
    </Box>;

}