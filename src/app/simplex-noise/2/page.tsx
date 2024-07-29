'use client';
import { ExperimentControls, PixiPlayer } from '@/components';
import { PI_M2 } from '@/setup';
import alea from 'alea';
import * as PIXI from 'pixi.js';
import React from 'react';
import { createNoise3D } from 'simplex-noise';

export default class SimplexNoise2 extends React.Component<any, ExperimentControlItems> {

    center = 320;
    container = new PIXI.Container();
    layers: PIXI.Container[] = [];
    noise3Ds = new Array(10).fill(0).map((_, index) => createNoise3D(alea(index)));
    particles: PIXI.Sprite[] = [];

    particleTexture: PIXI.Texture;

    state = {
        layers: { min: 1, max: 10, step: 1, value: 3 },
        loops: { min: 1, max: 20, step: 1, value: 10 },
        noise: { min: 0, max: 10, value: 1 },
        opacity: { min: 0, max: 1, value: 1 },
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
        const { layers, opacity, particles } = this.state;
        const particleCount = layers.value * particles.value;

        // Create missing layers
        for (let i = this.layers.length; i < layers.value; i++) {
            const layer = new PIXI.Container();
            this.layers.push(layer);
        }

        // Create missing particles
        for (let i = this.particles.length; i < particleCount; i++) {
            const particle = PIXI.Sprite.from(this.particleTexture);
            this.particles.push(particle);
        }

        // Remove particles from layers and layers from container
        this.particles.forEach(particle => particle.removeFromParent());
        this.layers.forEach(layer => layer.removeFromParent());

        // Add visible layers to container
        for (let i = 0; i < layers.value; i++) {
            const layer = this.layers[i];
            this.container.addChild(layer);
            layer.alpha = 0.8 - (i / layers.value * opacity.value);
        }

        // Add visible particles to layers
        for (let i = 0; i < layers.value; i++) {
            const layer = this.layers[i];
            for (let j = 0; j < particles.value; j++) {
                const particle = this.particles[i * particles.value + j];
                layer.addChild(particle);
            }
        }
    }

    handleTick = (progress: number) => {
        const { noise, loops } = this.state;

        for (let i = 0; i < this.container.children.length; i++) {
            // Get layer
            const layer = this.container.children[i];

            // Get noise
            const noise3D = this.noise3Ds[i];
            const offset = PI_M2 * progress + (i / this.container.children.length) * PI_M2;

            for (let j = 0; j < layer.children.length; j++) {
                // Get particle
                const particle = layer.children[j];
                const n = j / layer.children.length;

                // Get spiral
                const spiralAlpha = PI_M2 * n;
                const spiralRadius = 50 * Math.sin(PI_M2 * (j / (layer.children.length / loops.value)) + offset) + 200;
                const spiralX = spiralRadius * Math.sin(spiralAlpha) + this.center;
                const spiralY = spiralRadius * Math.cos(spiralAlpha) + this.center;

                // Get noise
                const noiseAlpha = PI_M2 * (n + progress);
                const noiseX = Math.cos(noiseAlpha * noise.value);
                const noiseY = Math.sin(noiseAlpha * noise.value);
                const noise1 = noise3D(noiseX, noiseY, n) * 50;
                const noise2 = noise3D(noiseX + 2, noiseY, n) * 50;

                // Update particle
                particle.x = spiralX + noise1;
                particle.y = spiralY + noise2;
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
                duration={5}
                onInit={this.handleInit}
                onTick={this.handleTick}
            />
        </>;
    }

}