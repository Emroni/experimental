import SimplexNoise from 'simplex-noise';
import * as THREE from 'three';

export const PI2 = Math.PI * 2;
export const SIZE = 640;
export const SHAPE_SIZE = 30;
export const SHAPE_ROW = 50;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 1, 1, 1000);
camera.position.z = SIZE / (Math.tan(camera.fov * (Math.PI / 180) / 2) * 2);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(SIZE, SIZE);

const light = new THREE.PointLight('#aaaaaa', 10, 1000, 4);
scene.add(light);
light.position.z = camera.position.z;

const container = new THREE.Object3D();
scene.add(container);
container.position.z = 100;
container.rotation.x = -Math.PI / 6;
container.rotation.z = Math.PI / 4;

const geometry = new THREE.ConeGeometry(SHAPE_SIZE / 2, SHAPE_SIZE, 3, 1);

const mesh1 = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
    color: '#e91e63',
}));
const mesh2 = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
    color: '#009688',
}));

const shapes = [];
class Shape extends THREE.Object3D {
    
    index: {
        x: number;
        y: number;
    };
    mesh: THREE.Mesh;
    mirror: boolean;
    x: number;
    y: number;

    constructor(x, y, mirror) {
        super();

        this.x = x;
        this.y = y;
        this.mirror = mirror;

        container.add(this);
        shapes.push(this);

        this.index = {
            x: (this.mirror ? y : x) / SHAPE_ROW,
            y: (this.mirror ? x : y) / SHAPE_ROW,
        };

        this.position.x = SHAPE_SIZE * (x - (SHAPE_ROW / 2 - 0.5));
        this.position.y = SHAPE_SIZE * (y - (SHAPE_ROW / 2 - 0.5));

        if (this.mirror) {
            this.position.x += SHAPE_SIZE / 2;
            this.rotation.z = Math.PI;
        }

        this.mesh = (this.mirror ? mesh2 : mesh1).clone();
        this.add(this.mesh);
    }

    move(tick) {
        const noiseAlpha = PI2 * (this.x + tick);
        const noiseX = Math.cos(noiseAlpha);
        const noiseY = Math.sin(noiseAlpha);
        this.rotation.y = Math.PI * simplex.noise3D(noiseX + this.index.x, noiseY, this.index.y);
    }

}

for (let x = 0; x < SHAPE_ROW; x++) {
    for (let y = 0; y < SHAPE_ROW; y++) {
        new Shape(x, y, false);
        new Shape(x, y, true);
    }
}

const simplex = new SimplexNoise();

export default {
    duration: 10,
    element: renderer.domElement,
    size: SIZE,
    onTick: (tick) => {

        scene.rotation.y = 0.1 * Math.sin(PI2 * tick);

        for (let i = 0; i < shapes.length; i++) {
            shapes[i].move(tick);
        }

        renderer.render(scene, camera);
    },
}
