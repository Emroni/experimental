'use client';
import { ExperimentControls, PixiPlayer } from '@/components';
import { PI_M2 } from '@/setup';
import * as PIXI from 'pixi.js';
import { Component } from 'react';

export default class Hexagon3 extends Component<any, ExperimentControlItems> {

    container = new PIXI.Container();
    layers: PIXI.Container[] = [];
    particles: PIXI.Container[] = [];
    shapeSize = 100;
    size = 640;

    shapeTexture: PIXI.Texture;

    state = {
        border: { min: 0, max: 10, step: 1, value: 1 },
        size: { min: 10, max: 100, step: 1, value: 30 },
        spacing: { min: 0, max: 100, step: 1, value: 5 },
        speed: { min: 1, max: 10, step: 1, value: 1 },
    };

    handleInit = (app: PIXI.Application) => {
        app.stage.addChild(this.container);

        // Get shape texture
        const shape = new PIXI.Graphics()
            .moveTo(0, 0.5 * this.shapeSize)
            .lineTo(0.4330125 * this.shapeSize, 0.25 * this.shapeSize)
            .lineTo(0.4330125 * this.shapeSize, -0.25 * this.shapeSize)
            .lineTo(0, -0.5 * this.shapeSize)
            .lineTo(-0.4330125 * this.shapeSize, -0.25 * this.shapeSize)
            .lineTo(-0.4330125 * this.shapeSize, 0.25 * this.shapeSize)
            .fill(0xFFFFFF);
        this.shapeTexture = app.renderer.generateTexture(shape);

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
        const { border, size, spacing } = this.state;

        // Get position
        x = (x - 2.125) * ((size.value * 0.4330125) + spacing.value) + this.size / 2;
        y = (y - 0.05) * ((size.value * 0.75) + spacing.value) + this.size / 2;

        if (x <= -size.value / 2 || x >= this.size + size.value / 2 || y < -size.value / 2 || y >= this.size + size.value / 2) {
            return;
        }

        // Get particle
        let particle = this.particles.find(particle => !particle.parent);
        if (!particle) {
            particle = new PIXI.Container();
            this.particles.push(particle);

            const shapeOuter = PIXI.Sprite.from(this.shapeTexture);
            particle.addChild(shapeOuter);
            shapeOuter.tint = 0;

            const shapeInner = PIXI.Sprite.from(this.shapeTexture);
            particle.addChild(shapeInner);
        }

        // Update particle
        layer.addChild(particle);
        particle.position.x = x;
        particle.position.y = y;

        // Update outer shape
        const shapeOuter = particle.children[0];
        shapeOuter.setSize(size.value);
        shapeOuter.position.x = -shapeOuter.width / 2;
        shapeOuter.position.y = -shapeOuter.height / 2;
        
        // Update inner shape
        const shapeInner = particle.children[1];
        shapeInner.setSize(size.value - border.value);
        shapeInner.position.x = -shapeInner.width / 2;
        shapeInner.position.y = -shapeInner.height / 2;
    }

    handleTick = (progress: number) => {
        const { speed } = this.state;

        for (let i = 0; i < this.container.children.length; i++) {
            const layer = this.container.children[i];
            const scale = Math.sin(PI_M2 * (progress * speed.value - i / this.container.children.length)) + 0.5;

            for (const particle of layer.children) {
                particle.scale.set(scale);
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