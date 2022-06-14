import { PI_HALF } from '@/constants';
import { easeInOutCubic } from '@/helpers';
import * as THREE from 'three';

// TODO: Fix materials

export const PARTICLE_ROWS = 30;
export const PARTICLE_SIZE = 30;

const geometry = new THREE.DodecahedronGeometry(PARTICLE_SIZE);
for (let i = 0; i < geometry.attributes.position.array.length; i += 3) {
    geometry.addGroup(i, 3, Math.floor(i / 3 / 6));
}

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

export default class Particle extends THREE.Object3D {

    delay: number;
    cube: THREE.Mesh;

    constructor(x: number, y: number, z: number) {
        super();

        this.delay = (x * y * z) / (PARTICLE_ROWS * PARTICLE_ROWS * PARTICLE_ROWS) + 0.1 * Math.random();

        this.cube = mesh.clone();
        this.add(this.cube);
        this.cube.position.x = PARTICLE_SIZE * (x - (PARTICLE_ROWS / 2 - 0.5));
        this.cube.position.y = PARTICLE_SIZE * (y - (PARTICLE_ROWS / 2 - 0.5));
        this.cube.position.z = PARTICLE_SIZE * (z - (PARTICLE_ROWS / 2 - 0.5));
    }

    move(time: number) {
        const t = time * 12 - this.delay;
        this.rotation.x = PI_HALF * (easeInOutCubic(t) + easeInOutCubic(t - 6));
        this.rotation.z = PI_HALF * (easeInOutCubic(t - 2) + easeInOutCubic(t - 8));
        this.rotation.y = -PI_HALF * (easeInOutCubic(t - 4) + easeInOutCubic(t - 10));

        this.cube.rotation.copy(this.rotation);
    }
}