'use client';
import { Typography } from '@mui/material';
import { Component } from 'react';

export default class AudioAnalyser extends Component<AudioAnalyserProps, AudioAnalyserState> {

    animationFrame = 0;
    frequencies = new Array(16).fill(0);

    analyser: AnalyserNode;
    frequenciesData: Uint8Array;

    state = {
        initialized: false,
    };

    componentWillUnmount() {
        cancelAnimationFrame(this.animationFrame);
    }

    handlePlay = (e: any) => {
        if (!this.analyser) {
            // Get analyser
            const audioContext = new AudioContext();
            const source = audioContext.createMediaElementSource(e.target);
            this.analyser = audioContext.createAnalyser();
            source.connect(this.analyser);
            this.analyser.connect(audioContext.destination);
            this.analyser.fftSize = 32;
            this.analyser.minDecibels = -90;
            this.analyser.maxDecibels = 0;

            // Get frequency data
            this.frequenciesData = new Uint8Array(this.analyser.frequencyBinCount);

            // Initialize
            this.setState({
                initialized: true,
            });
            this.tick();
        }
    }

    tick = () => {
        this.animationFrame = requestAnimationFrame(this.tick);

        // Analyze frequencies
        this.analyser.getByteFrequencyData(this.frequenciesData);
        let average = 0;
        for (let i = 0; i < this.frequenciesData.length; i++) {
            const n = this.frequenciesData[i] / 256;
            this.frequencies[i] = n;
            average += n;
        }
        average /= this.frequenciesData.length;

        // Call tick
        this.props.onTick(this.frequencies, average);
    }

    render() {
        return <>
            <audio controls controlsList="nodownload noplaybackrate" onPlay={this.handlePlay}>
                <source src="/assets/sounds/max_cooper-order_from_chaos.mp3" type="audio/mp3" />
            </audio>
            {!this.state.initialized && (
                <Typography
                    align="center"
                    left={0}
                    position="absolute"
                    textTransform="uppercase"
                    top="calc(50% - 50px)"
                    width="100%"
                >
                    Press Play
                </Typography>
            )}
        </>;
    }

}