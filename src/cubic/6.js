import SimplexNoise from 'simplex-noise';
import * as THREE from 'three';
import * as Recorder from '../recorder';

const PI2 = Math.PI * 2;
const SIZE = 1200;
const CUBE = 13;
const ROWS = 50;
const COUNT = 200;
const LENGTH = 100;
const NOISE = 30;
const WIDTH = CUBE * ROWS;
const COLORS = [
    '#111',
    '#555',
    '#aaa',
    '#eee',
];

const scene = new THREE.Scene();
scene.position.y = 80;

const camera = new THREE.PerspectiveCamera(75, 1, 1, 3000);
camera.position.z = 1000;

const renderer = new THREE.WebGLRenderer({
    antialias: true,
});
document.body.appendChild(renderer.domElement);
renderer.setSize(SIZE, SIZE);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;

const spotLight = new THREE.SpotLight('#fff', 1, 1000, 2, 1);
spotLight.position.set(WIDTH / 4, WIDTH / 4, WIDTH);
spotLight.castShadow = true;
spotLight.shadow.camera.near = 10;
spotLight.shadow.bias = -0.002;
scene.add(spotLight);

const directionalLight = new THREE.DirectionalLight('#fff', 1);
directionalLight.position.copy(spotLight.position);
directionalLight.castShadow = true;
scene.add(directionalLight);

const container = new THREE.Object3D();
scene.add(container);

const geometry = new THREE.PlaneGeometry(WIDTH * 10, WIDTH * 2);
const material = new THREE.MeshPhongMaterial({
    color: '#dfdfdf',
});

const bgBack = new THREE.Mesh(geometry, material);
container.add(bgBack);
bgBack.position.y = WIDTH / 2 - CUBE;
bgBack.position.z = -WIDTH / 2 - CUBE / 2;
bgBack.castShadow = true;
bgBack.receiveShadow = true;

const bgBottom = bgBack.clone();
container.add(bgBottom);
bgBottom.position.y = -WIDTH / 2 - CUBE /2;
bgBottom.position.z = WIDTH / 2;
bgBottom.rotation.x = -Math.PI / 2;

class Shape extends THREE.Object3D {

    constructor() {
        super();

        this.speed = 0.05 * Math.round(Math.random() * 2) + 0.05;

        this.position.x = -(WIDTH) / 2;
        this.position.y = -(WIDTH) / 2;
        this.position.z = -(WIDTH) / 2;

        const geometry = new THREE.BoxGeometry(CUBE, CUBE, CUBE);
        const material = new THREE.MeshPhongMaterial({
            color: COLORS[Math.floor(COLORS.length * Math.random())],
        });

        const start = new THREE.Vector3();
        start.x = CUBE * Math.floor(ROWS * Math.random());
        start.y = CUBE * Math.floor(ROWS * Math.random());
        start.z = CUBE * Math.floor(ROWS * Math.random());

        for (let i = 0; i < LENGTH; i++) {
            const cube = new THREE.Mesh(geometry, material);
            this.add(cube);
            cube.position.copy(start);
            cube.userData.index = i;
            cube.userData.previous = this.children[i - 1];
            cube.castShadow = true;
            cube.receiveShadow = true;
        }

        this.head = this.children[0];
        this.tail = this.children[1];

        this.simplex = new SimplexNoise();

        const ticks = 30 * 60;
        for (let i = 0; i < ticks; i++) {
            this.move((1 / ticks) * i);
        }
    }

    move(tick) {
        this.head.scale.setScalar(this.head.scale.x + this.speed);
        this.tail.scale.setScalar(1 - this.head.scale.x);

        if (this.head.scale.x >= 0.95) {
            this.step(tick);
        }
    }

    step(tick) {
        for (let i = this.tail.userData.index; i > 0; i--) {
            const cube = this.children[i];
            cube.position.copy(cube.userData.previous.position);
        }

        this.tail.scale.setScalar(0.95);
        this.head.scale.setScalar(this.speed);

        if (this.tail.userData.index < this.children.length - 1) {
            this.tail = this.children[this.tail.userData.index + 1];
        }

        const noise = this.simplex.noise2D(NOISE * tick, 0);
        switch (Math.round((noise + 1) * 3)) {
            case 0:
            case 1:
                this.head.position.x = (this.head.position.x - CUBE + WIDTH) % WIDTH;
                break;
            case 2:
                this.head.position.x = (this.head.position.x + CUBE) % WIDTH;
                break;
            case 3:
                this.head.position.y = (this.head.position.y - CUBE + WIDTH) % WIDTH;
                break;
            case 4:
                this.head.position.y = (this.head.position.y + CUBE) % WIDTH;
                break;
            case 5:
                this.head.position.z = (this.head.position.z - CUBE + WIDTH) % WIDTH;
                break;
            case 6:
                this.head.position.z = (this.head.position.z + CUBE) % WIDTH;
                break;
        }
    }
}

const shapes = [];
for (let i = 0; i < COUNT; i++) {
    const shape = new Shape();
    shapes.push(shape);
    container.add(shape);
}

Recorder.setup({
    duration: 30,
    target: renderer.domElement,
    render: (tick) => {
        container.rotation.x = 0.1 * Math.sin(PI2 * 2 * tick) + 0.5;
        container.rotation.y = 0.2 * Math.sin(PI2 * tick) + 0.4;

        for (let i = 0; i < shapes.length; i++) {
            shapes[i].move(tick);
        }

        renderer.render(scene, camera);
    },
});
