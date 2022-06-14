import { PI, PI_HALF } from '@/constants';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import Path from './Path';

const SIZE = 1200;
const PI2 = 2 * PI;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(30, 1, 1, 10000);
camera.position.z = 2000;

const renderer = new THREE.WebGLRenderer({
    antialias: true,
});
renderer.setSize(SIZE, SIZE);

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(SIZE, SIZE), 1, 0, 0.1);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const light = new THREE.PointLight('#fff', 1, 5000);
scene.add(light);

const container = new THREE.Object3D();
scene.add(container);

const paths = [
    new Path(container, new THREE.Vector3(-500, -100, 1000), new THREE.Vector3(-130, 50), 5, 5, 2, '#fff'),
    new Path(container, new THREE.Vector3(-130, 50), new THREE.Vector3(150, 100, -1000), 5, 50, 1, '#fff', 3),
    new Path(container, new THREE.Vector3(150, 106, -1000), new THREE.Vector3(400, 0, 1000), 5, 50, 1, '#e74244'),
    new Path(container, new THREE.Vector3(150, 104, -1000), new THREE.Vector3(400, -50, 1000), 5, 50, 1, '#f28d51'),
    new Path(container, new THREE.Vector3(150, 102, -1000), new THREE.Vector3(400, -100, 1000), 5, 50, 1, '#e1db58'),
    new Path(container, new THREE.Vector3(150, 98, -1000), new THREE.Vector3(400, -150, 1000), 5, 50, 1, '#93c963'),
    new Path(container, new THREE.Vector3(150, 96, -1000), new THREE.Vector3(400, -200, 1000), 5, 50, 1, '#88c5f3'),
    new Path(container, new THREE.Vector3(150, 94, -1000), new THREE.Vector3(400, -250, 1000), 5, 50, 1, '#903a96'),
];

const triangleGeometry = new THREE.CylinderGeometry(300, 300, 5000, 3, 1, true);
const triangleMaterial = new THREE.MeshPhysicalMaterial({
    color: '#fff',
    side: THREE.BackSide,
});
const triangle = new THREE.Mesh(triangleGeometry, triangleMaterial);
container.add(triangle);
triangle.position.z = -2500;
triangle.rotation.x = PI_HALF;
triangle.rotation.y = PI;

export default {
    duration: 10,
    element: renderer.domElement,
    size: SIZE,
    onTick: (tick) => {
        container.rotation.x = 0.01 * Math.sin(PI2 * 2 * tick);
        container.rotation.y = 0.05 * Math.sin(PI2 * tick);

        light.intensity = 0.2 * Math.sin(PI2 * 2 * tick) + 1;
        light.decay = 2 * Math.sin(PI2 * 5 * tick) + 10;

        for (let i = 0; i < paths.length; i++) {
            paths[i].move(tick);
        }

        composer.render();
    },
}