import { PI2, PI_HALF } from '@/constants';
import * as THREE from 'three';
import { SIZE } from '.';
import { lidsGeometry, lidsMaterial } from './LidShape';

// const trianglesGeometry = new THREE.ConeGeometry(2, 10, 10);
// const trianglesMaterial = new THREE.MeshPhongMaterial({
//     color: '#2196f3',
// });

export default class TriangleShape extends THREE.Object3D {
    
    mesh: THREE.Mesh;
    offset: number;
    previousPosition: THREE.Vector3;

    constructor(lids) {
        super();
        lids.add(this);

        this.offset = Math.random();
        this.previousPosition = new THREE.Vector3();

        this.position.set(20 * Math.random() - 10, 20 * Math.random() - 10, 0);
        this.rotation.z = Math.PI * Math.round(Math.random());

        this.mesh = new THREE.Mesh(lidsGeometry, lidsMaterial);
        this.add(this.mesh);
        this.mesh.rotation.order = 'ZXY';
    }

    move(tick) {
        const t = tick + this.offset;
        this.previousPosition.copy(this.mesh.position);

        this.mesh.position.x = 100 * Math.tan(Math.PI * t);
        this.mesh.position.y = 30 * Math.cos(PI2 * t) + 20;
        this.mesh.scale.setScalar(Math.max(0.0001, 1 - Math.abs(this.mesh.position.x * 2) / SIZE));

        this.mesh.rotation.y = t * 10;
        this.mesh.rotation.z = Math.atan2(this.mesh.position.y - this.previousPosition.y, this.mesh.position.x - this.previousPosition.x) - PI_HALF;
    }
}