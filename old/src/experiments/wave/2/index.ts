import { PI2 } from '@/constants';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import Shape from './Shape';

export const SIZE = 640;
export const SHAPES = 3000;

const scene = new THREE.Scene();
scene.position.y = 200;

const camera = new THREE.PerspectiveCamera(75, 1, 1, 2000);
camera.position.z = 1000;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(SIZE, SIZE);
renderer.toneMappingExposure = 1.5;

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(SIZE, SIZE), 0.8, 0, 0);

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const light = new THREE.PointLight(0xFFFFFF, 5, 2000, 5);
scene.add(light);

const container = new THREE.Object3D();
scene.add(container);

for (let i = 0; i < SHAPES; i++) {
    const shape = new Shape(i);
    container.add(shape);
}

export default {
    duration: 20,
    element: renderer.domElement,
    size: SIZE,
    onTick: (tick) => {
        light.position.z = 100 * Math.sin(PI2 * 4 * tick) + 100;

        container.rotation.x = 0.1 * Math.sin(PI2 * 2 * tick) - 1;
        container.rotation.z = -PI2 * tick;

        container.children.forEach((child: Shape) => child.move(tick));

        composer.render();
    },
}