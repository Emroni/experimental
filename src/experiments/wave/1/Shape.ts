import { PI2 } from '@/constants';
import SimplexNoise from 'simplex-noise';
import * as THREE from 'three';
import { SHAPE_ROW } from '.';

const SHAPE_SIZE = 30;

const geometry = new THREE.ConeGeometry(SHAPE_SIZE / 2, SHAPE_SIZE, 3, 1);

const mesh1 = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
    color: '#e91e63',
}));
const mesh2 = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
    color: '#009688',
}));

const simplex = new SimplexNoise();

export default class Shape extends THREE.Object3D {
    
    index: {
        x: number;
        y: number;
    };
    mesh: THREE.Mesh;
    mirror: boolean;
    x: number;
    y: number;

    constructor(container, shapes, x, y, mirror) {
        super();

        this.x = x;
        this.y = y;
        this.mirror = mirror;

        container.add(this);
        shapes.push(this);

        this.index = {
            x: (this.mirror ? y : x) / SHAPE_ROW,
            y: (this.mirror ? x : y) / SHAPE_ROW,
        };

        this.position.x = SHAPE_SIZE * (x - (SHAPE_ROW / 2 - 0.5));
        this.position.y = SHAPE_SIZE * (y - (SHAPE_ROW / 2 - 0.5));

        if (this.mirror) {
            this.position.x += SHAPE_SIZE / 2;
            this.rotation.z = Math.PI;
        }

        this.mesh = (this.mirror ? mesh2 : mesh1).clone();
        this.add(this.mesh);
    }

    move(tick) {
        const noiseAlpha = PI2 * (this.x + tick);
        const noiseX = Math.cos(noiseAlpha);
        const noiseY = Math.sin(noiseAlpha);
        this.rotation.y = Math.PI * simplex.noise3D(noiseX + this.index.x, noiseY, this.index.y);
    }

}