'use client';
import * as THREE from 'three';
import PolyhedronBase from '../PolyhedronBase';

export default function Polyhedron2() {

    const shape = new THREE.DodecahedronGeometry(200);

    return <PolyhedronBase
        layers={1}
        spread={30}
        shape={shape}
    />;

}