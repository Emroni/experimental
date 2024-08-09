'use client';
import { ExperimentControls, PixiPlayer } from '@/components';
import { PI_M2 } from '@/setup';
import * as PIXI from 'pixi.js';
import { Component } from 'react';

export default class Hexagon5 extends Component<any, ExperimentControlItems> {

    container = new PIXI.Container();
    layers: PIXI.Container[] = [];
    particles: PIXI.Container[] = [];
    shapeSize = 100;
    size = 640;

    shapeTextures: PIXI.Texture[];

    colors = [
        0xc62828,
        0x00e575,
        0x00acc1,
    ];

    state = {
        size: { min: 10, max: 100, step: 1, value: 30 },
        spacing: { min: 0, max: 100, step: 1, value: 5 },
        speed: { min: 1, max: 10, step: 1, value: 1 },
    };

    handleInit = (app: PIXI.Application) => {
        app.stage.addChild(this.container);

        // Get shape textures
        this.shapeTextures = this.colors.map(color => {
            const shape = new PIXI.Graphics()
                .moveTo(0, 0.5 * this.shapeSize)
                .lineTo(0.4330125 * this.shapeSize, 0.25 * this.shapeSize)
                .lineTo(0.4330125 * this.shapeSize, -0.25 * this.shapeSize)
                .lineTo(0, -0.5 * this.shapeSize)
                .lineTo(-0.4330125 * this.shapeSize, -0.25 * this.shapeSize)
                .lineTo(-0.4330125 * this.shapeSize, 0.25 * this.shapeSize)
                .fill(color);
            return app.renderer.generateTexture(shape);
        });

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
        x = (x - 2) * ((size.value * 0.4330125) + spacing.value) + this.size / 2;
        y = y * ((size.value * 0.75) + spacing.value) + this.size / 2;

        if (x <= -size.value / 2 || x >= this.size + size.value / 2 || y < -size.value / 2 || y >= this.size + size.value / 2) {
            return;
        }

        // Get particle
        let particle = this.particles.find(particle => !particle.parent);
        if (!particle) {
            particle = new PIXI.Container();
            this.particles.push(particle);

            for (const texture of this.shapeTextures) {
                const sprite = PIXI.Sprite.from(texture);
                particle.addChild(sprite);
                sprite.position.x = -sprite.width / 2;
                sprite.position.y = -sprite.height / 2;
            }
        }

        // Update particle
        layer.addChild(particle);
        particle.position.x = x;
        particle.position.y = y;

        // Update shape
        particle.children.forEach(shape => {
            shape.setSize(size.value);
            shape.position.x = -shape.width / 2;
            shape.position.y = -shape.height / 2;
        });
    }

    handleTick = (progress: number) => {
        const { speed } = this.state;
        
        for (let i = 0; i < this.container.children.length; i++) {
            const layer = this.container.children[i];
            const alpha = PI_M2 * (progress * speed.value - i / this.container.children.length);
            const alphas = [
                Math.max(0, Math.sin(alpha)),
                Math.max(0, Math.sin(2 * alpha)),
                Math.max(0, Math.sin(3 * alpha)),
            ];
            const scale = 0.5 * Math.abs(Math.sin(PI_M2 * (progress * speed.value - i / this.container.children.length))) + 0.5;

            for (const particle of layer.children) {
                particle.scale.set(scale);

                for (let k = 0; k < alphas.length; k++) {
                    particle.children[k].alpha = alphas[k];
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
                duration={5}
                // size = { 540 }
                onInit={this.handleInit}
                onTick={this.handleTick}
            />
        </>;
    }

}