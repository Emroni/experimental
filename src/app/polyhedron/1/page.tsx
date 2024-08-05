'use client';
import * as THREE from 'three';
import PolyhedronBase from '../PolyhedronBase';

export default function Polyhedron1() {

    const shape = new THREE.TetrahedronGeometry(200);

    return <PolyhedronBase
        layers={5}
        spread={10}
        shape={shape}
    />;

}