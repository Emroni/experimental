'use client';
import { experiments } from '@/setup';
import { Box, Card, CardActionArea, CardContent, CardHeader, CardMedia, Divider, Grid, Typography } from '@mui/material';

export default function Home() {

    return <Box display="flex" flexDirection="column" gap={6} overflow="auto" padding={3}>
        <Box>
            <Card>
                <CardHeader title="Experimental" />
                <CardContent>
                    <Typography>
                        Just some experimental digital artwork
                    </Typography>
                </CardContent>
            </Card>
        </Box>
        <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="h4">
                Featured
            </Typography>
            <Divider />
            <Grid container overflow="auto" spacing={3}>
                {experiments.filter(experiment => experiment.featured).map((experiment, index) => (
                    <Grid item key={index} xs={12} md={6} lg={4} xl={3}>
                        <CardActionArea href={experiment.path}>
                            <Card>
                                <CardMedia image={experiment.image} sx={{ paddingTop: '100%' }} />
                                <CardHeader
                                    subheader={(
                                        <Box display="flex" gap={1}>
                                            <Typography>{experiment.index}</Typography>
                                            <Typography color="grey.700">|</Typography>
                                            <Typography>{experiment.date}</Typography>
                                        </Box>
                                    )}
                                    title={experiment.title}
                                />
                            </Card>
                        </CardActionArea>
                    </Grid>
                ))}
            </Grid>
            <Divider />
        </Box>
        <Box>
            <Grid container overflow="auto" spacing={3}>
                {experiments.filter(experiment => !experiment.disabled).map((experiment, index) => (
                    <Grid item key={index} xs={12} md={6} lg={4} xl={3}>
                        <CardActionArea href={experiment.path}>
                            <Card>
                                <CardMedia image={experiment.image} sx={{ paddingTop: '100%' }} />
                                <CardHeader
                                    subheader={(
                                        <Box display="flex" gap={1}>
                                            <Typography>{experiment.index}</Typography>
                                            <Typography color="grey.700">|</Typography>
                                            <Typography>{experiment.date}</Typography>
                                        </Box>
                                    )}
                                    title={experiment.title}
                                />
                            </Card>
                        </CardActionArea>
                    </Grid>
                ))}
            </Grid>
        </Box>
    </Box>;

}
