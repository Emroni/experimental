import * as THREE from 'three';
import { PI2 } from '@/constants';

export const OUTER_RADIUS = 200;
export const INNER_RADIUS = 80;
export const SHAPE_SIZE = 10;

const material = new THREE.MeshPhongMaterial({
    color: '#fff',
});

const meshes = [
    new THREE.Mesh(new THREE.TetrahedronGeometry(SHAPE_SIZE), material),
    new THREE.Mesh(new THREE.IcosahedronBufferGeometry(SHAPE_SIZE), material),
    new THREE.Mesh(new THREE.DodecahedronGeometry(SHAPE_SIZE), material),
];

export default class Shape extends THREE.Object3D {

    index: number;
    innerPosition: THREE.Vector3;
    mesh: THREE.Mesh;
    outerPosition: THREE.Vector3;
    rotationMultiplier: THREE.Vector3;
    scaleMultiplier: number;
    scaleOffset: number;
    tickOffset: number;

    constructor(scene, shapes, index) {
        super();

        scene.add(this);
        shapes.push(this);

        this.index = index;

        this.tickOffset = Math.random();

        const a = PI2 * this.index;
        this.innerPosition = new THREE.Vector3();
        this.innerPosition.x = INNER_RADIUS * 0.5 * Math.sin(a);
        this.innerPosition.y = INNER_RADIUS * Math.cos(a);
        this.outerPosition = new THREE.Vector3();
        this.outerPosition.x = OUTER_RADIUS * (Math.random() + 0.5) * Math.sin(a) - this.innerPosition.x;
        this.outerPosition.y = OUTER_RADIUS * (0.2 * Math.random() + 0.8) * Math.cos(a) - this.innerPosition.y;
        this.rotationMultiplier = new THREE.Vector3(2 * Math.random(), 2 * Math.random(), 2 * Math.random());
        this.scaleOffset = 0.5 * Math.random();
        this.scaleMultiplier = 0.8 * Math.random() + 0.2;

        this.mesh = meshes[Math.floor(meshes.length * Math.random())].clone();
        this.add(this.mesh);
    }

    move(tick) {
        const a = PI2 * 3 * (tick + this.tickOffset);
        const n = (Math.sin(a) + 1) / 2;
        const o = Math.sin(PI2 * tick * 2) + 1;
        this.mesh.position.x = this.outerPosition.x * n + this.innerPosition.x * (0.2 * o + 0.5);
        this.mesh.position.y = this.outerPosition.y * n + this.innerPosition.y * (0.1 * o + 0.9);
        this.mesh.rotation.x = this.rotationMultiplier.x * a;
        this.mesh.rotation.y = this.rotationMultiplier.y * a;
        this.mesh.rotation.z = this.rotationMultiplier.z * a;
        this.mesh.scale.x = this.mesh.scale.y = this.mesh.scale.z = Math.max(0.001, Math.cos(a + this.scaleOffset)) * this.scaleMultiplier * Math.min(1, o / 3 + 0.7);
    }

}