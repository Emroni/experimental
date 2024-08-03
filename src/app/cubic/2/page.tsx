'use client';
import { ExperimentControls, ThreePlayer } from '@/components';
import React from 'react';
import * as THREE from 'three';
import Shape, { CUBE_ROWS } from './Shape';

export default class Cubic2 extends React.Component<any, ExperimentControlItems> {

    depth = 1000;
    shapes: Shape[] = [];

    state = {
        // TODO: Add layers
        delay: { min: 0, max: 2, value: 1 },
        speed: { min: 1, max: 10, step: 1, value: 1 },
    };

    handleInit = (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
        // Update camera
        camera.position.z = this.depth;

        // Add ambient light
        const ambient = new THREE.AmbientLight(0xFFFFFF, 0.5);
        scene.add(ambient);

        // Add point light
        const light = new THREE.PointLight(0xFFFFFF, this.depth ** 2);
        scene.add(light);
        light.position.z = this.depth;

        // Add shapes
        for (let x = 0; x < CUBE_ROWS; x++) {
            for (let y = 0; y < CUBE_ROWS; y++) {
                for (let z = 0; z < CUBE_ROWS; z++) {
                    const shape = new Shape(x, y, z);
                    scene.add(shape);
                    this.shapes.push(shape);
                }
            }
        }

        // Trigger state change
        this.setState({});
    }

    handleTick = (progress: number) => {
        const { delay, speed } = this.state;
        const tick = (progress * speed.value) % 1 * 12;
        this.shapes.forEach(shape => shape.move(tick, delay.value));
    }

    render() {
        return <>
            <ExperimentControls
                items={this.state}
                onChange={items => this.setState(items)}
            />
            <ThreePlayer
                duration={12}
                onInit={this.handleInit}
                onTick={this.handleTick}
            />
        </>;
    }

}