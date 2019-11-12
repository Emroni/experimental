import SimplexNoise from 'simplex-noise';
import * as THREE from 'three';
import * as Recorder from '../recorder';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export const PI2 = Math.PI * 2;
export const SIZE = 640;
export const RADIUS = 200;
export const SPREAD = 80;
export const SHAPE_SIZE = 10;
export const ROWS = 100;
export const ROW_SHAPES = 10;
export const LENGTH = 0.1;

const scene = new THREE.Scene();
scene.rotation.x = Math.PI / 2;

const camera = new THREE.PerspectiveCamera(75, 1, 1, 2000);
camera.position.z = SIZE / (Math.tan(camera.fov * (Math.PI / 180) / 2) * 2);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(SIZE, SIZE);
renderer.toneMappingExposure = 2;
document.body.appendChild(renderer.domElement);

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(SIZE, SIZE), 1.5, 0.4, 0.85);
bloomPass.threshold = 0;
bloomPass.strength = 1;
bloomPass.radius = 1;

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const light1 = new THREE.PointLight('#e91e63', 2, RADIUS * 5, 1);
scene.add(light1);
light1.position.set(RADIUS, RADIUS, RADIUS);

const light2 = new THREE.PointLight('#009688', 2, RADIUS * 5, 1);
scene.add(light2);
light2.position.set(-RADIUS, -RADIUS, -RADIUS);

const geometry = new THREE.ConeGeometry(SHAPE_SIZE / 2, SHAPE_SIZE, 3, 1);

const material = new THREE.MeshPhongMaterial({
    color: '#fff',
});

const shape = new THREE.Mesh(geometry, material);

const simplex = new SimplexNoise();

const shapes = [];

class Shape extends THREE.Object3D {
    constructor(row) {
        super();

        this.index = row * LENGTH;

        this.multiplier = new THREE.Vector2(2, 3 + Math.random());

        scene.add(this);
        shapes.push(this);

        this.meshes = [];
        for (let j = 0; j < ROW_SHAPES; j++) {
            const mesh = shape.clone();
            this.add(mesh);
            this.meshes.push(mesh);
            mesh.userData.position = new THREE.Vector3(Math.random(), Math.random(), Math.random());
        }
    }

    move(tick) {
        const t = PI2 * ((this.index + tick) % 1);
        const tX = this.multiplier.x * t;
        const tY = this.multiplier.y * t;
        this.position.x = Math.sin(tX) * Math.cos(tY) * RADIUS;
        this.position.y = Math.sin(tX) * Math.sin(tY) * RADIUS;
        this.position.z = Math.cos(tX) * RADIUS;
        this.lookAt(scene.position);


        for (let i = 0; i < this.meshes.length; i++) {
            const mesh = this.meshes[i];
            const n = PI2 * ((this.index + i + tick) % 1);
            const noiseX = Math.sin(n);
            const noiseY = Math.cos(n);
            const distance = SPREAD * simplex.noise3D(noiseX, noiseY, this.index + i);
            mesh.position.x = distance * mesh.userData.position.x;
            mesh.position.y = distance * mesh.userData.position.y;
            mesh.position.z = distance * mesh.userData.position.z;
        }
    }

}

for (let i = 0; i < ROWS; i++) {
    new Shape(i / ROWS);
}

Recorder.init({
    duration: 10,
    target: renderer.domElement,
    render: (tick) => {

        for (let i = 0; i < shapes.length; i++) {
            shapes[i].move(tick);
        }

        composer.render();
    },
});
