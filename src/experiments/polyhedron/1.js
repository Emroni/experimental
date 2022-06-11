import * as THREE from 'three';
import * as Base from './base';

const shape = new THREE.TetrahedronGeometry(200);
Base.run(shape, 10, 20);