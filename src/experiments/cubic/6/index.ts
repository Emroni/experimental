import { PI2 } from '@/constants';
import * as THREE from 'three';
import Shape, { CUBE, ROWS } from './Shape';

const SIZE = 1200;
const COUNT = 200;
const WIDTH = CUBE * ROWS;

const scene = new THREE.Scene();
scene.position.y = 80;

const camera = new THREE.PerspectiveCamera(75, 1, 1, 3000);
camera.position.z = 1000;

const renderer = new THREE.WebGLRenderer({
    antialias: true,
});
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

const shapes: Shape[] = [];
for (let i = 0; i < COUNT; i++) {
    const shape = new Shape();
    shapes.push(shape);
    container.add(shape);
}

export default {
    duration: 30,
    element: renderer.domElement,
    size: SIZE,
    onTick: (time: number) => {
        container.rotation.x = 0.1 * Math.sin(PI2 * 2 * time) + 0.5;
        container.rotation.y = 0.2 * Math.sin(PI2 * time) + 0.4;

        shapes.forEach(shape => shape.move(time));
        renderer.render(scene, camera);
    }
}