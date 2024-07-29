'use client';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Box, Button, Slider, Typography } from '@mui/material';
import _ from 'lodash';
import { useState } from 'react';

export default function ExperimentControls({ items, onChange }: ExperimentControlsProps) {

    const [open, setOpen] = useState(false);

    function handleChange(name: string, value: number) {
        const newItems = { ...items };
        newItems[name].value = value;
        onChange(newItems);
    }

    return <Box color="grey.500" position="absolute" right={0} top={0} zIndex={1}>
        {open && (
            <Box bgcolor="grey.900" padding={2} width={200}>
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
        )}
        <Box textAlign="right">
            <Button
                color="inherit"
                endIcon={open ? (
                    <KeyboardArrowUp />
                ) : (
                    <KeyboardArrowDown />
                )}
                size="small"
                onClick={() => setOpen(!open)}
            >
                Controls
            </Button>
        </Box>
    </Box>;

}