'use client';
import { ExperimentControls, ThreePlayer } from '@/components';
import { PI, PI_D2, PI_M2 } from '@/setup';
import { Component } from 'react';
import * as THREE from 'three';

export default class Sphere2 extends Component<any, ExperimentControlItems> {

    color = 0xFFFFFF;
    container = new THREE.Group();
    depth = 400;
    particles: THREE.Object3D[] = [];
    particleSize = 100;

    mesh: THREE.Mesh;

    state = {
        particles: { min: 10, max: 1000, step: 1, value: 200 },
        radius: { min: 10, max: 1000, step: 1, value: 180 },
        size: { min: 1, max: 100, step: 1, value: 35 },
        speed: { min: 1, max: 10, step: 1, value: 1 },
    };

    handleInit = (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
        camera.far = 10000;
        camera.position.z = this.depth;
        scene.add(this.container);

        // Add lights
        const ambient = new THREE.AmbientLight(this.color, 0.1);
        scene.add(ambient);

        const light = new THREE.PointLight(this.color, this.depth ** 2);
        scene.add(light);
        light.position.z = this.depth;

        // Get particle mesh
        const geometry = new THREE.CylinderGeometry(this.particleSize, this.particleSize, Math.ceil(this.particleSize / 10), 8);
        const material = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
        });
        this.mesh = new THREE.Mesh(geometry, material);

        // Trigger state change
        this.setState({});
    }

    componentDidUpdate() {
        const { particles, radius, size } = this.state;

        // Add missing particles
        for (let i = this.particles.length; i < particles.value; i++) {
            const particle = new THREE.Object3D();
            this.particles.push(particle);

            particle.userData.plane = this.mesh.clone();
            particle.add(particle.userData.plane);
        }

        // Remove particles from container
        this.container.children.forEach(particle => particle.removeFromParent());

        // Add particles
        const f = 2 / particles.value;
        for (let i = 0; i < particles.value; i++) {
            const particle = this.particles[i];
            this.container.add(particle);

            const n = (i * f) - 1 + (f / 2);
            const r = Math.sqrt(1 - (n * n)) * radius.value;
            const alpha = (i % particles.value) * PI * (3 - Math.sqrt(5));

            particle.position.x = Math.cos(alpha) * r;
            particle.position.y = -n * radius.value;
            particle.position.z = Math.sin(alpha) * r;
            particle.scale.setScalar(size.value / this.particleSize);
            particle.lookAt(0, 0, 0);
        }
    }

    handleTick = (progress: number) => {
        const { speed } = this.state;
        const tick = (progress * speed.value) % 1;

        this.container.rotation.y = PI_M2 * tick;

        for (const face of this.container.children) {
            face.userData.plane.rotation.x = PI_D2 * Math.sin(PI_M2 * tick * 2);
            face.userData.plane.rotation.y = PI * tick;
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