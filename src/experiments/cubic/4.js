import * as THREE from 'three';
import * as Recorder from '../recorder';

export const PI2 = Math.PI * 2;
export const DEPTH = 1000;
export const SIZE = 640;
export const CUBE_SIZE = 60;
export const CUBE_ROW = 20;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 1, 1, DEPTH * 2);
camera.position.z = DEPTH;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(SIZE, SIZE);
document.body.appendChild(renderer.domElement);

const light = new THREE.PointLight(0xFFFFFF, 2, DEPTH * 2);
scene.add(light);
light.position.z = DEPTH;

const geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);

const materials = [
    new THREE.MeshPhongMaterial({
        color: '#3d93f5',
    }),
    new THREE.MeshPhongMaterial({
        color: '#d4454e',
    }),
    new THREE.MeshPhongMaterial({
        color: '#3d93f5',
    }),
    new THREE.MeshPhongMaterial({
        color: '#9b5cf0',
    }),
    new THREE.MeshPhongMaterial({
        color: '#3443b5',
    }),
    new THREE.MeshPhongMaterial({
        color: '#c74f2a',
    }),
];

const mesh = new THREE.Mesh(geometry, materials);

class Shape extends THREE.Mesh {
    constructor(x, y, flipped) {
        super();

        this.position.x = CUBE_SIZE * (x - (CUBE_ROW / 2 - 0.5));
        this.position.y = -CUBE_SIZE * (y - (CUBE_ROW / 2 - 0.5));

        this.positionOffset = 50 * Math.random() + 50;
        this.positionSpeed = (-1 + Math.round(Math.random()) * 2) * Math.round(Math.random() + 1);
        this.rotationSpeedX = (-1 + Math.round(Math.random()) * 2) * Math.round(Math.random() * 3 + 1);
        this.rotationSpeedY = (-1 + Math.round(Math.random()) * 2) * Math.round(Math.random() * 2 + 1);

        this.cube = mesh.clone();
        this.add(this.cube);

        if (flipped) {
            this.cube.rotation.y = Math.PI / 2;
        }
    }

    move(tick) {
        this.position.z = Math.sin(PI2 * this.positionSpeed * tick) * this.positionOffset;
        this.rotation.x = PI2 * this.rotationSpeedX * tick;
        this.rotation.y = PI2 * this.rotationSpeedY * tick;
    }
}

const shapes = [];
for (let x = 0; x < CUBE_ROW; x++) {
    for (let y = 0; y < CUBE_ROW; y++) {
        const flipped = (x > 3 && x < 8 && y > 3 && y < 8) || (x > 11 && x < 16 && y > 3 && y < 8) || (x > 3 && x < 16 && y > 11 && y < 16);
        const shape = new Shape(x, y, flipped);
        scene.add(shape);
        shapes.push(shape);
    }
}

function ease(t, b = 0, c = 1, d = 1) {
    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
}

Recorder.init({
    duration: 3,
    target: renderer.domElement,
    render: (tick) => {
        const t = ease((tick + 0.5) % 1);

        for (let i = 0; i < shapes.length; i++) {
            shapes[i].move(t);
        }

        renderer.render(scene, camera);
    },
});
