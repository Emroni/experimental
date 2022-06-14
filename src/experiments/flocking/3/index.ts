import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import Shape from './Shape';

export const SIZE = 640;
export const RADIUS = 170;
export const ROWS = 100;

const scene = new THREE.Scene();
scene.rotation.x = Math.PI / 2;

const camera = new THREE.PerspectiveCamera(75, 1, 1, 2000);
camera.position.z = SIZE / (Math.tan(camera.fov * (Math.PI / 180) / 2) * 2);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(SIZE, SIZE);
renderer.toneMappingExposure = 2;

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(SIZE, SIZE), 1, 1, 0);

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const lightDistance = 1.5 * RADIUS;

const light1 = new THREE.PointLight('#3f51b5', 5, 3 * lightDistance, 3);
scene.add(light1);
light1.position.set(lightDistance, lightDistance, lightDistance);

const light2 = new THREE.PointLight('#00bcd4', 5, 3 * lightDistance, 2);
scene.add(light2);
light2.position.set(-lightDistance, -lightDistance, lightDistance);

const shapes = [];

for (let i = 0; i < ROWS; i++) {
    new Shape(scene, shapes, i / ROWS);
}

export default {
    duration: 20,
    element: renderer.domElement,
    size: SIZE,
    onTick: (tick) => {

        const t = (tick + 0.5) % 1;

        for (let i = 0; i < shapes.length; i++) {
            shapes[i].move(t);
        }

        composer.render();
    },
}
