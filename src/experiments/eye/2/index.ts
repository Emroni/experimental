import { PI2 } from '@/constants';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import Shape from './Shape';

const SIZE = 640;
const SHAPES = 5000;
const SHAPE_SIZE = 10;

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

const light = new THREE.PointLight('#aaa', 1, 1000, 3);
scene.add(light);
light.position.z = camera.position.z / 2;

const geometries = [
    new THREE.TetrahedronGeometry(SHAPE_SIZE),
    new THREE.OctahedronGeometry(SHAPE_SIZE),
];

export const colors = [
    // '#f44336',
    // '#e91e63',
    // '#9c27b0',
    // '#673ab7',
    // '#3f51b5',
    // '#2196f3',
    // '#03a9f4',
    // '#03a9f4',
    '#00bcd4',
    '#009688',
    '#4caf50',
    '#8bc34a',
    // '#cddc39',
    // '#ffeb3b',
    // '#ffc107',
    // '#ff9800',
];

const meshes = [];

for (let i = 0; i < geometries.length; i++) {
    for (let j = 0; j < colors.length; j++) {
        const material = new THREE.MeshPhongMaterial({
            color: colors[j],
        });

        const mesh = new THREE.Mesh(geometries[i], material);
        meshes.push(mesh);
    }
}

const shapes = [];

for (let i = 0; i < SHAPES; i++) {
    new Shape(scene, shapes, meshes, i / SHAPES);
}

const planeGeometry = new THREE.BoxGeometry(1, SIZE, SIZE);
const planeMaterial = new THREE.MeshBasicMaterial({
    color: '#000',
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

for (let i = 0; i < 3; i++) {
    const plane = planeMesh.clone();
    scene.add(plane);
    const a = PI2 * (i / 3 + 0.5);
    plane.position.x = SIZE * 0.55 * Math.sin(a);
    plane.position.y = SIZE * 0.55 * Math.cos(a);
    plane.position.z = camera.position.z - 100;
    plane.lookAt(0, 0, plane.position.z);

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
