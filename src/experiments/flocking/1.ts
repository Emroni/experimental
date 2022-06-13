import SimplexNoise from 'simplex-noise';
import * as THREE from 'three';

export const PI2 = Math.PI * 2;
export const SIZE = 640;
export const RADIUS = 200;
export const SPREAD = 30;
export const SHAPE_SIZE = 10;
export const ROWS = 300;
export const ROW_SHAPES = 1;
export const LENGTH = 0.1;

const scene = new THREE.Scene();
scene.rotation.x = Math.PI / 2;

const camera = new THREE.PerspectiveCamera(75, 1, 1, 2000);
camera.position.z = SIZE / (Math.tan(camera.fov * (Math.PI / 180) / 2) * 2);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(SIZE, SIZE);

const light1 = new THREE.PointLight('#e91e63', 2, RADIUS * 5, 1);
scene.add(light1);
light1.position.set(RADIUS, RADIUS, RADIUS);

const light2 = new THREE.PointLight('#009688', 2, RADIUS * 5, 1);
scene.add(light2);
light2.position.set(-RADIUS, -RADIUS, -RADIUS);

const geometry = new THREE.ConeGeometry(SHAPE_SIZE / 2, SHAPE_SIZE, 3, 1);

const material = new THREE.MeshPhongMaterial({
    color: '#fff',
});

const shape = new THREE.Mesh(geometry, material);

const simplex = new SimplexNoise();

const shapes = [];

class Shape extends THREE.Object3D {

    index: number;
    multiplier: THREE.Vector2;
    meshes: THREE.Mesh[];
    
    constructor(row) {
        super();

        this.index = row * LENGTH;

        this.multiplier = new THREE.Vector2(2, 3 + Math.random());

        scene.add(this);
        shapes.push(this);

        this.meshes = [];
        for (let j = 0; j < ROW_SHAPES; j++) {
            const mesh = shape.clone();
            this.add(mesh);
            this.meshes.push(mesh);
        }
    }

    move(tick) {
        const t = PI2 * ((this.index + tick) % 1);
        const tX = this.multiplier.x * t;
        const tY = this.multiplier.y * t;
        this.position.x = Math.sin(tX) * Math.cos(tY) * RADIUS;
        this.position.y = Math.sin(tX) * Math.sin(tY) * RADIUS;
        this.position.z = Math.cos(tX) * RADIUS;
        this.lookAt(scene.position);

        const n = PI2 * (this.index + tick);
        const noiseX = Math.cos(n);
        const noiseY = Math.sin(n);
        const distance = SPREAD * simplex.noise3D(noiseX, noiseY, this.index);
        for (let i = 0; i < this.meshes.length; i++) {
            const mesh = this.meshes[i];
            const a = PI2 * 3 * (i / this.meshes.length);
            mesh.position.y = distance * Math.sin(a);
            mesh.position.z = distance * Math.cos(a);
        }
    }

}

for (let i = 0; i < ROWS; i++) {
    new Shape(i / ROWS);
}

export default {
    duration: 10,
    element: renderer.domElement,
    onTick: (tick) => {

        // scene.rotation.y = 0.1 * Math.sin(PI2 * tick);

        for (let i = 0; i < shapes.length; i++) {
            shapes[i].move(tick);
        }

        renderer.render(scene, camera);
    },
}
