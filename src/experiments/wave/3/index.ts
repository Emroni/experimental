import { PI2 } from '@/constants';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import Grid from './Grid';

const SIZE = 1200;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 1, 1, 10000);
camera.position.y = -1200;
camera.position.z = 400;
camera.rotation.x = 0.8;

const renderer = new THREE.WebGLRenderer({
    antialias: true,
});
renderer.setSize(SIZE, SIZE);

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(SIZE, SIZE), 0.5, 0, 0.7);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const light = new THREE.PointLight('#fff', 10, 10000, 10);
scene.add(light);

const container = new THREE.Object3D();
scene.add(container);

export const grids = [
    new Grid(container, 1, 3),
    new Grid(container, 2, 4),
    new Grid(container, 3, 6),
];


export default {
    duration: 30,
    element: renderer.domElement,
    size: SIZE,
    onTick: (tick) => {
        container.rotation.z = PI2 * tick;

        light.intensity = 5 * Math.sin(PI2 * 5 * tick) + 10;
        light.position.z = 1000 * Math.sin(PI2 * 3 * tick) + 1000;

        for (let i = 0; i < grids.length; i++) {
            grids[i].move(tick);
        }

        composer.render();
    },
}