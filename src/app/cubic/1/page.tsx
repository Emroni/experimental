'use client';
import { ThreePlayer } from '@/components';
import { PI_D4, PI_D8 } from '@/setup';
import { NextPage } from 'next';
import * as THREE from 'three';
import Shape, { CUBE_ROWS } from './Shape';

export default class Cubic1 extends ThreePlayer {

    shapes: Shape[] = [];
    depth = 1000;

    constructor(props: NextPage) {
        super(props, {
            duration: 12,
        });
    }

    onMount = () => {
        // Update camera
        this.camera.far = this.depth * 2;
        this.camera.position.y = -this.depth * 0.05;
        this.camera.position.z = this.depth;

        // Update scene
        this.scene.rotation.x = PI_D8;
        this.scene.rotation.y = PI_D4;

        // Add ambient  
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

    onTick = (progress: number) => {
        this.shapes.forEach(shape => shape.move(progress));
    }

}
