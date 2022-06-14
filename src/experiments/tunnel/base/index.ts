import * as THREE from 'three';

export { default as Shape } from './Shape';

export const PI2 = Math.PI * 2;
export const DEPTH = 1000;
export const SIZE = 640;
export const RADIUS = SIZE / 2;

export const COLORS = [
    0xf44336,
    0xe91e63,
    0x9c27b0,
    0x673ab7,
    0x3f51b5,
    0x2196f3,
    0x03a9f4,
    0x03a9f4,
    0x00bcd4,
    0x009688,
    0x4caf50,
    0x8bc34a,
    0xcddc39,
    0xffeb3b,
    0xffc107,
    0xff9800,
];

export const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.z = DEPTH;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(SIZE, SIZE);

const light = new THREE.PointLight(0xFFFFFF, 1, 1000);
scene.add(light);

export const shapes = [];

export default {
    duration: 10,
    element: renderer.domElement,
    size: SIZE,
    onTick: (tick) => {

        light.position.z = DEPTH * (0.5 * Math.abs(Math.sin(PI2 * tick * 2)) + 0.5);

        for (let i = 0; i < shapes.length; i++) {
            const child = shapes[i];
            const t = Math.pow((tick + (i / shapes.length)) % 1, 3) + 0.0001;

            child.move(tick);
            child.position.z = DEPTH * t;
            child.scale.set(t, t, t);
        }

        renderer.render(scene, camera);
    },
}