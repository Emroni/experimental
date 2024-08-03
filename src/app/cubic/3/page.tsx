'use client';
import { ExperimentControls, ThreePlayer } from '@/components';
import { PI_D4, PI_D8 } from '@/setup';
import React from 'react';
import * as THREE from 'three';
import Particle, { PARTICLE_ROWS, PARTICLE_SIZE } from './Particle';

export default class Cubic3 extends React.Component<any, ExperimentControlItems> {

    // TODO: Check performance drop

    depth = 1000;
    particles: Particle[] = [];

    state = {
        // TODO: Add layers
        delay: { min: 0, max: 2, value: 1 },
        speed: { min: 1, max: 10, step: 1, value: 1 },
    };

    handleInit = (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
        // Update camera
        camera.position.z = this.depth;

        // Update scene
        scene.rotation.x = PI_D8;
        scene.rotation.y = PI_D4;

        // Add ambient light
        const ambient = new THREE.AmbientLight(0xFFFFFF, 0.5);
        scene.add(ambient);

        // Add point light
        const light = new THREE.PointLight(0xFFFFFF, this.depth ** 2);
        scene.add(light);
        light.position.z = this.depth;

        // Get shape
        const shapeGeometry = new THREE.DodecahedronGeometry((PARTICLE_ROWS * PARTICLE_SIZE) / 2);
        const shapeMaterial = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
        });
        const shape = new THREE.Mesh(shapeGeometry, shapeMaterial);

        // Add shapes
        const raycaster = new THREE.Raycaster();
        const ray = new THREE.Vector3(0, 1, 0);
        for (let x = 0; x < PARTICLE_ROWS; x++) {
            for (let y = 0; y < PARTICLE_ROWS; y++) {
                for (let z = 0; z < PARTICLE_ROWS; z++) {
                    const particle = new Particle(x, y, z);
                    raycaster.set(particle.cube.position, ray);
                    if (raycaster.intersectObject(shape).length === 1) {
                        scene.add(particle);
                        this.particles.push(particle);
                    }
                }
            }
        }

        // Trigger state change
        this.setState({});
    }

    handleTick = (progress: number) => {
        const { delay, speed } = this.state;
        const tick = (progress * speed.value) % 1 * 12;
        this.particles.forEach(particle => particle.move(tick, delay.value));
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
