import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import Sphere from './Sphere';

// TODO: Add controls
// TODO: Add change
// TODO: Add progress

const SIZE = 1200;
const PI2 = 2 * Math.PI;

const controls = {
    bloom: {
        strength: 1,
        radius: 0.5,
        threshold: 0.3,
    },
};

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 1, 1, 10000);
camera.position.z = 1000;

const renderer = new THREE.WebGLRenderer({
    antialias: true,
});
renderer.setSize(SIZE, SIZE);

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(SIZE, SIZE), controls.bloom.strength, controls.bloom.radius, controls.bloom.threshold);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const container = new THREE.Object3D();
scene.add(container);

container.add(new Sphere('r', 500, 300, 0, 2, 0.0015));
container.add(new Sphere('b', 600, 200, 0.1, 4, 0.001));
container.add(new Sphere('g', 3000, 100, 0.2, 6, 0.0005));

function change(key) {
    if (!key || key === 'bloom') {
        bloomPass.strength = controls.bloom.strength;
        bloomPass.radius = controls.bloom.radius;
        bloomPass.threshold = controls.bloom.threshold;
    }
}

export default {
    // controls,
    // change,
    duration: 30,
    element: renderer.domElement,
    // progress: true,
    size: SIZE,
    onTick: (tick) => {
        container.rotation.y = PI2 * tick;

        container.children.forEach((child: Sphere) => child.move(tick));

        composer.render();
    },
}
