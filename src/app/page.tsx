'use client';
import { experiments } from '@/setup';
import { Card, CardActionArea, CardHeader, CardMedia, Grid } from '@mui/material';

export default function Home() {

    return <Grid container overflow="auto" padding={3} spacing={3}>
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
    </Grid>;

}
