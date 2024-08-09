'use client';
import { ExperimentControls, ThreePlayer } from '@/components';
import { PI_M2 } from '@/setup';
import { Component } from 'react';
import { createNoise3D } from 'simplex-noise';
import * as THREE from 'three';

export default class PolyhedronBase extends Component<PolyhedronBaseProps, ExperimentControlItems> {

    container = new THREE.Group();
    geometry = new THREE.BufferGeometry();
    groups = 0;
    lines: PolyhedronBaseLine[] = [];
    noise3D = createNoise3D();
    particles: PolyhedronBaseParticle[] = [];
    particleSize = 2;
    vertices: THREE.Vector3[] = [];

    constructor(props: PolyhedronBaseProps) {
        super(props);

        const { layers, spread } = this.props;

        this.state = {
            layers: { min: 1, max: 100, step: 1, value: layers },
            particles: { min: 100, max: 100000, step: 100, value: 50000 },
            speed: { min: 1, max: 10, step: 1, value: 1 },
            spread: { min: 1, max: 100, step: 1, value: spread },
        };
    }

    handleInit = (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
        const { shape } = this.props;

        // Update camera
        camera.position.z = 500;

        // Add container
        scene.add(this.container);

        // Add points
        const material = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            opacity: 0.2,
            size: this.particleSize,
            transparent: true,
        });

        const points = new THREE.Points(this.geometry, material);
        this.container.add(points);

        // Get shape lines
        for (let i = 0; i < shape.attributes.position.array.length; i += 9) {
            const face = {
                a: {
                    x: shape.attributes.position.array[i],
                    y: shape.attributes.position.array[i + 1],
                    z: shape.attributes.position.array[i + 2],
                },
                b: {
                    x: shape.attributes.position.array[i + 3],
                    y: shape.attributes.position.array[i + 4],
                    z: shape.attributes.position.array[i + 5],
                },
                c: {
                    x: shape.attributes.position.array[i + 6],
                    y: shape.attributes.position.array[i + 7],
                    z: shape.attributes.position.array[i + 8],
                },
            };

            this.lines.push({
                from: face.a,
                to: face.b,
            });

            this.lines.push({
                from: face.b,
                to: face.c,
            });

            this.lines.push({
                from: face.c,
                to: face.a,
            });
        }

        // Trigger state change
        this.setState({});
    }

    componentDidUpdate() {
        const { layers, particles } = this.state;

        // Remove previous particles and vertices
        while (this.particles.length) {
            this.particles.pop();
        }
        while (this.vertices.length) {
            this.vertices.pop();
        }

        // Get new particles and vertices
        this.groups = Math.ceil(particles.value / this.lines.length / layers.value);
        for (let i = 0; i < particles.value; i++) {
            const line = this.lines[Math.floor(i / this.groups / layers.value)];
            const index = i % this.groups;

            const n = 1.6 * (index / this.groups) - 0.3;
            const dX = line.from.x + (line.to.x - line.from.x) * n;
            const dY = line.from.y + (line.to.y - line.from.y) * n;
            const dZ = line.from.z + (line.to.z - line.from.z) * n;
            const position = new THREE.Vector3(dX, dY, dZ);
            this.vertices.push(position.clone());

            const particle = {
                point: this.vertices[i],
                group: Math.floor(i / this.groups),
                layer: Math.floor(i / this.groups) % layers.value,
                position,
                index,
                line,
            };
            this.particles.push(particle);
        }
    }

    handleTick = (progress: number) => {
        const { speed, spread } = this.state;
        const tick = (progress * speed.value) % 1;

        this.container.rotation.y = PI_M2 * tick;

        const d = (0.5 * Math.sin(PI_M2 * tick) + 0.5);
        const p = 1 - 0.75 * d;
        const s = spread.value * d + 5;

        for (const particle of this.particles) {
            const n = particle.index / this.groups;
            const alpha = PI_M2 * (n + tick);
            const cos = Math.cos(alpha);
            const sin = Math.sin(alpha);
            const noiseX = this.noise3D(cos + particle.group + 1, sin, n) * s;
            const noiseY = this.noise3D(cos + particle.group + 2, sin, n) * s;
            const noiseZ = this.noise3D(cos + particle.group + 3, sin, n) * s;
            particle.point.x = particle.position.x * p + noiseX;
            particle.point.y = particle.position.y * p + noiseY;
            particle.point.z = particle.position.z * p + noiseZ;
        }

        this.geometry.setFromPoints(this.vertices);
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