import { PI2 } from '@/constants';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import Path from './Path';

// TODO: Add skip

const SIZE = 1200;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 1, 1, 10000);
camera.position.z = 1000;

const renderer = new THREE.WebGLRenderer({
    antialias: true,
});
renderer.setSize(SIZE, SIZE);

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(SIZE, SIZE), 1, 0.5, 0.2);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const light1 = new THREE.PointLight('#aaa', 3, 4000, 10);
scene.add(light1);
light1.position.z = 1000;

const light2 = new THREE.PointLight('#444', 3, 4000, 10);
scene.add(light2);
light2.position.x = -300;
light2.position.y = -300;
light2.position.z = 100;

const light3 = new THREE.PointLight('#333', 1, 4000, 5);
scene.add(light3);
light3.position.x = -500;
light3.position.y = 500;
light3.position.z = 300;

const container = new THREE.Object3D();
scene.add(container);

const bumpMap = new THREE.TextureLoader().load('/assets/textures/metal-1.png');

const sphereGeometry = new THREE.SphereGeometry(250, 12, 6);

const sphereMaterial = new THREE.MeshPhysicalMaterial({
    bumpMap,
    color: '#333',
    flatShading: true,
    metalness: 0.3,
    reflectivity: 0.6,
    roughness: 0.3,
});

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
container.add(sphere);

const paths = [
    new Path(container, bumpMap, {
        count: 1,
        offset: 1,
        geometryMatrix: new THREE.Matrix4().makeRotationX(Math.PI / 2),
        geometry: new THREE.CylinderGeometry(20, 60, 120, 8),
        color: '#f00',
    }),
    new Path(container, bumpMap, {
        count: 150,
        offset: -0.5,
        geometryMatrix: new THREE.Matrix4().makeRotationX(Math.PI / 2),
        geometry: new THREE.CylinderGeometry(40, 40, 80, 8),
        color: '#f00',
    }),
    new Path(container, bumpMap, {
        count: 150,
        geometryMatrix: new THREE.Matrix4().makeRotationX(Math.PI / 2),
        geometry: new THREE.CylinderGeometry(40, 40, 20, 8),
        color: '#ddd',
    }),
    new Path(container, bumpMap, {
        count: 100,
        rotation: 3,
        geometry: new THREE.TorusGeometry(60, 20, 6, 8),
        color: '#333',
    }),
];

export default {
    duration: 30,
    element: renderer.domElement,
    size: SIZE,
    // skip: 13,
    onTick: (tick) => {
        container.rotation.x = 0.5 * Math.sin(PI2 * tick);
        container.rotation.y = PI2 * 2 * tick;

        for (let i = 0; i < paths.length; i++) {
            paths[i].move(tick);
        }

        composer.render();
    },
}
