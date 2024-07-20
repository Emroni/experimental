import { PI, PI_HALF } from '@/constants';
import * as THREE from 'three';
import Shape from './Shape';

export const SIZE = 640;
export const RADIUS = 200;
export const ROWS = 300;

const scene = new THREE.Scene();
scene.rotation.x = PI_HALF;

const camera = new THREE.PerspectiveCamera(75, 1, 1, 2000);
camera.position.z = SIZE / (Math.tan(camera.fov * (PI / 180) / 2) * 2);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(SIZE, SIZE);

const light1 = new THREE.PointLight('#e91e63', 2, RADIUS * 5, 1);
scene.add(light1);
light1.position.set(RADIUS, RADIUS, RADIUS);

const light2 = new THREE.PointLight('#009688', 2, RADIUS * 5, 1);
scene.add(light2);
light2.position.set(-RADIUS, -RADIUS, -RADIUS);

const shapes = [];

for (let i = 0; i < ROWS; i++) {
    new Shape(scene, shapes, i / ROWS);
}

export default {
    duration: 10,
    element: renderer.domElement,
    size: SIZE,
    onTick: (tick) => {

        // scene.rotation.y = 0.1 * Math.sin(PI2 * tick);

        for (let i = 0; i < shapes.length; i++) {
            shapes[i].move(tick);
        }

        renderer.render(scene, camera);
    },
}
