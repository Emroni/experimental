'use client';
import { Pause, PlayArrow } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { ChangeEvent } from 'react';
import { Scrubber } from './PlayerControls.styled';

export default function PlayerControls({ playing, progress, onProgressChange, onToggle }: PlayerControlsProps) {

    function handleRangeChange(e: ChangeEvent<HTMLInputElement>) {
        const value = parseFloat(e.currentTarget.value);
        onProgressChange(value);
    }

    return <Box alignItems="center" display="flex" gap={1} padding={3}>
        <Box>
            <IconButton onClick={() => onToggle()}>
                {playing ? (
                    <PlayArrow />
                ) : (
                    <Pause />
                )}
            </IconButton>
        </Box>
        <Box flex={1} paddingY={2}>
            <Scrubber
                max={1}
                min={0}
                step={0.001}
                type="range"
                value={progress}
                onChange={handleRangeChange}
            />
        </Box>
        <Box width={40} />
    </Box>;

}