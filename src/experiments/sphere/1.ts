import * as THREE from 'three';

const FRAME = 640;
const FACES = 200;
const RADIUS = 200;
const SIZE = 20;
const COLOR = 0xFFFFFF;
const PI2 = Math.PI * 2;
const PIHalf = Math.PI / 2;

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

const geometry = new THREE.BoxGeometry(SIZE, SIZE, 2);
const material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
});
const mesh = new THREE.Mesh(geometry, material);

const f = (2 / FACES);
const faces = [];
for (let i = 0; i < FACES; i++) {
    const face = new THREE.Object3D();
    scene.add(face);
    faces.push(face);

    face.userData.plane = mesh.clone();
    face.add(face.userData.plane);

    const n = (i * f) - 1 + (f / 2);
    const radius = Math.sqrt(1 - (n * n)) * RADIUS;
    const alpha = (i % FACES) * Math.PI * (3 - Math.sqrt(5));

    face.position.x = Math.cos(alpha) * radius;
    face.position.y = -n * RADIUS;
    face.position.z = Math.sin(alpha) * radius;
    face.lookAt(0, 0, 0);
}

export default {
    duration: 10,
    element: renderer.domElement,
    onTick: (tick) => {
        scene.rotation.y = PI2 * tick;

        for (let i = 0; i < faces.length; i++) {
            const face = faces[i];
            face.userData.plane.rotation.x = PIHalf * (Math.sin(PI2 * tick * 2) + 1);
            face.userData.plane.rotation.z = Math.PI * tick;
        }

        renderer.render(scene, camera);
    },
}