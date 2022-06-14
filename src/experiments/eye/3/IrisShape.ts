import { PI2, PI_HALF } from '@/constants';
import * as THREE from 'three';

const irisGeometry = new THREE.DodecahedronGeometry(10);
const irisMaterial = new THREE.MeshPhongMaterial({
    color: '#3f51b5',
});

export default class IrisShape extends THREE.Mesh {

    angle: THREE.Vector2;
    index: number;
    offset: number;
    rotationMultiplier: number;

    constructor(iris, index: number) {
        super(irisGeometry, irisMaterial);
        iris.add(this);

        this.index = index;
        this.offset = Math.random();

        this.rotation.order = 'ZXY';
        this.angle = new THREE.Vector2(Math.sin(PI2 * this.index), Math.cos(PI2 * this.index));
        this.rotation.z = Math.atan2(this.angle.y, this.angle.x);
        this.rotationMultiplier = Math.round(2 * Math.random()) + 0.5;
    }

    move(tick) {
        const t = PI2 * (tick + this.offset);
        const radius = 10 * (Math.sin(t) + 1) + 40;
        this.position.x = radius * this.angle.x;
        this.position.y = radius * this.angle.y;
        this.position.z = 50 * Math.sin(t + PI_HALF);
        this.rotation.y = this.rotationMultiplier * t;
    }
}