import { PI, PI2 } from '@/constants';
import SimplexNoise from 'simplex-noise';
import * as THREE from 'three';
import { grids } from '.';

const ROWS = 50;
const SPACING = 50;
const CELL = 40;

export default class Grid extends THREE.Object3D {

    index: number;
    simplex: SimplexNoise;
    material: THREE.MeshPhongMaterial;
    mesh: THREE.InstancedMesh;
    shapes: THREE.Object3D[];

    constructor(container, index, segments) {
        super();

        this.index = index;

        container.add(this);

        this.simplex = new SimplexNoise();

        const geometry = new THREE.RingGeometry(CELL / 2, CELL / 1.5, segments);

        this.material = new THREE.MeshPhongMaterial();

        this.mesh = new THREE.InstancedMesh(geometry, this.material, ROWS * ROWS);
        this.add(this.mesh);

        this.shapes = [];
        for (let x = 0; x < ROWS; x++) {
            for (let y = 0; y < ROWS; y++) {
                const shape = new THREE.Object3D();
                this.shapes.push(shape);

                shape.userData.x = x;
                shape.userData.y = y;
                shape.userData.noise = 0;

                shape.position.x = SPACING * (x - ROWS / 2 + 0.5);
                shape.position.y = SPACING * (y - ROWS / 2 + 0.5);
            }
        }
    }


    move(tick) {
        const offset = ((this.index / grids.length) + tick) % 1;
        const t = PI2 * offset;
        const noise = 0.02 * Math.sin(t) + 0.04;
        const amplitude = 30 * Math.cos(t) + 70;

        this.rotation.x = 0.1 * Math.sin(t);
        this.rotation.y = 0.1 * Math.cos(t);

        this.material.color.setHSL(offset, 1, 0.5);

        for (let i = 0; i < this.shapes.length; i++) {
            const shape = this.shapes[i];

            const noiseAlpha = PI2 * (shape.userData.x + offset);
            const noiseX = Math.sin(noiseAlpha) + noise * shape.userData.x;
            const noiseY = Math.cos(noiseAlpha) + noise * shape.userData.y;

            shape.position.z = amplitude * this.simplex.noise3D(noiseX, noiseY, 0);
            shape.rotation.x = PI * this.simplex.noise3D(noiseX, noiseY, 1);
            shape.rotation.y = PI * this.simplex.noise3D(noiseX, noiseY, 2);
            shape.rotation.z = PI * this.simplex.noise3D(noiseX, noiseY, 3);
            shape.scale.setScalar(0.3 * Math.abs(this.simplex.noise3D(noiseX, noiseY, 4)) + 0.7);

            shape.updateMatrix();
            this.mesh.setMatrixAt(i, shape.matrix);
        }

        this.mesh.instanceMatrix.needsUpdate = true;
    }
}