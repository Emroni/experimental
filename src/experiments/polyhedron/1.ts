import * as THREE from 'three';
import * as Base from './base';

const shape = new THREE.TetrahedronGeometry(200);
export default Base.run(shape, 10, 20);