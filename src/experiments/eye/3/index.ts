import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import IrisShape from './IrisShape';
import LidShape from './LidShape';
import TriangleShape from './TriangleShape';

export const SIZE = 640;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 1, 1, 2000);
camera.position.z = 500;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(SIZE, SIZE);
renderer.toneMappingExposure = 2;

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(SIZE, SIZE), 1, 1, 0);

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const light = new THREE.PointLight('#aaa', 1, 1000, 3);
scene.add(light);
light.position.z = camera.position.z * 0.8;

const iris = new THREE.Object3D();
scene.add(iris);

for (let i = 0; i < 200; i++) {
    new IrisShape(iris, i / 200);
}

const lids = new THREE.Object3D();
scene.add(lids);
lids.position.z = 200;

for (let i = 0; i < 1000; i++) {
    new LidShape(lids);
}

const triangles = new THREE.Object3D();
scene.add(triangles);

for (let i = 0; i < 1000; i++) {
    new TriangleShape(lids);
}

export default {
    duration: 5,
    element: renderer.domElement,
    size: SIZE,
    onTick: (tick) => {
        iris.children.forEach((child: IrisShape) => child.move(tick));
        lids.children.forEach((child: IrisShape) => child.move(tick));
        composer.render();
    },
}
