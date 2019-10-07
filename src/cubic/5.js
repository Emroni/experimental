import * as THREE from 'three';
import * as Recorder from '../recorder';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const PI2 = Math.PI * 2;
const SIZE = 640;
const ROWS = 40;
const SPACING = 30;
const CUBE = 28;
const SCALE_MIN = 0.001;
const EASE = 0.1;
const COLORS = [
    '#D50000',
    '#6200EA',
    '#0091EA',
    '#AA00FF',
    '#FFD600',
    '#00C853',
];

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 1, 1, 2000);
camera.position.z = 800;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(SIZE, SIZE);
renderer.toneMappingExposure = 2;
document.body.appendChild(renderer.domElement);

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(SIZE, SIZE), 1, 0);

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const lightIn = new THREE.PointLight(0xFFFFFF, 1, camera.position.z, 5);
scene.add(lightIn);

const lightOut = new THREE.PointLight(0xFFFFFF, 1, 2 * camera.position.z, 5);
scene.add(lightOut);
lightOut.position.x = camera.position.z / 3;
lightOut.position.y = camera.position.z / 4;
lightOut.position.z = camera.position.z / 2;

const container = new THREE.Object3D();
scene.add(container);

const geometry = new THREE.BoxGeometry(CUBE, CUBE, CUBE);

const materials = COLORS.map(color => new THREE.MeshPhongMaterial({
    color,
}));

const mesh = new THREE.InstancedMesh(geometry, materials, Math.pow(ROWS, 3));
container.add(mesh);

const shapeRadius = ROWS * SPACING * 0.5;
const shapeGeometry = new THREE.OctahedronGeometry(shapeRadius);
const shapeMaterial = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    visible: false,
});
const shape = new THREE.Mesh(shapeGeometry, shapeMaterial);
container.add(shape);

const animate = [];
for (let x = 0; x < ROWS; x++) {
    for (let y = 0; y < ROWS; y++) {
        for (let z = 0; z < ROWS; z++) {
            const cube = new THREE.Object3D();
            cube.userData.index = x * ROWS * ROWS + y * ROWS + z;
            cube.userData.x = x;
            cube.userData.y = y;
            cube.userData.z = z;

            cube.scale.setScalar(SCALE_MIN);
            cube.position.x = SPACING * (x - ROWS / 2 + 0.5);
            cube.position.y = SPACING * (y - ROWS / 2 + 0.5);
            cube.position.z = SPACING * (z - ROWS / 2 + 0.5);

            cube.updateMatrix();
            mesh.setMatrixAt(cube.userData.index, cube.matrix);

            const distance = Math.sqrt(cube.position.x * cube.position.x + cube.position.y * cube.position.y + cube.position.z * cube.position.z);
            if (distance <= shapeRadius && distance >= shapeRadius * 0.5) {
                animate.push(cube);
            }
        }
    }
}

const raycaster = new THREE.Raycaster();
const ray = new THREE.Vector3(0, 1, 0);

Recorder.setup({
    delay: 1,
    duration: 20,
    fps: 60,
    target: renderer.domElement,
    render: (tick) => {
        lightIn.intensity = 4 * Math.sin(PI2 * 2 * tick) + 4;
        lightOut.intensity = -2 * Math.sin(PI2 * 2 * tick) + 2;

        container.rotation.x = 0.1 * Math.sin(PI2 * 2 * tick) + 0.3;
        container.rotation.y = -PI2 * tick;

        shape.rotation.x = 2 * container.rotation.y;
        shape.rotation.y = 2 * container.rotation.y;
        shape.scale.setScalar(0.1 * Math.abs(Math.sin(PI2 * tick)) + 0.7);

        for (let i = 0; i < animate.length; i++) {
            const cube = animate[i];

            raycaster.set(cube.position, ray);
            const scale = raycaster.intersectObject(shape).length === 1 ? 1 : SCALE_MIN;
            cube.scale.setScalar(cube.scale.x + (scale - cube.scale.x) * EASE);

            cube.updateMatrix();

            mesh.setMatrixAt(cube.userData.index, cube.matrix);
        }

        mesh.instanceMatrix.needsUpdate = true;

        composer.render();
    },
});
