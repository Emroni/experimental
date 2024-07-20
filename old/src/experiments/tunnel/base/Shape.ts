import { PI2 } from '@/constants';
import * as THREE from 'three';
import { RADIUS, scene, shapes } from '.';


export default class Shape extends THREE.Object3D {

    meshes: THREE.Mesh[];
    onMove: (tick: number, shape: Shape, meshes: THREE.Mesh[]) => void;

    constructor(color, geometry, count, onMove) {
        super();

        this.onMove = onMove;

        const material = new THREE.MeshPhongMaterial({
            color,
        });

        this.meshes = [];
        for (let i = 0; i < count; i++) {
            const mesh = new THREE.Mesh(geometry, material);
            this.add(mesh);
            this.meshes.push(mesh);

            const alpha = PI2 * (i / count);
            mesh.position.x = RADIUS * Math.sin(alpha);
            mesh.position.y = RADIUS * Math.cos(alpha);
        }

        scene.add(this);
        shapes.push(this);
    }

    move(tick) {
        this.onMove(tick, this, this.meshes);
    }
}