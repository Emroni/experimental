'use client';
import { AudioAnalyser, ExperimentControls, PixiPlayer } from '@/components';
import { hslToHex } from '@/helpers';
import { PI_M2 } from '@/setup';
import { Box, Typography } from '@mui/material';
import * as PIXI from 'pixi.js';
import { Component } from 'react';

export default class Drops3 extends Component<any, ExperimentControlItems> {

    average = 0;
    container = new PIXI.Container();
    index = 0;
    particles: PIXI.Container[] = [];
    particleHole = 50;
    particleSize = 100;
    size = 640;

    state = {
        fall: { min: 0, max: 10, step: 0.1, value: 3 },
        force: { min: 0, max: 10, step: 0.1, value: 2 },
        particles: { min: 1, max: 100, step: 1, value: 1 },
        rotate: { min: 0, max: 10, step: 0.1, value: 1 },
        shrink: { min: 0, max: 1, step: 0.01, value: 0.5 },
        size: { min: 1, max: 20, step: 1, value: 10 },
    };

    handleInit = (app: PIXI.Application) => {
        app.stage.addChild(this.container);
        this.container.position.set(this.size / 2);

        // Get shape texture
        const shape = new PIXI.Graphics()
            .circle(0, 0, this.particleSize)
            .stroke({
                color: 0xFFFFFF,
                width: this.particleHole,
            });
        const shapeTexture = app.renderer.generateTexture(shape);

        // Add particles
        for (let i = 0; i < 10000; i++) {
            const particle = new PIXI.Container();
            this.particles.push(particle);
            particle.zIndex = i;

            const shape = PIXI.Sprite.from(shapeTexture);
            particle.addChild(shape);
            shape.anchor.set(0.5);
            shape.scale.set(0);
        }

        // Trigger state change
        this.setState({});
    }

    handleTick = (frequencies: number[], average: number) => {
        const { fall, force, particles, rotate, shrink, size } = this.state;
        this.average += (average - this.average) * 0.1;

        // Get offset
        let offset = 0;
        for (let i = Math.floor(frequencies.length * 0.5); i < frequencies.length; i++) {
            offset += frequencies[i];
        }
        offset /= 2;

        // Update particles
        for (const particle of this.particles) {
            particle.position.y += fall.value;
            particle.rotation += rotate.value * average ** 3 * (1 - particle.position.y / this.size) ** 10;

            const shape = particle.children[0];
            const scale = shape.scale.x * ((1 - shrink.value) * 0.1 + 0.9);
            shape.scale.set(scale);
        }

        // Ping particles
        for (const frequency of frequencies) {
            if (frequency > 0.025) {
                for (let i = 0; i < particles.value; i++) {
                    this.index = (this.index + 1) % this.particles.length;
                    const particle = this.particles[this.index];
                    this.container.addChild(particle);
                    particle.position.y = 0;

                    const shape = particle.children[0];
                    const alpha = Math.random() * PI_M2;
                    const radius = Math.random() * force.value * this.average * this.size / 2;
                    shape.position.x = Math.sin(alpha) * radius;
                    shape.position.y = Math.cos(alpha) * radius;
                    shape.scale.set(size.value / this.particleSize * frequency * force.value);
                    shape.tint = hslToHex((frequency + offset) * 256, 100, 50);
                }
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
                <AudioAnalyser onTick={this.handleTick} />
                <Typography>
                    Music by <a href="https://maxcooper.net/order-from-chaos" target="_blank">Max Cooper</a>
                </Typography>
            </Box>
        </>;
    }

}