import { PI2 } from '@/constants';
import SimplexNoise from 'simplex-noise';
import * as THREE from 'three';
import { RADIUS } from '.';

const SPREAD = 30;
const SHAPE_SIZE = 10;
const ROW_SHAPES = 1;
const LENGTH = 0.1;

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
    scene: THREE.Scene;
    
    constructor(scene, shapes, row) {
        super();

        this.index = row * LENGTH;
        this.scene = scene;

        this.multiplier = new THREE.Vector2(2, 3 + Math.random());

        scene.add(this);
        shapes.push(this);

        this.meshes = [];
        for (let j = 0; j < ROW_SHAPES; j++) {
            const mesh = shape.clone();
            this.add(mesh);
            this.meshes.push(mesh);
        }
    }

    move(tick) {
        const t = PI2 * ((this.index + tick) % 1);
        const tX = this.multiplier.x * t;
        const tY = this.multiplier.y * t;
        this.position.x = Math.sin(tX) * Math.cos(tY) * RADIUS;
        this.position.y = Math.sin(tX) * Math.sin(tY) * RADIUS;
        this.position.z = Math.cos(tX) * RADIUS;
        this.lookAt(this.scene.position);

        const n = PI2 * (this.index + tick);
        const noiseX = Math.cos(n);
        const noiseY = Math.sin(n);
        const distance = SPREAD * simplex.noise3D(noiseX, noiseY, this.index);
        for (let i = 0; i < this.meshes.length; i++) {
            const mesh = this.meshes[i];
            const a = PI2 * 3 * (i / this.meshes.length);
            mesh.position.y = distance * Math.sin(a);
            mesh.position.z = distance * Math.cos(a);
        }
    }

}