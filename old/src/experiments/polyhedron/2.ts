import * as THREE from 'three';
import * as Base from './base';

const shape = new THREE.DodecahedronGeometry(200);
export default Base.run(shape, 1, 30);