'use client';
import { ExperimentControls, PixiPlayer } from '@/components';
import { PI_M2 } from '@/setup';
import * as PIXI from 'pixi.js';
import React from 'react';

export default class Hexagon1 extends React.Component<any, ExperimentControlItems> {

    container = new PIXI.Container();
    layers: PIXI.Container[] = [];
    particles: PIXI.Sprite[] = [];
    particleSize = 100;
    size = 640;

    particleTexture: PIXI.Texture;

    state = {
        size: { min: 10, max: 100, step: 1, value: 30 },
        spacing: { min: 0, max: 100, step: 1, value: 5 },
        speed: { min: 1, max: 10, step: 1, value: 1 },
    };

    handleInit = (app: PIXI.Application) => {
        app.stage.addChild(this.container);

        // Get shape texture
        const shape = new PIXI.Graphics()
            .moveTo(0, 0.5 * this.particleSize)
            .lineTo(0.4330125 * this.particleSize, 0.25 * this.particleSize)
            .lineTo(0.4330125 * this.particleSize, -0.25 * this.particleSize)
            .lineTo(0, -0.5 * this.particleSize)
            .lineTo(-0.4330125 * this.particleSize, -0.25 * this.particleSize)
            .lineTo(-0.4330125 * this.particleSize, 0.25 * this.particleSize)
            .fill(0xFFFFFF);
        this.particleTexture = app.renderer.generateTexture(shape);

        // Trigger state change
        this.setState({});
    }

    componentDidUpdate() {
        const { size } = this.state;
        const layerCount = Math.ceil(this.size / size.value);

        // Create missing layers
        for (let i = this.layers.length; i < layerCount; i++) {
            const layer = new PIXI.Container();
            this.layers.push(layer);
        }

        // Remove particles from layers and layers from container
        this.particles.forEach(particle => particle.removeFromParent());
        this.layers.forEach(layer => layer.removeFromParent());

        // Add layers and particles
        let x = 0, y = 0;
        for (let i = 0; i < layerCount; i++) {
            // Add layer
            const layer = this.layers[i];
            this.container.addChild(layer);

            // Add layer particles
            this.addParticle(layer, x += 2, y);
            for (let j = 0; j < i - 1; j++) this.addParticle(layer, ++x, ++y);
            for (let j = 0; j < i; j++) this.addParticle(layer, --x, ++y);
            for (let j = 0; j < i; j++) this.addParticle(layer, x -= 2, y);
            for (let j = 0; j < i; j++) this.addParticle(layer, --x, --y);
            for (let j = 0; j < i; j++) this.addParticle(layer, ++x, --y);
            for (let j = 0; j < i; j++) this.addParticle(layer, x += 2, y);
        }
    }

    addParticle = (layer: PIXI.Container, x: number, y: number) => {
        const { size, spacing } = this.state;

        // Get position
        x = (x - 2.625) * ((size.value * 0.4330125) + spacing.value) + this.size / 2;
        y = (y - 0.55) * ((size.value * 0.75) + spacing.value) + this.size / 2;

        if (x <= -this.size || x >= this.size || y < -this.size || y >= this.size) {
            return;
        }

        // Get particle
        let particle = this.particles.find(particle => !particle.parent);
        if (!particle) {
            particle = PIXI.Sprite.from(this.particleTexture);
            this.particles.push(particle);
        }
        
        // Update particle
        layer.addChild(particle);
        particle.position.x = x;
        particle.position.y = y;
        particle.scale.set(size.value / this.particleSize);
    };

    handleTick = (progress: number) => {
        const { speed } = this.state;

        for (let i = 0; i < this.container.children.length; i++) {
            const layer = this.container.children[i];
            const alpha = Math.abs(Math.sin(PI_M2 * (progress * speed.value - i / this.container.children.length)));

            for (const particle of layer.children) {
                particle.alpha = alpha;
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