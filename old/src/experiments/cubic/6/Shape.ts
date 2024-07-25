import SimplexNoise from 'simplex-noise';
import * as THREE from 'three';

export const CUBE = 13;
export const ROWS = 50;
const LENGTH = 100;
const NOISE = 30;
const WIDTH = CUBE * ROWS;
const COLORS = [
    '#111',
    '#555',
    '#aaa',
    '#eee',
];

export default class Shape extends THREE.Object3D {

    head: THREE.Object3D;
    tail: THREE.Object3D;
    speed: number;
    simplex: SimplexNoise;

    constructor() {
        super();

        this.speed = 0.05 * Math.round(Math.random() * 2) + 0.05;

        this.position.x = -(WIDTH) / 2;
        this.position.y = -(WIDTH) / 2;
        this.position.z = -(WIDTH) / 2;

        const geometry = new THREE.BoxGeometry(CUBE, CUBE, CUBE);
        const material = new THREE.MeshPhongMaterial({
            color: COLORS[Math.floor(COLORS.length * Math.random())],
        });

        const start = new THREE.Vector3();
        start.x = CUBE * Math.floor(ROWS * Math.random());
        start.y = CUBE * Math.floor(ROWS * Math.random());
        start.z = CUBE * Math.floor(ROWS * Math.random());

        for (let i = 0; i < LENGTH; i++) {
            const cube = new THREE.Mesh(geometry, material);
            this.add(cube);
            cube.position.copy(start);
            cube.userData.index = i;
            cube.userData.previous = this.children[i - 1];
            cube.castShadow = true;
            cube.receiveShadow = true;
        }

        this.head = this.children[0];
        this.tail = this.children[1];

        this.simplex = new SimplexNoise();

        const ticks = 30 * 60;
        for (let i = 0; i < ticks; i++) {
            this.move((1 / ticks) * i);
        }
    }

    move(time: number) {
        this.head.scale.setScalar(this.head.scale.x + this.speed);
        this.tail.scale.setScalar(1 - this.head.scale.x);

        if (this.head.scale.x >= 0.95) {
            this.step(time);
        }
    }

    step(time: number) {
        for (let i = this.tail.userData.index; i > 0; i--) {
            const cube = this.children[i];
            cube.position.copy(cube.userData.previous.position);
        }

        this.tail.scale.setScalar(0.95);
        this.head.scale.setScalar(this.speed);

        if (this.tail.userData.index < this.children.length - 1) {
            this.tail = this.children[this.tail.userData.index + 1];
        }

        const noise = this.simplex.noise2D(NOISE * time, 0);
        switch (Math.round((noise + 1) * 3)) {
            case 0:
            case 1:
                this.head.position.x = (this.head.position.x - CUBE + WIDTH) % WIDTH;
                break;
            case 2:
                this.head.position.x = (this.head.position.x + CUBE) % WIDTH;
                break;
            case 3:
                this.head.position.y = (this.head.position.y - CUBE + WIDTH) % WIDTH;
                break;
            case 4:
                this.head.position.y = (this.head.position.y + CUBE) % WIDTH;
                break;
            case 5:
                this.head.position.z = (this.head.position.z - CUBE + WIDTH) % WIDTH;
                break;
            case 6:
                this.head.position.z = (this.head.position.z + CUBE) % WIDTH;
                break;
        }
    }
}