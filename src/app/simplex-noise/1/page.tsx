'use client';
import { ExperimentControls, PixiPlayer } from '@/components';
import { PI_M2 } from '@/setup';
import * as PIXI from 'pixi.js';
import React from 'react';
import { createNoise3D } from 'simplex-noise';


export default class SimplexNoise1 extends React.Component<any, ExperimentControlItems> {

    center = 320;
    container = new PIXI.Container();
    noise3D = createNoise3D();
    particles: PIXI.Sprite[] = [];
    size = 640;

    particleTexture: PIXI.Texture;

    state = {
        opacity: { min: 0, max: 1, value: 0.1 },
        noise: { min: 0, max: 10, value: 1 },
        particles: { min: 1, max: 2000, step: 1, value: 1000 },
    };

    handleInit = (app: PIXI.Application) => {
        app.stage.addChild(this.container);

        // Get particle texture
        const particleShape = new PIXI.Graphics()
            .circle(0, 0, 1)
            .fill(0xFFFFFF);
        this.particleTexture = app.renderer.generateTexture(particleShape);

        // Trigger state change
        this.setState({});
    }

    componentDidUpdate() {
        const { opacity, particles } = this.state;
        this.container.alpha = opacity.value;

        // Create missing particles
        for (let i = this.particles.length; i < particles.value; i++) {
            const particle = PIXI.Sprite.from(this.particleTexture);
            this.particles.push(particle);
        }

        // Remove particles from container
        this.particles.forEach(particle => particle.removeFromParent());

        // Add visible particles to container
        for (let i = 0; i < particles.value; i++) {
            const particle = this.particles[i];
            this.container.addChild(particle);
        }
    }

    handleTick = (progress: number) => {
        const { noise } = this.state;

        for (let i = 0; i < this.container.children.length; i++) {
            // Get particle
            const particle = this.container.children[i];
            const n = i / this.container.children.length;

            // Get noise
            const noiseAlpha = PI_M2 * (n + progress);
            const noiseX = Math.cos(noiseAlpha * noise.value);
            const noiseY = Math.sin(noiseAlpha * noise.value);
            const noise1 = this.noise3D(noiseX, noiseY, n) * 50;
            const noise2 = this.noise3D(noiseX + 2, noiseY, n) * 50;

            // Update particle
            particle.x = this.size * (i / this.container.children.length) + noise1;
            particle.y = this.center + noise2;
        }
    }

    render() {
        return <>
            <ExperimentControls
                items={this.state}
                onChange={items => this.setState(items)}
            />
            <PixiPlayer
                duration={5}
                onInit={this.handleInit}
                onTick={this.handleTick}
            />
        </>;
    }
}