'use client';
import { ThreePlayer } from '@/components';
import { NextPage } from 'next';
import * as THREE from 'three';
import Shape, { CUBE_ROWS } from './Shape';

export default class Cubic2 extends ThreePlayer {

    shapes: Shape[] = [];
    depth = 1000;

    constructor(props: NextPage) {
        super(props, {
            duration: 12,
        });
    }

    onMount = () => {
        // Update components
        this.camera.position.z = this.depth;

        // Add ambient light
        const ambient = new THREE.AmbientLight(0xFFFFFF, 0.5);
        this.scene.add(ambient);

        // Add point light
        const light = new THREE.PointLight(0xFFFFFF, this.depth ** 2);
        this.scene.add(light);
        light.position.z = this.depth;

        // Add shapes
        for (let x = 0; x < CUBE_ROWS; x++) {
            for (let y = 0; y < CUBE_ROWS; y++) {
                for (let z = 0; z < CUBE_ROWS; z++) {
                    const shape = new Shape(x, y, z);
                    this.scene.add(shape);
                    this.shapes.push(shape);
                }
            }
        }
    }

    onTick = (time: number) => {
        this.shapes.forEach(shape => shape.move(time));
    }

}
