import * as THREE from 'three';
import { Shape, COLORS, PI2 } from './base';

for (let i=0; i<COLORS.length; i++) {
    const count = 30;

    let size = i % 2 ? 20 : 30;
    let geometry = new THREE.BoxGeometry(size, size, size);
    for (let j=0; j<count; j++) {
        let color = COLORS[j % COLORS.length];
        new Shape(color, geometry, 1, (tick, shape) => {
            shape.rotation.x = PI2 * (tick + j / count) + Math.PI;
            shape.rotation.z = PI2 * (tick + j / count);
        });
    }

    size = i % 2 ? 20 : 30;
    geometry = new THREE.TetrahedronGeometry(size);
    for (let j=0; j<count; j++) {
        let color = COLORS[j % COLORS.length];
        new Shape(color, geometry, 1, (tick, shape) => {
            shape.rotation.x = PI2 * (tick + j / count);
            shape.rotation.z = PI2 * (tick + j / count);
        });
    }
}