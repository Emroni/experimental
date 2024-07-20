import { PI2 } from '@/constants';
import * as THREE from 'three';

export default class Path {

    fadeOut: number;
    fromPosition: THREE.Vector3;
    mesh: THREE.InstancedMesh;
    particles: THREE.Object3D[];
    path: THREE.Vector3;

    constructor(container, fromPosition: THREE.Vector3, toPosition: THREE.Vector3, fromRadius: number, toRadius: number, countMultiplier: number, color: string, fadeOut = 0) {
        this.fromPosition = fromPosition;
        this.fadeOut = fadeOut;
        this.path = toPosition.clone()
            .sub(fromPosition);

        const meshGeometry = new THREE.TetrahedronGeometry(10, 1);
        const meshMaterial = new THREE.MeshPhysicalMaterial({
            color,
            flatShading: true,
            metalness: 1,
        });

        this.mesh = new THREE.InstancedMesh(meshGeometry, meshMaterial, countMultiplier * 500);
        container.add(this.mesh);

        this.particles = [];
        for (let i = 0; i < this.mesh.count; i++) {
            const particle = new THREE.Object3D();
            this.particles.push(particle);

            particle.userData.offset = Math.random();
            particle.userData.rotation = new THREE.Vector3(PI2 * Math.random(), PI2 * Math.random(), PI2 * Math.random());

            const n = 2 * Math.random() - 1;
            particle.userData.fromRadius = fromRadius * n;
            particle.userData.pathRadius = (toRadius - fromRadius) * n;

            particle.updateMatrix();
            this.mesh.setMatrixAt(i, particle.matrix);
        }
    }

    move(tick) {
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            const t = (tick + particle.userData.offset) % 1;

            particle.position.x = this.path.x * t + this.fromPosition.x;
            particle.position.y = this.path.y * t + this.fromPosition.y + particle.userData.pathRadius * t + particle.userData.fromRadius;
            particle.position.z = this.path.z * t + this.fromPosition.z;

            particle.rotation.x = PI2 * t + particle.userData.rotation.x;
            particle.rotation.y = PI2 * t + particle.userData.rotation.y;
            particle.rotation.z = PI2 * t + particle.userData.rotation.z;

            if (this.fadeOut) {
                particle.scale.setScalar(Math.max(0.00001, Math.pow(1 - t, this.fadeOut)));
            }

            particle.updateMatrix();
            this.mesh.setMatrixAt(i, particle.matrix);
        }

        this.mesh.instanceMatrix.needsUpdate = true;
    }
}