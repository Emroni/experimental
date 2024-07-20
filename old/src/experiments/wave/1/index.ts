import { PI, PI2 } from '@/constants';
import * as THREE from 'three';
import Shape from './Shape';

export const SIZE = 640;
export const SHAPE_ROW = 50;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 1, 1, 1000);
camera.position.z = SIZE / (Math.tan(camera.fov * (PI / 180) / 2) * 2);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(SIZE, SIZE);

const light = new THREE.PointLight('#aaaaaa', 10, 1000, 4);
scene.add(light);
light.position.z = camera.position.z;

const container = new THREE.Object3D();
scene.add(container);
container.position.z = 100;
container.rotation.x = -PI / 6;
container.rotation.z = PI / 4;

const shapes = [];

for (let x = 0; x < SHAPE_ROW; x++) {
    for (let y = 0; y < SHAPE_ROW; y++) {
        new Shape(container, shapes, x, y, false);
        new Shape(container, shapes, x, y, true);
    }
}

export default {
    duration: 10,
    element: renderer.domElement,
    size: SIZE,
    onTick: (tick) => {

        scene.rotation.y = 0.1 * Math.sin(PI2 * tick);

        for (let i = 0; i < shapes.length; i++) {
            shapes[i].move(tick);
        }

        renderer.render(scene, camera);
    },
}
