import SimplexNoise from 'simplex-noise';
import * as THREE from 'three';
import { TimelineLite, Linear } from 'gsap';
import * as Recorder from '../recorder';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const PI2 = Math.PI * 2;
const PI_HALF = Math.PI / 2;
const SIZE = 640;
const SHAPES = 3000;
const COLORS = [
    '#f44336',
    '#e91e63',
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
    '#009688',
    '#4caf50',
    '#8bc34a',
];

const scene = new THREE.Scene();
scene.position.y = 200;

const camera = new THREE.PerspectiveCamera(75, 1, 1, 2000);
camera.position.z = 1000;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(SIZE, SIZE);
renderer.toneMappingExposure = 1.5;
document.body.appendChild(renderer.domElement);

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(SIZE, SIZE), 0.8, 0);

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const light = new THREE.PointLight(0xFFFFFF, 5, 2000, 5);
scene.add(light);

const container = new THREE.Object3D();
scene.add(container);

const geometry = new THREE.BoxGeometry(30, 30, 30);

const simplex = new SimplexNoise();

class Shape extends THREE.Object3D {

    constructor(index) {
        super();

        this.index = index;
        this.offset = index / SHAPES;
        this.amplitude = 200 * Math.pow(this.offset, 2) + 50;
        this.speed = Math.round(Math.random() * 2) + 1;

        this.scale.setScalar(0.2 * Math.random() + 0.8);

        const radius = 1000 * (1 - this.offset);
        const theta = PI2 * Math.random();
        this.position.x = radius * Math.sin(theta);
        this.position.y = radius * Math.cos(theta);

        this.rotation.order = 'ZXY';
        this.rotationOffset = PI2 * Math.random();
        this.rotation.z = Math.atan2(this.position.y, this.position.x) + PI_HALF;

        this.material = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
        });

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.add(this.mesh);

        this.mesh.scale.setScalar(0.5 * Math.random() + 0.5);
        this.mesh.position.y = 10 * Math.random() + 10;
        this.mesh.rotation.y = PI2 * Math.random();

        this.color = COLORS[COLORS.length - 1];
        this.colorOffset = this.offset * COLORS.length;
        this.timeline = new TimelineLite();
        COLORS.forEach(c => {
            this.timeline.to(this, 1, {
                ease: Linear.easeInOut,
                color: c,
            });
        });
    }

    move(tick) {
        this.timeline.seek((COLORS.length * 10 * tick + this.colorOffset) % COLORS.length);
        this.material.color.set(this.color);

        const noiseAlpha = PI2 * (this.offset + tick);
        const noiseX = Math.cos(noiseAlpha);
        const noiseY = Math.sin(noiseAlpha);
        const noise = simplex.noise3D(noiseX, noiseY, this.offset);

        this.scale.setScalar(0.5 * Math.abs(noise) + 0.5);
        this.position.z = this.amplitude * noise;
        this.rotation.x = PI2 * (this.speed * tick) + this.rotationOffset;
    }

}

for (let i = 0; i < SHAPES; i++) {
    const shape = new Shape(i);
    container.add(shape);
}

Recorder.init({
    duration: 20,
    target: renderer.domElement,
    render: (tick) => {
        light.position.z = 100 * Math.sin(PI2 * 4 * tick) + 100;

        container.rotation.x = 0.1 * Math.sin(PI2 * 2 * tick) - 1;
        container.rotation.z = -PI2 * tick;

        for (let i = 0; i < container.children.length; i++) {
            container.children[i].move(tick);
        }

        composer.render();
    },
});
