import * as THREE from 'three';
import Shape, { CUBE_ROWS } from './Shape';

const DEPTH = 1000;
const SIZE = 640;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 1, 1, DEPTH * 2);
camera.position.z = DEPTH;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(SIZE, SIZE);

const light = new THREE.PointLight(0xFFFFFF, 2, DEPTH * 2);
scene.add(light);
light.position.z = DEPTH;

const shapes: Shape[] = [];
for (let x = 0; x < CUBE_ROWS; x++) {
    for (let y = 0; y < CUBE_ROWS; y++) {
        const flipped = (x > 3 && x < 8 && y > 3 && y < 8) || (x > 11 && x < 16 && y > 3 && y < 8) || (x > 3 && x < 16 && y > 11 && y < 16);
        const shape = new Shape(x, y, flipped);
        scene.add(shape);
        shapes.push(shape);
    }
}

function ease(t = 0, b = 0, c = 1, d = 1) {
    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
}

export default {
    duration: 3,
    element: renderer.domElement,
    size: SIZE,
    onTick: (time: number) => {
        const t = ease((time + 0.5) % 1);
        shapes.forEach(shape => shape.move(t));
        renderer.render(scene, camera);
    }
}