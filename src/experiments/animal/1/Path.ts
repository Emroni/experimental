import { PI, PI2 } from '@/constants';
import * as THREE from 'three';

export default class Path {

    mesh: THREE.InstancedMesh;
    options: {
        color: string;
        count: number;
        geometry: THREE.CylinderGeometry;
        geometryMatrix: THREE.Matrix4;
        offset: number;
        rotation: number;
    };
    segments: THREE.Object3D[];
    target: THREE.Vector3;

    constructor(container, bumpMap, options) {
        this.options = {
            count: 100,
            rotation: 0,
            offset: 0, 
            ...options,
        };

        this.target = new THREE.Vector3();

        if (this.options.geometryMatrix) {
            this.options.geometry.applyMatrix4(this.options.geometryMatrix);
        }

        const material = new THREE.MeshPhysicalMaterial({
            bumpMap,
            color: this.options.color,
            flatShading: true,
            metalness: 0.5,
            reflectivity: 0.2,
            roughness: 0.5,
        });

        this.mesh = new THREE.InstancedMesh(this.options.geometry, material, this.options.count);
        container.add(this.mesh);

        this.segments = [];
        for (let i = 0; i < this.mesh.count; i++) {
            const segment = new THREE.Object3D();
            const n = (i + this.options.offset) / this.mesh.count;
            segment.scale.setScalar(0.5 * Math.pow(n, 3) + Math.min(0.5, 5 * n));
            this.segments.push(segment);
        }
    }

    step(index, tick, vector) {
        const n = (index + this.options.offset) / this.segments.length;
        const radius = 50 * Math.sin(PI2 * 3 * tick) + 300 * Math.pow(n, 4) + 300;
        const t = PI * (tick + n);
        const tX = 8 * t;
        const tY = 6 * t;

        vector.x = Math.sin(tX) * Math.cos(tY) * radius;
        vector.y = Math.sin(tX) * Math.sin(tY) * radius;
        vector.z = Math.cos(tX) * radius;
    }

    move(tick) {
        for (let i = 0; i < this.segments.length; i++) {
            const segment = this.segments[i];
            this.step(i, tick, segment.position);

            this.step(i, tick + 0.0001, this.target);
            segment.lookAt(this.target);

            segment.rotation.z += this.options.rotation * Math.sin(PI2 * 5 * tick);

            segment.updateMatrix();
            this.mesh.setMatrixAt(i, segment.matrix);
        }

        this.mesh.instanceMatrix.needsUpdate = true;
    }
}
