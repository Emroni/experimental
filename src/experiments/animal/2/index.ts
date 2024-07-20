import { PI2 } from '@/constants';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import Shape from './Shape';

// TODO: Add change
// TODO: Add controls
// TODO: Add progress

const SIZE = 1200;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 1, 1, 10000);
camera.position.z = 1000;

const renderer = new THREE.WebGLRenderer({
    antialias: true,
});
renderer.setSize(SIZE, SIZE);

const renderScene = new RenderPass(scene, camera);
// const bloomPass = new UnrealBloomPass(new THREE.Vector2(SIZE, SIZE), controls.bloom.strength, controls.bloom.radius, controls.bloom.threshold);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(SIZE, SIZE), 1, 1, 0.3);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const container = new THREE.Object3D();
scene.add(container);

const shapes = [];



const loader = new GLTFLoader();
loader.load('/assets/models/animal-2.gltf', gltf => {
    const head = gltf.scene.children[0] as THREE.Mesh;

    for (let i = 0; i < head.geometry.index.array.length; i += 3) {
        const indices = Array.from(head.geometry.index.array).slice(i, i + 3);

        let positions = [];
        indices.forEach(index => {
            positions = positions.concat(Array.from(head.geometry.attributes.position.array).slice(index * 3, (index + 1) * 3));
        });

        const shape = new Shape(positions);
        container.add(shape);
        shapes.push(shape);
    }
});

// function change(key) {
//     if (!key || key === 'bloom') {
//         bloomPass.strength = controls.bloom.strength;
//         bloomPass.radius = controls.bloom.radius;
//         bloomPass.threshold = controls.bloom.threshold;
//     }
// }

export default {
    // controls,
    // change,
    duration: 10,
    element: renderer.domElement,
    size: SIZE,
    // progress: true,
    onTick: (tick) => {
        container.rotation.x = 0.1 * Math.sin(PI2 * 2 * tick) + 0.5;
        container.rotation.y = 0.1 * Math.sin(PI2 * tick);

        for (let i = 0; i < shapes.length; i++) {
            shapes[i].move(tick);
        }

        composer.render();
    },
}
