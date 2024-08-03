interface PolyhedronBaseProps {
    layers: number;
    spread: number;
    shape: THREE.PolyhedronGeometry;
}

interface PolyhedronBaseLine {
    from: {
        x: any;
        y: any;
        z: any;
    };
    to: {
        x: any;
        y: any;
        z: any;
    };
}

interface PolyhedronBaseParticle {
    group: number;
    index: number;
    layer: number;
    line: PolyhedronBaseLine;
    point: THREE.Vector3;
    position: THREE.Vector3;
}