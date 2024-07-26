'use client';
import { ThreePlayer } from '@/components';
import { PI_D4, PI_D8 } from '@/setup';
import * as THREE from 'three';
import Particle, { PARTICLE_ROWS, PARTICLE_SIZE } from './Particle';

export default function Cubic3() {

    const depth = 1000;
    const particles: Particle[] = [];

    function handleInit(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
        // Update camera
        camera.position.z = depth;
        
        // Update scene
        scene.rotation.x = PI_D8;
        scene.rotation.y = PI_D4;

        // Add ambient light
        const ambient = new THREE.AmbientLight(0xFFFFFF, 0.5);
        scene.add(ambient);

        // Add point light
        const light = new THREE.PointLight(0xFFFFFF, depth ** 2);
        scene.add(light);
        light.position.z = depth;

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
                        particles.push(particle);
                    }
                }
            }
        }
    }

    function handleTick(progress: number) {
        particles.forEach(particle => particle.move(progress));
    }

    return <ThreePlayer
        duration={12}
        size={640}
        onInit={handleInit}
        onTick={handleTick}
    />;

}
