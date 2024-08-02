'use client';
import { experiments } from '@/setup';
import { Box, Card, CardActionArea, CardContent, CardHeader, CardMedia, Grid, Typography } from '@mui/material';

export default function Home() {

    return <Box overflow="auto" padding={3}>
        <Card>
            <CardHeader title="Experimental" />
            <CardContent>
                <Typography>
                    Just some experimental digital artwork
                </Typography>
            </CardContent>
        </Card>
        <Grid container marginTop={0} overflow="auto" spacing={3}>
            {experiments.map((experiment, index) => !experiment.disabled && (
                <Grid item key={index} xs={12} md={6} lg={4} xl={3}>
                    <CardActionArea href={experiment.path}>
                        <Card>
                            <CardMedia image={experiment.image} sx={{ paddingTop: '100%' }} />
                            <CardHeader subheader={experiment.index} title={experiment.title} />
                        </Card>
                    </CardActionArea>
                </Grid>
            ))}
        </Grid>
    </Box>;

}
