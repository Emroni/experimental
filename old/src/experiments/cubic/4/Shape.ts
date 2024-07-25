import { PI2, PI_HALF } from '@/constants';
import * as THREE from 'three';

export const CUBE_ROWS = 20;
export const CUBE_SIZE = 60;

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

export default class Shape extends THREE.Mesh {

    cube: THREE.Mesh;
    positionOffset: number;
    positionSpeed: number;
    rotationSpeedX: number;
    rotationSpeedY: number;

    constructor(x: number, y: number, flipped: boolean) {
        super();

        this.position.x = CUBE_SIZE * (x - (CUBE_ROWS / 2 - 0.5));
        this.position.y = -CUBE_SIZE * (y - (CUBE_ROWS / 2 - 0.5));

        this.positionOffset = 50 * Math.random() + 50;
        this.positionSpeed = (-1 + Math.round(Math.random()) * 2) * Math.round(Math.random() + 1);
        this.rotationSpeedX = (-1 + Math.round(Math.random()) * 2) * Math.round(Math.random() * 3 + 1);
        this.rotationSpeedY = (-1 + Math.round(Math.random()) * 2) * Math.round(Math.random() * 2 + 1);

        this.cube = mesh.clone();
        this.add(this.cube);

        if (flipped) {
            this.cube.rotation.y = PI_HALF;
        }
    }

    move(time: number) {
        this.position.z = Math.sin(PI2 * this.positionSpeed * time) * this.positionOffset;
        this.rotation.x = PI2 * this.rotationSpeedX * time;
        this.rotation.y = PI2 * this.rotationSpeedY * time;
    }
}