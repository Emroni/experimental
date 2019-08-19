import * as THREE from 'three';
import { Shape, COLORS, PI2 } from './base';

for (let i = 0; i < COLORS.length; i++) {
    let size = i % 2 ? 20 : 30;
    let count = i % 2 ? 50 : 20;
    let color = COLORS[i];
    let geometry = new THREE.BoxGeometry(size, size, size);
    new Shape(color, geometry, count, (tick, shape, meshes) => {
        shape.rotation.z = PI2 * tick * (i % 2 ? 0.5 : 1);

        for (let j = 0; j < meshes.length; j++) {
            const mesh = meshes[j];
            mesh.rotation.x = PI2 * tick * 2;
        }
    });

    size = i % 2 ? 10 : 15;
    count = i % 2 ? 80 : 50;
    color = COLORS[Math.floor(i + COLORS.length / 3) % COLORS.length];
    geometry = new THREE.TetrahedronGeometry(size);
    new Shape(color, geometry, count, (tick, shape, meshes) => {
        shape.rotation.z = PI2 * tick * (i % 2 ? 2 : 1);

        for (let j = 0; j < meshes.length; j++) {
            const mesh = meshes[j];
            mesh.rotation.y = PI2 * tick * 2;
        }
    });

    size = i % 2 ? 30 : 15;
    count = i % 2 ? 30 : 40;
    color = COLORS[Math.floor(i + COLORS.length * (2 / 3)) % COLORS.length];
    geometry = new THREE.DodecahedronGeometry(size);
    new Shape(color, geometry, count, (tick, shape, meshes) => {
        shape.rotation.z = PI2 * tick * (i % 3 ? 1 : 0.5);

        for (let j = 0; j < meshes.length; j++) {
            const mesh = meshes[j];
            mesh.rotation.z = PI2 * tick * 2;
        }
    });
}