'use client';
import { ExperimentControls, PixiPlayer } from '@/components';
import { hslToHex } from '@/helpers';
import { PI_M2 } from '@/setup';
import { Box, Typography } from '@mui/material';
import * as PIXI from 'pixi.js';
import React from 'react';

export default class Drops2 extends React.Component<any, ExperimentControlItems> {

    container = new PIXI.Container();
    fftSize = 32;
    frameRequest = 0;
    layers: PIXI.Container[] = [];
    particleHole = 50;
    particles: PIXI.Sprite[] = [];
    particleSize = 100;
    size = 640;

    analyser: AnalyserNode;
    frequencies: Float32Array;
    frequenciesData: Uint8Array;
    particleTexture: PIXI.Texture;

    state = {
        force: { min: 0, max: 10, step: 0.1, value: 1 },
        particles: { min: 10, max: 5000, step: 10, value: 1000 },
        shrink: { min: 0, max: 1, step: 0.01, value: 0.5 },
        size: { min: 1, max: 20, step: 1, value: 10 },
        spacing: { min: 0, max: 100, step: 1, value: 30 },
        speed: { min: 1, max: 100, step: 1, value: 10 },
    };

    handleInit = (app: PIXI.Application) => {
        app.stage.addChild(this.container);

        // Create layers
        for (let i = 0; i < this.fftSize; i++) {
            const layer = new PIXI.Container();
            this.layers.push(layer);
            this.container.addChild(layer);
            layer.position.set(this.size / 2);
        }

        // Get shape texture
        const shape = new PIXI.Graphics()
            .circle(0, 0, this.particleSize)
            .stroke({
                color: 0xFFFFFF,
                width: this.particleHole,
            });
        this.particleTexture = app.renderer.generateTexture(shape);

        // Trigger state change
        this.setState({});
    }

    componentDidUpdate() {
        const { particles, size, spacing } = this.state;

        // Remove particles from layers
        this.particles.forEach(particle => particle.removeFromParent());

        // Add particles
        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i];
            const radius = ((i + 1) / this.layers.length) * (size.value * spacing.value);

            for (let j = 0; j < particles.value; j++) {
                // Get particle
                const n = i * particles.value + j
                let particle = this.particles[n];
                if (!particle) {
                    particle = PIXI.Sprite.from(this.particleTexture);
                    this.particles.push(particle);
                    particle.anchor.set(0.5);
                }
                layer.addChild(particle);

                // Update particle
                const alpha = j / particles.value * PI_M2;
                particle.position.x = Math.sin(alpha) * radius;
                particle.position.y = Math.cos(alpha) * radius;
                particle.scale.set(0);
            }
        }
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.frameRequest);
    }

    handlePlay = (e: any) => {
        if (!this.analyser) {
            // Get analyser
            const audioContext = new AudioContext();
            const source = audioContext.createMediaElementSource(e.target);
            this.analyser = audioContext.createAnalyser();
            source.connect(this.analyser);
            this.analyser.connect(audioContext.destination);
            this.analyser.fftSize = this.fftSize;
            this.analyser.minDecibels = -90;
            this.analyser.maxDecibels = 0;

            // Get frequency data
            this.frequenciesData = new Uint8Array(this.analyser.frequencyBinCount);
            this.frequencies = new Float32Array(this.frequenciesData.length);

            // Initialize tick
            this.tick();
        }
    }

    tick = () => {
        const { force, shrink, size, speed } = this.state;
        this.frameRequest = requestAnimationFrame(this.tick);

        // Analyze frequencies
        this.analyser.getByteFrequencyData(this.frequenciesData);
        let average = 0;
        for (let i = 0; i < this.frequenciesData.length; i++) {
            const n = this.frequenciesData[i] / 256;
            this.frequencies[i] = n;
            average += n;
        }
        average /= this.frequenciesData.length;

        // Get offset
        let offset = 0;
        for (let i = Math.floor(this.frequencies.length * 0.5); i < this.frequencies.length; i++) {
            offset += this.frequencies[i];
        }
        offset /= 2;

        // Update layers
        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i];
            layer.rotation += (average ** 3) * ((1 - i / this.layers.length) * speed.value / 10) + 0.001;
        }

        // Update particles
        for (const particle of this.particles) {
            const scale = particle.scale.x * ((1 - shrink.value) * 0.1 + 0.9);
            particle.scale.set(scale);
        }

        // Ping particles
        for (let i = 0; i < this.frequencies.length; i++) {
            const frequency = this.frequencies[i];
            if (frequency > 0.025) {
                const layerIndex = Math.floor(i / this.frequencies.length * this.layers.length);
                const layer = this.layers[layerIndex];

                const particleIndex = Math.floor(Math.random() * layer.children.length);
                const particle = layer.children[particleIndex];

                particle.scale.set(size.value / this.particleSize * frequency * force.value);
                particle.tint = hslToHex((frequency + offset) * 256, 100, 50);
            }
        }
    }

    render() {
        return <>
            <ExperimentControls
                items={this.state}
                onChange={items => this.setState(items)}
            />
            <PixiPlayer
                onInit={this.handleInit}
            />
            <Box alignItems="flex-end" display="flex" justifyContent="space-between" padding={3}>
                <audio controls controlsList="nodownload noplaybackrate" onPlay={this.handlePlay}>
                    <source src="/assets/sounds/max_cooper-order_from_chaos.mp3" type="audio/mp3" />
                </audio>
                <Typography>
                    Music by <a href="https://maxcooper.net/order-from-chaos" target="_blank">Max Cooper</a>
                </Typography>
            </Box>
        </>;
    }

}