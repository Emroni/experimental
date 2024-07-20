import { PI2 } from '@/constants';
import SimplexNoise from 'simplex-noise';
import * as THREE from 'three';
import { RADIUS } from '.';

const LENGTH = 0.05;
const SPREAD = 50;
const SHAPE_SIZE = 15;
const ROW_SHAPES = 20;

const geometry = new THREE.ConeGeometry(SHAPE_SIZE / 2, SHAPE_SIZE, 3, 1);

const material = new THREE.MeshPhongMaterial({
    color: '#fff',
});

const shape = new THREE.Mesh(geometry, material);

const simplex = new SimplexNoise();

export default class Shape extends THREE.Object3D {

    index: number;
    multiplier: THREE.Vector2;
    meshes: THREE.Mesh[];

    constructor(scene, shapes, row: number) {
        super();

        this.index = row * LENGTH;

        this.multiplier = new THREE.Vector2(4, 0.5 * Math.random() + 6);

        scene.add(this);
        shapes.push(this);

        this.meshes = [];
        for (let j = 0; j < ROW_SHAPES; j++) {
            const mesh = shape.clone();
            this.add(mesh);
            this.meshes.push(mesh);
            mesh.userData.position = new THREE.Vector3(Math.random(), Math.random(), Math.random());
        }
    }

    move(tick) {
        const t = PI2 * ((tick + this.index) % 1);
        const tX = this.multiplier.x * t;
        const tY = this.multiplier.y * t;
        this.position.x = Math.sin(tX) * Math.cos(tY) * RADIUS;
        this.position.y = Math.sin(tX) * Math.sin(tY) * RADIUS;
        this.position.z = Math.cos(tX) * RADIUS;

        const n = PI2 * ((2 * tick + this.index) % 1);
        const noiseX = Math.sin(n);
        const noiseY = Math.cos(n);
        const distance = SPREAD * (simplex.noise3D(noiseX, noiseY, this.index) + 0.5);

        for (let i = 0; i < this.meshes.length; i++) {
            const mesh = this.meshes[i];
            mesh.position.x = distance * mesh.userData.position.x;
            mesh.position.y = distance * mesh.userData.position.y;
            mesh.position.z = distance * mesh.userData.position.z;
            mesh.rotation.x = PI2 * noiseX;
            mesh.rotation.y = PI2 * noiseY;
        }
    }

}