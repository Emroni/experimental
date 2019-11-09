import SimplexNoise from 'simplex-noise';
import * as THREE from 'three';
import * as Recorder from '../recorder';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const SIZE = 1200;
const PI2 = Math.PI * 2;
const ROWS = 50;
const SPACING = 50;
const CELL = 40;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 1, 1, 10000);
camera.position.y = -1200;
camera.position.z = 400;
camera.rotation.x = 0.8;

const renderer = new THREE.WebGLRenderer({
    antialias: true,
});
renderer.setSize(SIZE, SIZE);
document.body.appendChild(renderer.domElement);

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(SIZE, SIZE), 0.5, 0, 0.7);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const light = new THREE.PointLight('#fff', 10, 10000, 10);
scene.add(light);

const container = new THREE.Object3D();
scene.add(container);

class Grid extends THREE.Object3D {
    constructor(index, segments) {
        super();

        this.index = index;

        container.add(this);

        this.simplex = new SimplexNoise();

        const geometry = new THREE.RingGeometry(CELL / 2, CELL / 1.5, segments);

        this.material = new THREE.MeshPhongMaterial();

        this.mesh = new THREE.InstancedMesh(geometry, this.material, ROWS * ROWS);
        this.add(this.mesh);

        this.shapes = [];
        for (let x = 0; x < ROWS; x++) {
            for (let y = 0; y < ROWS; y++) {
                const shape = new THREE.Object3D();
                this.shapes.push(shape);

                shape.userData.x = x;
                shape.userData.y = y;
                shape.userData.noise = 0;

                shape.position.x = SPACING * (x - ROWS / 2 + 0.5);
                shape.position.y = SPACING * (y - ROWS / 2 + 0.5);
            }
        }
    }


    move(tick) {
        const offset = ((this.index / grids.length) + tick) % 1;
        const t = PI2 * offset;
        const noise = 0.02 * Math.sin(t) + 0.04;
        const amplitude = 30 * Math.cos(t) + 70;

        this.rotation.x = 0.1 * Math.sin(t);
        this.rotation.t = 0.1 * Math.cos(t);

        this.material.color.setHSL(offset, 1, 0.5);

        for (let i = 0; i < this.shapes.length; i++) {
            const shape = this.shapes[i];

            const noiseAlpha = PI2 * (shape.userData.x + offset);
            const noiseX = Math.sin(noiseAlpha) + noise * shape.userData.x;
            const noiseY = Math.cos(noiseAlpha) + noise * shape.userData.y;

            shape.position.z = amplitude * this.simplex.noise3D(noiseX, noiseY, 0);
            shape.rotation.x = Math.PI * this.simplex.noise3D(noiseX, noiseY, 1);
            shape.rotation.y = Math.PI * this.simplex.noise3D(noiseX, noiseY, 2);
            shape.rotation.z = Math.PI * this.simplex.noise3D(noiseX, noiseY, 3);
            shape.scale.setScalar(0.3 * Math.abs(this.simplex.noise3D(noiseX, noiseY, 4)) + 0.7);

            shape.updateMatrix();
            this.mesh.setMatrixAt(i, shape.matrix);
        }

        this.mesh.instanceMatrix.needsUpdate = true;
    }
}

const grids = [
    new Grid(1, 3),
    new Grid(2, 4),
    new Grid(3, 6),
];


Recorder.setup({
    duration: 30,
    target: renderer.domElement,
    render: (tick) => {
        container.rotation.z = PI2 * tick;

        light.intensity = 5 * Math.sin(PI2 * 5 * tick) + 10;
        light.position.z = 1000 * Math.sin(PI2 * 3 * tick) + 1000;

        for (let i = 0; i < grids.length; i++) {
            grids[i].move(tick);
        }

        composer.render();
    },
});
