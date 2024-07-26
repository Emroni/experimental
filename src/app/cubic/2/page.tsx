'use client';
import { ThreePlayer } from '@/components';
import * as THREE from 'three';
import Shape, { CUBE_ROWS } from './Shape';

export default function Cubic2() {

    const depth = 1000;
    const shapes: Shape[] = [];

    function handleInit(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
        // Update camera
        camera.position.z = depth;

        // Add ambient light
        const ambient = new THREE.AmbientLight(0xFFFFFF, 0.5);
        scene.add(ambient);

        // Add point light
        const light = new THREE.PointLight(0xFFFFFF, depth ** 2);
        scene.add(light);
        light.position.z = depth;

        // Add shapes
        for (let x = 0; x < CUBE_ROWS; x++) {
            for (let y = 0; y < CUBE_ROWS; y++) {
                for (let z = 0; z < CUBE_ROWS; z++) {
                    const shape = new Shape(x, y, z);
                    scene.add(shape);
                    shapes.push(shape);
                }
            }
        }
    }

    function handleTick(progress: number) {
        shapes.forEach(shape => shape.move(progress));
    }

    return <ThreePlayer
        duration={12}
        size={640}
        onInit={handleInit}
        onTick={handleTick}
    />;
}
