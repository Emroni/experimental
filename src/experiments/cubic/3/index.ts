import { PI_HALF } from '@/constants';
import * as THREE from 'three';
import Particle, { PARTICLE_ROWS, PARTICLE_SIZE } from './Particle';

const DEPTH = 1000;
const SIZE = 640;

const scene = new THREE.Scene();
scene.rotation.x = PI_HALF / 4;
scene.rotation.y = PI_HALF / 2;

const camera = new THREE.PerspectiveCamera(75, 1, 1, DEPTH * 2);
camera.position.z = DEPTH;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(SIZE, SIZE);

const ambient = new THREE.AmbientLight(0xFFFFFF, 0.5);
scene.add(ambient);

const light = new THREE.PointLight(0xFFFFFF, 1, DEPTH * 2);
scene.add(light);
light.position.z = DEPTH;

const shapeGeometry = new THREE.DodecahedronGeometry((PARTICLE_ROWS * PARTICLE_SIZE) / 2);
const shapeMaterial = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
});
const shape = new THREE.Mesh(shapeGeometry, shapeMaterial);

const raycaster = new THREE.Raycaster();
const ray = new THREE.Vector3(0, 1, 0);
const particles: Particle[] = [];
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

export default {
    duration: 12,
    element: renderer.domElement,
    size: SIZE,
    onTick: (time: number) => {
        particles.forEach(particle => particle.move(time));
        renderer.render(scene, camera);
    }
}