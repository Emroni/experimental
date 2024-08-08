'use client';
import { ExperimentControls, ThreePlayer } from '@/components';
import { PI_M2 } from '@/setup';
import React from 'react';
import * as THREE from 'three';

export default class Mobius extends React.Component<any, ExperimentControlItems> {

    container = new THREE.Object3D();
    layers: THREE.Object3D[] = [];
    particles: THREE.Sprite[] = [];

    material: THREE.SpriteMaterial;

    state = {
        length: { min: 10, max: 1000, step: 10, value: 100 },
        spacing: { min: 1, max: 100, step: 1, value: 10 },
        speed: { min: 1, max: 10, step: 1, value: 2 },
        width: { min: 1, max: 100, step: 1, value: 10 },
    };

    handleInit = (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
        // Update camera
        camera.far = 5000;
        camera.position.z = 300;
        camera.position.y = 200;
        camera.lookAt(scene.position);

        // Add container
        scene.add(this.container);

        // Get material
        this.material = new THREE.SpriteMaterial({
            color: '#fff',
        });

        // Trigger state change
        this.setState({});
    }

    componentDidUpdate() {
        const { length, spacing, width } = this.state;

        // Remove particles from layers and layers from container
        this.particles.forEach(particle => particle.removeFromParent());
        this.layers.forEach(layer => layer.removeFromParent());

        // Create missing layers
        for (let i = this.layers.length; i < length.value; i++) {
            const layer = new THREE.Object3D();
            this.layers.push(layer);
            layer.rotation.order = 'YXZ';
        }

        // Create missing particles
        const particlesCount = length.value * width.value;
        for (let i = this.particles.length; i < particlesCount; i++) {
            const material = this.material.clone();
            const particle = new THREE.Sprite(material);
            this.particles.push(particle);
            particle.scale.setScalar(3);
        }

        // Add layers and particles
        const radius = spacing.value / Math.sin(PI_M2 / length.value);
        for (let i = 0; i < length.value; i++) {
            const layer = this.layers[i];
            this.container.add(layer);

            const n = (i / length.value) * PI_M2;
            layer.position.x = Math.sin(n) * radius;
            layer.position.z = Math.cos(n) * radius;
            layer.rotation.y = n;
            layer.userData.offset = n * 0.5;

            for (let j = 0; j < width.value; j++) {
                const particle = this.particles[i * width.value + j];
                layer.add(particle);
                particle.position.y = (((j + 0.5) / width.value) * 2 - 1) * width.value * spacing.value * 0.5;
                particle.material.color.setHSL(i / length.value, 1, 0.5);
            }
        }
    }

    handleTick = (progress: number) => {
        const { speed } = this.state;
        const tick = (progress * speed.value) % 1;

        this.container.rotation.y = PI_M2 * tick;

        for (const layer of this.container.children) {
            layer.rotation.x = PI_M2 * tick + layer.userData.offset;
        }
    }

    render() {
        return <>
            <ExperimentControls
                items={this.state}
                onChange={items => this.setState(items)}
            />
            <ThreePlayer
                onInit={this.handleInit}
                onTick={this.handleTick}
            />
        </>;
    }

}
