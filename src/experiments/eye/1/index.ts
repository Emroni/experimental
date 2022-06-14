import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import Shape, { OUTER_RADIUS } from './Shape';

const SIZE = 640;
const SHAPES = 5000;

const scene = new THREE.Scene();

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

const lightDistance = 1.5 * OUTER_RADIUS;

const light1 = new THREE.PointLight('#f44336', 2, lightDistance, 2);
scene.add(light1);
light1.position.z = lightDistance;

const light2 = new THREE.PointLight('#ff5722', 2, lightDistance, 2);
scene.add(light2);
light1.position.z = lightDistance;


const shapes = [];

for (let i = 0; i < SHAPES; i++) {
    new Shape(scene, shapes, i / SHAPES);
}

export default {
    duration: 10,
    element: renderer.domElement,
    size: SIZE,
    onTick: (tick) => {

        for (let i = 0; i < shapes.length; i++) {
            shapes[i].move(tick);
        }

        composer.render();
    },
}
