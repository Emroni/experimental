import * as THREE from 'three';
import Shape, { CUBE_ROWS } from './Shape';

const DEPTH = 1000;
const SIZE = 640;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 1, 1, DEPTH * 2);
camera.position.z = DEPTH;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(SIZE, SIZE);

const ambient = new THREE.AmbientLight(0xFFFFFF, 0.5);
scene.add(ambient);

const light = new THREE.PointLight(0xFFFFFF, 1, DEPTH * 2);
scene.add(light);
light.position.z = DEPTH;

const shapes: Shape[] = [];
for (let x = 0; x < CUBE_ROWS; x++) {
    for (let y = 0; y < CUBE_ROWS; y++) {
        for (let z = 0; z < CUBE_ROWS; z++) {
            const shape = new Shape(x, y, z);
            scene.add(shape);
            shapes.push(shape);
        }
    }
}

export default {
    duration: 12,
    element: renderer.domElement,
    size: SIZE,
    onTick: (time: number) => {
        shapes.forEach(shape => shape.move(time));
        renderer.render(scene, camera);
    }
}