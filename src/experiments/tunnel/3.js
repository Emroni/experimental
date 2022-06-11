import SimplexNoise from 'simplex-noise';
import * as THREE from 'three';
import { TimelineLite, Linear } from 'gsap';
import * as Recorder from '../recorder';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const PI2 = Math.PI * 2;
const SIZE = 640;
const CUBE = 50;
const LAYERS = 20;
const ROWS = 5;
const DEPTH = 2000;
const COLORS = [
    '#f44336',
    '#e91e63',
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
    // '#03a9f4',
    // '#03a9f4',
    // '#00bcd4',
    '#009688',
    '#4caf50',
    '#8bc34a',
    // '#cddc39',
    // '#ffeb3b',
    // '#ffc107',
    // '#ff9800',
];

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 1, 1, DEPTH * 2);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(SIZE, SIZE);
renderer.toneMappingExposure = 1.5;
document.body.appendChild(renderer.domElement);

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(SIZE, SIZE), 0.2, 0.01);

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const light = new THREE.PointLight(0xFFFFFF, 2, DEPTH, 3);
scene.add(light);

const simplex = new SimplexNoise();

class Layer extends THREE.Object3D {

    constructor(index) {
        super();

        this.index = index;
        this.position.z = -DEPTH / LAYERS * (LAYERS - index);

        this.color = COLORS[COLORS.length - 1];
        this.timeline = new TimelineLite();
        COLORS.forEach(c => {
            this.timeline.to(this, 1, {
                ease: Linear.easeInOut,
                color: c,
            });
        });

        this.material = new THREE.MeshPhongMaterial();

        const geometry = new THREE.BoxGeometry(CUBE, CUBE, CUBE);
        const mesh = new THREE.Mesh(geometry, this.material);

        for (let row = 2; row <= ROWS; row++) {
            const children = Math.pow(row, 2) + 2;

            for (let i = 0; i < children; i++) {
                const child = mesh.clone();
                this.add(child);

                child.userData = {
                    index: (i / children) + ((row % 2) * 0.25),
                    radius: CUBE * row,
                    row,
                };
            }
        }

    }

    move(tick) {
        this.timeline.seek((COLORS.length * tick + this.index) % COLORS.length);
        this.material.color.set(this.color);

        const noiseAlpha = PI2 * (0.5 * this.index + tick);
        const noiseX = Math.cos(noiseAlpha);
        const noiseY = Math.sin(noiseAlpha);
        this.rotation.z = 0.2 * simplex.noise2D(noiseX, noiseY);

        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];

            const noiseAlpha = PI2 * ((0.015 * this.index) + (0.01 * (ROWS - child.userData.row)) + tick);
            const noiseX = Math.cos(noiseAlpha);
            const noiseY = Math.sin(noiseAlpha);
            const noise = 0.2 * simplex.noise2D(noiseX, noiseY);

            const n = PI2 * child.userData.index + noise;
            const r = child.userData.radius * (1 - Math.sin(noise));
            child.position.x = r * Math.sin(n);
            child.position.y = r * Math.cos(n);
            child.rotation.z = Math.atan2(child.position.y, child.position.x) + (PI2 * 3 * tick) + (Math.PI / 4);
        }
    }

}

for (let i = 0; i < LAYERS; i++) {
    const layer = new Layer(i);
    scene.add(layer);
}

Recorder.init({
    duration: 20,
    target: renderer.domElement,
    render: (tick) => {
        light.position.z = -DEPTH * (0.1 * Math.abs(Math.sin(PI2 * tick)) + 0.1);

        for (let i = 0; i < LAYERS; i++) {
            scene.children[i + 1].move(tick);
        }

        composer.render();
    },
});
