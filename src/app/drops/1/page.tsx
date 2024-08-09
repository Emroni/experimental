'use client';
import { AudioAnalyser } from '@/components';
import { PI_M2 } from '@/setup';
import { Box, Typography } from '@mui/material';
import React, { createRef } from 'react';
import './styles.css';

export default class Drops1 extends React.Component {

    center = { x: 0, y: 0 };
    containerRef = createRef<HTMLDivElement>();
    frameRequest = 0;
    radius = 0;
    rotation = 0;

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

    handleTick = (frequencies: Float32Array, average: number) => {
        let offset = 0;
        for (let i = Math.floor(frequencies.length * 0.5); i < frequencies.length; i++) {
            offset += frequencies[i];
        }
        offset /= 2;

        for (let i = 0; i < frequencies.length; i++) {
            const frequency = frequencies[i];
            if (frequency > 0.025) {
                this.add(i / frequencies.length, frequency, offset, average);
            }
        }

        if (this.containerRef.current) {
            this.rotation += average * average * average * 10;
            this.containerRef.current.style.transform = `rotate(${this.rotation}deg)`;
        }
    }

    add = (distance: number, force: number, offset: number, average: number) => {
        if (this.containerRef.current) {
            const drop = document.createElement('span');
            drop.className = 'drop';
            this.containerRef.current.appendChild(drop);

            const n = Math.random() * PI_M2;
            const r = (distance + 0.1) * this.radius;
            drop.style.left = this.center.x + Math.sin(n) * r + 'px';
            drop.style.top = this.center.y + Math.cos(n) * r + 'px';
            drop.style.border = `${force * 10}px solid hsl(${(force + offset) * 256}, 100%, 50%)`;
            drop.style.width = drop.style.height = (average * force * 100) + 'px';
            drop.style.animationDuration = force * 3 + 's';

            setTimeout(() => {
                this.containerRef.current?.removeChild(drop);
            }, force * 3000);
        }
    }

    render() {
        return <>
            <Box flex={1} position="relative" ref={this.containerRef} />
            <Box alignItems="flex-end" display="flex" justifyContent="space-between" padding={3}>
                <AudioAnalyser onTick={this.handleTick} />
                <Typography>
                    Music by <a href="https://maxcooper.net/order-from-chaos" target="_blank">Max Cooper</a>
                </Typography>
            </Box>
        </>;
    }

}