import { easeInOutCubic } from '@/helpers';
import { PI_D2 } from '@/setup';
import * as THREE from 'three';

export const CUBE_ROWS = 20;
export const CUBE_SIZE = 40;

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

export default class Shape extends THREE.Object3D {

    delay: number;
    cube: THREE.Mesh;

    constructor(x: number, y: number, z: number) {
        super();

        this.delay = (x * y * z) / (CUBE_ROWS * CUBE_ROWS * CUBE_ROWS) + 0.1 * Math.random();

        this.cube = mesh.clone();
        this.add(this.cube);
        this.cube.position.x = CUBE_SIZE * (x - (CUBE_ROWS / 2 - 0.5));
        this.cube.position.y = CUBE_SIZE * (y - (CUBE_ROWS / 2 - 0.5));
        this.cube.position.z = CUBE_SIZE * (z - (CUBE_ROWS / 2 - 0.5));
    }

    move(progress: number) {
        const t = progress * 12 - this.delay;
        this.rotation.x = PI_D2 * (easeInOutCubic(t) + easeInOutCubic(t - 6));
        this.rotation.z = PI_D2 * (easeInOutCubic(t - 2) + easeInOutCubic(t - 8));
        this.rotation.y = -PI_D2 * (easeInOutCubic(t - 4) + easeInOutCubic(t - 10));

        this.cube.rotation.copy(this.rotation);
    }
}