'use client';
import { PI_M2 } from '@/setup';
import { Box, Typography } from '@mui/material';
import React, { createRef } from 'react';
import './styles.css';

export default class Drops extends React.Component {

    audioRef = createRef<HTMLAudioElement>();
    average = 0;
    center = { x: 0, y: 0 };
    containerRef = createRef<HTMLDivElement>();
    frameRequest = 0;
    radius = 0;
    rotation = 0;

    analyser: AnalyserNode;
    frequencies: Float32Array;
    frequenciesData: Uint8Array;

    componentDidMount() {
        window.addEventListener('resize', this.resize);
        this.resize();
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.frameRequest);
        window.removeEventListener('resize', this.resize);
    }

    resize = () => {
        if (this.containerRef.current) {
            const rect = this.containerRef.current.getBoundingClientRect();
            this.center = {
                x: rect.width / 2,
                y: rect.height / 2,
            };
            this.radius = Math.max(this.center.x, this.center.y);
        }
    }

    handlePlay = () => {
        if (this.audioRef.current && !this.analyser && this.containerRef.current) {
            const audioContext = new AudioContext();
            const source = audioContext.createMediaElementSource(this.audioRef.current);
            this.analyser = audioContext.createAnalyser();
            source.connect(this.analyser);
            this.analyser.connect(audioContext.destination);
            this.analyser.fftSize = 32;
            this.analyser.minDecibels = -90;
            this.analyser.maxDecibels = 0;

            this.frequenciesData = new Uint8Array(this.analyser.frequencyBinCount);
            this.frequencies = new Float32Array(this.frequenciesData.length);

            this.containerRef.current.firstChild?.remove();

            this.tick();
        }
    }

    tick = () => {
        this.frameRequest = requestAnimationFrame(this.tick);

        this.analyser.getByteFrequencyData(this.frequenciesData);
        this.average = 0;
        for (let i = 0; i < this.frequenciesData.length; i++) {
            const n = this.frequenciesData[i] / 256;
            this.frequencies[i] = n;
            this.average += n;
        }
        this.average /= this.frequenciesData.length;

        let a = 0;
        for (let i = Math.floor(this.frequencies.length * 0.5); i < this.frequencies.length; i++) {
            a += this.frequencies[i];
        }
        a /= 2;

        for (let i = 0; i < this.frequencies.length; i++) {
            const f = this.frequencies[i];
            if (f > 0.025) {
                this.add(i / this.frequencies.length, f, a);
            }
        }

        if (this.containerRef.current) {
            this.rotation += this.average * this.average * this.average * 10;
            this.containerRef.current.style.transform = `rotate(${this.rotation}deg)`;
        }
    }

    add = (distance: number, force: number, offset: number) => {
        if (this.containerRef.current) {
            const drop = document.createElement('span');
            drop.className = 'drop';
            this.containerRef.current.appendChild(drop);

            var n = Math.random() * PI_M2;
            var r = (distance + 0.1) * this.radius;
            drop.style.left = this.center.x + Math.sin(n) * r + 'px';
            drop.style.top = this.center.y + Math.cos(n) * r + 'px';
            drop.style.border = `${force * 10}px solid hsl(${(force + offset) * 256}, 100%, 50%)`;
            drop.style.width = drop.style.height = (this.average * force * 100) + 'px';
            drop.style.animationDuration = force * 3 + 's';

            setTimeout(() => {
                this.containerRef.current?.removeChild(drop);
            }, force * 3000);
        }
    }

    render() {
        return <>
            <Box flex={1} position="relative" ref={this.containerRef}>
                <Typography align="center" left={0} position="absolute" textTransform="uppercase" top="50%" width="100%">
                    Press play
                </Typography>
            </Box>
            <Box alignItems="flex-end" display="flex" justifyContent="space-between" padding={3}>
                <audio controls controlsList="nodownload noplaybackrate" ref={this.audioRef} onPlay={this.handlePlay}>
                    <source src="/assets/sounds/max_cooper-order_from_chaos.mp3" type="audio/mp3" />
                </audio>
                <Typography>
                    Music by <a href="https://maxcooper.net/order-from-chaos" target="_blank">Max Cooper</a>
                </Typography>
            </Box>
        </>;
    }

}