import * as THREE from 'three';
import * as Recorder from '../recorder';

export const PI2 = Math.PI * 2;
export const PI_HALF = Math.PI / 2;
export const DEPTH = 1000;
export const SIZE = 640;
export const CUBE_SIZE = 50;
export const CUBE_ROW = 10;

const scene = new THREE.Scene();
scene.rotation.x = PI_HALF / 4;
scene.rotation.y = PI_HALF / 2;

const camera = new THREE.PerspectiveCamera(75, 1, 1, DEPTH * 2);
camera.position.y = -DEPTH * 0.05;
camera.position.z = DEPTH;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(SIZE, SIZE);
document.body.appendChild(renderer.domElement);

const ambient = new THREE.AmbientLight(0xFFFFFF, 0.5);
scene.add(ambient);

const light = new THREE.PointLight(0xFFFFFF, 1, DEPTH * 2);
scene.add(light);
light.position.z = DEPTH;

const geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);

const materials = [
    new THREE.MeshPhongMaterial({
        color: '#e91e63',
    }),
    new THREE.MeshPhongMaterial({
        color: '#2196f3',
    }),
    new THREE.MeshPhongMaterial({
        color: '#9c27b0',
    }),
    new THREE.MeshPhongMaterial({
        color: '#009688',
    }),
    new THREE.MeshPhongMaterial({
        color: '#cddc39',
    }),
    new THREE.MeshPhongMaterial({
        color: '#ff9800',
    }),
];

const mesh = new THREE.Mesh(geometry, materials);

class Shape extends THREE.Object3D {
    constructor(x, y, z) {
        super();

        this.delay = (x * y * z) / (CUBE_ROW * CUBE_ROW * CUBE_ROW) + 0.1 * Math.random();

        this.cube = mesh.clone();
        this.add(this.cube);
        this.cube.position.x = CUBE_SIZE * (x - (CUBE_ROW / 2 - 0.5));
        this.cube.position.y = CUBE_SIZE * (y - (CUBE_ROW / 2 - 0.5));
        this.cube.position.z = CUBE_SIZE * (z - (CUBE_ROW / 2 - 0.5));
    }

    ease(t, b = 0, c = 1, d = 1) {
        t = Math.max(0, Math.min(1, t));
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    }

    move(tick) {
        const t = tick * 12 - this.delay;
        this.rotation.x = PI_HALF * (this.ease(t) + this.ease(t - 6));
        this.rotation.z = PI_HALF * (this.ease(t - 2) + this.ease(t - 8));
        this.rotation.y = -PI_HALF * (this.ease(t - 4) + this.ease(t - 10));

        this.cube.rotation.copy(this.rotation);
    }
}

const shapes = [];
for (let x = 0; x < CUBE_ROW; x++) {
    for (let y = 0; y < CUBE_ROW; y++) {
        for (let z = 0; z < CUBE_ROW; z++) {
            const shape = new Shape(x, y, z);
            scene.add(shape);
            shapes.push(shape);
        }
    }
}

Recorder.init({
    duration: 12,
    fps: 60,
    target: renderer.domElement,
    render: (tick) => {

        for (let i = 0; i < shapes.length; i++) {
            shapes[i].move(tick);
        }

        renderer.render(scene, camera);
    },
});
