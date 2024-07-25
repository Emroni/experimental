import { PI, PI2 } from '@/constants';
import * as THREE from 'three';
import Base, { COLORS, Shape } from './base';

for (let i=0; i<COLORS.length; i++) {
    const count = 30;

    const boxSize = i % 2 ? 20 : 30;
    const boxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    for (let j=0; j<count; j++) {
        let color = COLORS[j % COLORS.length];
        new Shape(color, boxGeometry, 1, (tick, shape) => {
            shape.rotation.x = PI2 * (tick + j / count) + PI;
            shape.rotation.z = PI2 * (tick + j / count);
        });
    }

    const tetrahedronSize = i % 2 ? 20 : 30;
    const tetrahedronGeometry = new THREE.TetrahedronGeometry(tetrahedronSize);
    for (let j=0; j<count; j++) {
        let color = COLORS[j % COLORS.length];
        new Shape(color, tetrahedronGeometry, 1, (tick, shape) => {
            shape.rotation.x = PI2 * (tick + j / count);
            shape.rotation.z = PI2 * (tick + j / count);
        });
    }
}

export default Base;