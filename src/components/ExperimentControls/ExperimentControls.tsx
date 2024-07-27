import { Box, Slider, Typography } from '@mui/material';
import _ from 'lodash';

export default function ExperimentControls({ items, onChange }: ExperimentControlsProps) {

    function handleChange(name: string, value: number) {
        const newItems = { ...items };
        newItems[name].value = value;
        onChange(newItems);
    }

    return <Box bgcolor="grey.900" padding={2} position="absolute" right={0} top={0} width={200} zIndex={1}>
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
    </Box>;

}