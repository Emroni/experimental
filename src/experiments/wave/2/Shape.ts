import { PI2 } from '@/constants';
import { Linear, TimelineLite } from 'gsap';
import SimplexNoise from 'simplex-noise';
import * as THREE from 'three';
import { SHAPES } from '.';

const PI_HALF = Math.PI / 2;
const COLORS = [
    '#f44336',
    '#e91e63',
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
    '#009688',
    '#4caf50',
    '#8bc34a',
];

const geometry = new THREE.BoxGeometry(30, 30, 30);

const simplex = new SimplexNoise();


export default class Shape extends THREE.Object3D {

    index: number;
    offset: number;
    amplitude: number;
    speed: number;
    colorOffset: number;
    rotationOffset: number;
    material: THREE.MeshPhongMaterial;
    mesh: THREE.Mesh;
    color: string;
    timeline: TimelineLite;

    constructor(index) {
        super();

        this.index = index;
        this.offset = index / SHAPES;
        this.amplitude = 200 * Math.pow(this.offset, 2) + 50;
        this.speed = Math.round(Math.random() * 2) + 1;

        this.scale.setScalar(0.2 * Math.random() + 0.8);

        const radius = 1000 * (1 - this.offset);
        const theta = PI2 * Math.random();
        this.position.x = radius * Math.sin(theta);
        this.position.y = radius * Math.cos(theta);

        this.rotation.order = 'ZXY';
        this.rotationOffset = PI2 * Math.random();
        this.rotation.z = Math.atan2(this.position.y, this.position.x) + PI_HALF;

        this.material = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
        });

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.add(this.mesh);

        this.mesh.scale.setScalar(0.5 * Math.random() + 0.5);
        this.mesh.position.y = 10 * Math.random() + 10;
        this.mesh.rotation.y = PI2 * Math.random();

        this.color = COLORS[COLORS.length - 1];
        this.colorOffset = this.offset * COLORS.length;
        this.timeline = new TimelineLite();
        COLORS.forEach(c => {
            this.timeline.to(this, 1, {
                ease: Linear.easeInOut,
                color: c,
            });
        });
    }

    move(tick) {
        this.timeline.seek((COLORS.length * 10 * tick + this.colorOffset) % COLORS.length);
        this.material.color.set(this.color);

        const noiseAlpha = PI2 * (this.offset + tick);
        const noiseX = Math.cos(noiseAlpha);
        const noiseY = Math.sin(noiseAlpha);
        const noise = simplex.noise3D(noiseX, noiseY, this.offset);

        this.scale.setScalar(0.5 * Math.abs(noise) + 0.5);
        this.position.z = this.amplitude * noise;
        this.rotation.x = PI2 * (this.speed * tick) + this.rotationOffset;
    }

}