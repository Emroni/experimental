import * as THREE from 'three';
import * as Recorder from '../recorder';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const SIZE = 1200;
const PI2 = Math.PI * 2;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 1, 1, 10000);
camera.position.z = 1000;

const renderer = new THREE.WebGLRenderer({
    antialias: true,
});
renderer.setSize(SIZE, SIZE);
document.body.appendChild(renderer.domElement);

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

const bumpMap = new THREE.TextureLoader().load('textures/metal-1.png');

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

class Path {
    constructor(options) {
        this.options = {
            count: 100,
            rotation: 0,
            offset: 0, ...options,
        };

        this.target = new THREE.Vector3();

        if (this.options.geometryMatrix) {
            this.options.geometry.applyMatrix(this.options.geometryMatrix);
        }

        const material = new THREE.MeshPhysicalMaterial({
            bumpMap,
            color: this.options.color,
            flatShading: true,
            metalness: 0.5,
            reflectivity: 0.2,
            roughness: 0.5,
        });

        this.mesh = new THREE.InstancedMesh(this.options.geometry, material, this.options.count);
        container.add(this.mesh);

        this.segments = [];
        for (let i = 0; i < this.mesh.count; i++) {
            const segment = new THREE.Object3D();
            const n = (i + this.options.offset) / this.mesh.count;
            segment.scale.setScalar(0.5 * Math.pow(n, 3) + Math.min(0.5, 5 * n));
            this.segments.push(segment);
        }
    }

    step(index, tick, vector) {
        const n = (index + this.options.offset) / this.segments.length;
        const radius = 50 * Math.sin(PI2 * 3 * tick) + 300 * Math.pow(n, 4) + 300;
        const t = Math.PI * (tick + n);
        const tX = 8 * t;
        const tY = 6 * t;

        vector.x = Math.sin(tX) * Math.cos(tY) * radius;
        vector.y = Math.sin(tX) * Math.sin(tY) * radius;
        vector.z = Math.cos(tX) * radius;
    }

    move(tick) {
        for (let i = 0; i < this.segments.length; i++) {
            const segment = this.segments[i];
            this.step(i, tick, segment.position);

            this.step(i, tick + 0.0001, this.target);
            segment.lookAt(this.target);

            segment.rotation.z += this.options.rotation * Math.sin(PI2 * 5 * tick);

            segment.updateMatrix();
            this.mesh.setMatrixAt(i, segment.matrix);
        }

        this.mesh.instanceMatrix.needsUpdate = true;
    }
}

const paths = [
    new Path({
        count: 1,
        offset: 1,
        geometryMatrix: new THREE.Matrix4().makeRotationX(Math.PI / 2),
        geometry: new THREE.CylinderGeometry(20, 60, 120, 8),
        color: '#f00',
    }),
    new Path({
        count: 150,
        offset: -0.5,
        geometryMatrix: new THREE.Matrix4().makeRotationX(Math.PI / 2),
        geometry: new THREE.CylinderGeometry(40, 40, 80, 8),
        color: '#f00',
    }),
    new Path({
        count: 150,
        geometryMatrix: new THREE.Matrix4().makeRotationX(Math.PI / 2),
        geometry: new THREE.CylinderGeometry(40, 40, 20, 8),
        color: '#ddd',
    }),
    new Path({
        count: 100,
        rotation: 3,
        geometry: new THREE.TorusGeometry(60, 20, 6, 8),
        color: '#333',
    }),
];

Recorder.setup({
    duration: 30,
    skip: 13,
    target: renderer.domElement,
    render: (tick) => {
        container.rotation.x = 0.5 * Math.sin(PI2 * tick);
        container.rotation.y = PI2 * 2 * tick;

        for (let i = 0; i < paths.length; i++) {
            paths[i].move(tick);
        }

        composer.render();
    },
});
