import * as THREE from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export const PI2 = Math.PI * 2;
export const PI_HALF = Math.PI / 2;
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

const irisGeometry = new THREE.DodecahedronGeometry(10);
const irisMaterial = new THREE.MeshPhongMaterial({
    color: '#3f51b5',
});

class IrisShape extends THREE.Mesh {

    angle: THREE.Vector2;
    index: number;
    offset: number;
    rotationMultiplier: number;

    constructor(index: number) {
        super(irisGeometry, irisMaterial);
        iris.add(this);

        this.index = index;
        this.offset = Math.random();

        this.rotation.order = 'ZXY';
        this.angle = new THREE.Vector2(Math.sin(PI2 * this.index), Math.cos(PI2 * this.index));
        this.rotation.z = Math.atan2(this.angle.y, this.angle.x);
        this.rotationMultiplier = Math.round(2 * Math.random()) + 0.5;
    }

    move(tick) {
        const t = PI2 * (tick + this.offset);
        const radius = 10 * (Math.sin(t) + 1) + 40;
        this.position.x = radius * this.angle.x;
        this.position.y = radius * this.angle.y;
        this.position.z = 50 * Math.sin(t + PI_HALF);
        this.rotation.y = this.rotationMultiplier * t;
    }
}

for (let i = 0; i < 200; i++) {
    new IrisShape(i / 200);
}

const lids = new THREE.Object3D();
scene.add(lids);
lids.position.z = 200;

const lidsGeometry = new THREE.ConeGeometry(1, 40, 3);
const lidsMaterial = new THREE.MeshPhongMaterial({
    color: '#2196f3',
});


class LidShape extends THREE.Object3D {

    mesh: THREE.Mesh;
    offset: number;
    previousPosition: THREE.Vector3;

    constructor() {
        super();
        lids.add(this);

        this.offset = Math.random();
        this.previousPosition = new THREE.Vector3();

        this.position.set(20 * Math.random() - 10, 20 * Math.random() - 10, 0);
        this.rotation.z = Math.PI * Math.round(Math.random());

        this.mesh = new THREE.Mesh(lidsGeometry, lidsMaterial);
        this.add(this.mesh);
        this.mesh.rotation.order = 'ZXY';
    }

    move(tick) {
        const t = tick + this.offset;
        this.previousPosition.copy(this.mesh.position);

        this.mesh.position.x = 100 * Math.tan(Math.PI * t);
        this.mesh.position.y = 30 * Math.cos(PI2 * t) + 20;
        this.mesh.scale.setScalar(Math.max(0.0001, 1 - Math.abs(this.mesh.position.x * 2) / SIZE));

        this.mesh.rotation.y = t * 10;
        this.mesh.rotation.z = Math.atan2(this.mesh.position.y - this.previousPosition.y, this.mesh.position.x - this.previousPosition.x) - PI_HALF;
    }
}

for (let i = 0; i < 1000; i++) {
    new LidShape();
}

const triangles = new THREE.Object3D();
scene.add(triangles);

// const trianglesGeometry = new THREE.ConeGeometry(2, 10, 10);
// const trianglesMaterial = new THREE.MeshPhongMaterial({
//     color: '#2196f3',
// });

class TriangleShape extends THREE.Object3D {
    
    mesh: THREE.Mesh;
    offset: number;
    previousPosition: THREE.Vector3;

    constructor() {
        super();
        lids.add(this);

        this.offset = Math.random();
        this.previousPosition = new THREE.Vector3();

        this.position.set(20 * Math.random() - 10, 20 * Math.random() - 10, 0);
        this.rotation.z = Math.PI * Math.round(Math.random());

        this.mesh = new THREE.Mesh(lidsGeometry, lidsMaterial);
        this.add(this.mesh);
        this.mesh.rotation.order = 'ZXY';
    }

    move(tick) {
        const t = tick + this.offset;
        this.previousPosition.copy(this.mesh.position);

        this.mesh.position.x = 100 * Math.tan(Math.PI * t);
        this.mesh.position.y = 30 * Math.cos(PI2 * t) + 20;
        this.mesh.scale.setScalar(Math.max(0.0001, 1 - Math.abs(this.mesh.position.x * 2) / SIZE));

        this.mesh.rotation.y = t * 10;
        this.mesh.rotation.z = Math.atan2(this.mesh.position.y - this.previousPosition.y, this.mesh.position.x - this.previousPosition.x) - PI_HALF;
    }
}

for (let i = 0; i < 1000; i++) {
    new TriangleShape();
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
