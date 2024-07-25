'use client';
import { ThreePlayer } from '@/components';
import { PI_D4, PI_D8 } from '@/setup';
import { NextPage } from 'next';
import * as THREE from 'three';
import Particle, { PARTICLE_ROWS, PARTICLE_SIZE } from './Particle';

export default class Cubic3 extends ThreePlayer {

    particles: Particle[] = [];
    depth = 1000;

    constructor(props: NextPage) {
        super(props, {
            duration: 12,
        });
    }

    onMount = () => {
        // Update components
        this.camera.position.z = this.depth;
        this.scene.rotation.x = PI_D8;
        this.scene.rotation.y = PI_D4;

        // Add ambient light
        const ambient = new THREE.AmbientLight(0xFFFFFF, 0.5);
        this.scene.add(ambient);

        // Add point light
        const light = new THREE.PointLight(0xFFFFFF, this.depth ** 2);
        this.scene.add(light);
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
                        this.scene.add(particle);
                        this.particles.push(particle);
                    }
                }
            }
        }
    }

    onTick = (progress: number) => {
        this.particles.forEach(particle => particle.move(progress));
    }

}
