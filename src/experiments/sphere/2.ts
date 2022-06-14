import { PI, PI2, PI_HALF } from '@/constants';
import * as THREE from 'three';

const FRAME = 640;
const FACES = 200;
const RADIUS = 180;
const SIZE = 35;
const COLOR = 0xFFFFFF;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.z = 400;
camera.updateProjectionMatrix();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(FRAME, FRAME);

const ambient = new THREE.AmbientLight(COLOR, 0.1);
scene.add(ambient);

const light = new THREE.PointLight(COLOR, 1, 1000);
scene.add(light);
light.position.z = 400;

const container = new THREE.Object3D();
scene.add(container);

const geometry = new THREE.CylinderGeometry(SIZE, SIZE, 2, 8);
const material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
});
const mesh = new THREE.Mesh(geometry, material);

const f = (2 / FACES);
const faces = [];
for (let i = 0; i < FACES; i++) {
    const face = new THREE.Object3D();
    container.add(face);
    faces.push(face);

    face.userData.plane = mesh.clone();
    face.add(face.userData.plane);

    const n = (i * f) - 1 + (f / 2);
    const radius = Math.sqrt(1 - (n * n)) * RADIUS;
    const alpha = (i % FACES) * PI * (3 - Math.sqrt(5));

    face.position.x = Math.cos(alpha) * radius;
    face.position.y = -n * RADIUS;
    face.position.z = Math.sin(alpha) * radius;
    face.lookAt(0, 0, 0);
}

export default {
    duration: 10,
    element: renderer.domElement,
    size: SIZE,
    onTick: (tick) => {
        container.rotation.y = PI2 * tick;

        for (let i = 0; i < faces.length; i++) {
            const face = faces[i];
            face.userData.plane.rotation.x = PI_HALF * Math.sin(PI2 * tick * 2);
            face.userData.plane.rotation.y = PI * tick;
        }

        renderer.render(scene, camera);
    },
}