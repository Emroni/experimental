import * as THREE from 'three';
import * as Recorder from '../recorder';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const SIZE = 1200;
const PI2 = Math.PI * 2;
const PI_HALF = Math.PI / 2;
const PI_QUARTER = Math.PI / 4;
const WIDE = 200;
const ROWS = 10;
const SPACING = 2;
const PLANE = 5000;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 1, 1, 10000);
camera.position.y = 30;
camera.position.z = 600;

const renderer = new THREE.WebGLRenderer({
    antialias: true,
});
renderer.setSize(SIZE, SIZE);
document.body.appendChild(renderer.domElement);

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(SIZE, SIZE), 0.5, 0, 0.7);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const lightIn = new THREE.PointLight('#fff', 3, 10000, 20);
scene.add(lightIn);

const lightOut = new THREE.PointLight('#fff', 5, 1000, 5);
scene.add(lightOut);
lightOut.position.y = 200;
lightOut.position.z = 600;

const container = new THREE.Object3D();
scene.add(container);

const meshGeometryIndices = new Uint16Array('0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,15,123,16,18,124,19,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,36,143,144,145,146,147,36,144,37,148,149,150,151,152,153,154,155,156,157,151,153,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,68,227,66,228,229,230,231,232,233,234,235,236,235,237,236,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,90,274,91,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,293,294,295'.split(','));
const meshGeometryPosition = new Float32Array('-0.9,-0.9,-0.9,0.9,-1,-0.9,0.9,-0.9,-0.9,-0.9,-0.9,-0.9,-1,-0.9,0.9,-0.9,-0.9,0.9,-0.9,0.9,-0.9,-1,0.9,0.9,-1,0.9,-0.9,-1,-0.9,0.9,-0.9,0.9,0.9,-0.9,-0.9,0.9,-1,0.9,-0.9,-0.9,-0.9,-0.9,-0.9,0.9,-0.9,-0.9,-0.9,0.9,0.9,-0.9,1,0.9,-0.9,0.9,0.9,0.9,1,-0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.45,1,0.9,0.9,1,0.9,0.9,0.9,-0.9,-0.9,-0.9,-0.9,0.9,-1,-0.9,0.9,-0.9,0.9,0.9,0.9,0.9,1,-0.9,0.9,0.9,-0.9,-0.9,0.9,0.9,0.9,1,0.9,0.9,0.9,0.9,-0.9,0.9,-0.9,-0.9,1,0.9,-0.9,0.9,0.9,1,-1,-1,-0.9,-1,-0.9,-1,-1,-1,-1,1,-1,-0.9,1,0.9,-0.9,1,-0.9,1,0.9,0.9,1,0.9,-0.9,1,1,-1,1,-1,1,-0.9,-0.9,1,-1,-1,1,-1,-1,1,-1,0.9,0.9,-1,-0.9,0.9,1,1,-1,0.9,0.9,-1,-1,1,-1,-1,0.9,-0.9,-1,1,1,-1,1,-1,-0.9,0.9,1,0.9,0.9,1,1,1,1,0.9,0.9,0.9,1,0.9,-0.9,1,0.9,0.9,1,-0.9,-0.9,0.9,-0.9,0.9,1,-0.9,0.9,1,-0.9,0.9,1,-1,1,1,-1,-1,1,1,1,1,1,-1,0.9,1,0.9,-0.9,-0.9,-0.9,-0.9,-1,0.9,-0.9,-1,-0.9,-0.9,-1,0.9,0.9,-0.9,0.9,0.9,-1,0.9,0.9,-1,-0.45,1,-1,-1,1,-1,1,0.9,-0.9,-1,1,-1,-1,-1,-1,-1,0.9,0.9,0.9,1,0.9,0.9,1,-0.45,0.9,-0.9,-0.9,0.9,-0.9,0.9,1,-0.9,-0.9,1,0.9,0.9,-0.9,-0.9,0.9,-1,0.9,0.9,-1,-0.9,0.9,-0.9,0.9,1,-0.9,-0.9,1,-0.9,0.9,-0.9,-0.9,0.9,-1,-0.9,0.9,-1,-0.45,0.9,0.9,-0.9,1,-0.9,-0.9,1,0.9,-0.9,0.9,0.9,-0.9,0.9,0.9,-1,0.9,-0.45,-1,-0.9,-0.9,-1,0.9,-0.9,-0.9,0.9,-0.9,-1,-0.9,-0.9,-0.9,-0.9,-1,-0.9,0.9,-1,-0.9,-0.9,-0.9,-0.9,-1,-0.9,-0.9,-1,-0.9,0.9,-0.9,0.9,-0.9,-0.9,0.9,0.9,-1,0.9,0.9,-1,-0.9,0.9,-1,0.9,0.9,-0.9,0.9,0.9,-1,0.9,-0.9,-1,-0.9,-0.9,-0.9,-0.9,-0.9,-0.9,-0.9,1,-0.9,0.9,1,0.9,0.9,0.9,0.9,-0.9,0.9,0.9,0.45,1,0.9,-0.9,0.9,0.9,-0.9,1,0.9,0.45,1,-0.9,-0.9,-0.9,-0.9,-0.9,-1,-0.9,0.9,-1,0.9,0.9,0.9,0.9,1,0.9,0.9,1,-0.9,-0.9,0.9,0.9,-0.9,1,0.9,0.9,1,0.9,-0.9,0.9,-0.9,-0.9,1,-0.9,-0.9,1,0.9,0.9,-1,-0.45,0.9,-1,-0.9,-0.9,-1,-0.9,-0.9,-1,0.9,-1,-1,1,-0.9,-1,-0.9,-1,-1,1,-1,-1,-1,0.9,1,-0.9,1,1,-1,-1,1,-1,-1,1,-1,-1,1,1,-0.9,1,0.9,-0.9,1,-0.9,1,-0.9,-0.9,1,-1,-1,1,1,-1,1,1,1,1,-1,1,1,-0.45,0.9,1,1,1,1,-0.45,0.9,1,0.9,0.9,1,0.9,-0.9,1,-0.9,-0.9,1,1,-1,1,1,1,1,0.9,0.9,1,1,-1,1,-1,1,1,1,1,0.9,0.45,1,1,-1,1,0.9,0.45,1,0.9,-0.9,1,-0.9,0.9,1,-1,1,1,-0.9,-0.9,1,-1,1,1,-1,-1,1,-0.9,-0.9,1,1,-1,1,0.9,-0.9,1,-0.9,-0.9,1,-1,-1,1,-1,1,1,-1,0.9,0.9,-1,-0.9,0.9,-1,-0.9,-0.9,-1,-1,1,-1,-0.9,-0.9,-1,-1,-1,-1,-1,1,1,1,-1,1,-1,-1,0.9,-0.45,-1,0.9,0.9,-1,-0.9,0.9,-1,-1,1,-1,1,1,-1,0.9,-0.45,-1,0.9,0.9,-1,-1,1,-1,-1,-1,-1,-1,-0.9,-0.9,-1,0.9,-0.9,-1,0.9,0.9,-1,1,1,-1,1,-1,-1,-0.9,-0.9,-1,0.9,-0.9,1,1,1,-1,1,1,-0.9,0.9,1,0.9,0.9,1,0.9,0.45,1,1,1,1,0.9,0.9,0.9,0.9,0.9,-0.9,1,0.9,-0.9,1,-0.9,-0.9,0.9,-0.9,-0.9,0.9,-0.9,0.9,1,-0.9,-0.9,1,-0.9,0.9,1,-0.45,0.9,1,-1,1,1,1,-1,0.9,1,-0.9,0.9,1,0.9,0.9,1,0.9,-0.9,1,0.9,1,1,1,-1,1,1,-0.9,-0.9,-0.9,-0.9,-0.9,0.9,-0.9,-1,0.9,-0.9,-1,0.9,-0.9,-0.9,0.9,0.9,-0.9,0.9,1,-1,1,-1,-1,1,0.9,-1,0.9,-1,-1,1,-0.9,-1,0.9,0.9,-1,0.9,0.9,-1,0.9,0.9,-1,-0.45,1,-1,1,-1,-1,-1,-1,1,-1,-0.9,-0.9,-1,-1,1,-1,-0.9,0.9,-1,-0.9,-0.9,-1,0.9,-0.9,-1,0.9,-0.45,-1,1,-1,-1,-1,-1,-1,-0.9,-0.9,-1,0.9,-0.9,-1,1,-0.45,0.9,1,-0.9,0.9,0.9,-0.9,0.9,0.9,-0.9,0.9,0.9,0.9,0.9,1,-0.45,0.9,-0.9,-0.9,0.9,-0.9,0.9,0.9,-0.9,0.9,1,-0.9,0.9,-0.9,-0.9,0.9,-0.9,0.9,0.9,-0.9,0.9,1,-0.9,0.9,-1,-0.45,0.9,-1,0.9,0.9,-0.9,0.9,0.9,-0.9,0.9,0.9,-0.9,-0.9,0.9,-1,-0.45,0.9,0.9,-0.9,0.9,-0.9,-0.9,1,-0.9,-0.9,0.9,-0.45,-1,0.9,-0.9,-1,0.9,-0.9,-0.9,0.9,-0.9,-0.9,0.9,0.9,-0.9,0.9,-0.45,-1,-0.9,-0.9,-1,-0.9,-0.9,-0.9,0.9,-0.9,-0.9'.split(','));
const meshGeometryUV = new Float32Array('0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.05,0.95,0,1,1,0,0.95,0.95,0.95,0.05,0.95,0.95,0.95,0.05,1,0,0,0,0.05,0.95,0,1,0,0,0.95,0.05,0.05,0.05,0,0,0.05,0.05,0,1,0.95,0.95,1,0,1,1,0.95,0.95,0.95,0.05,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0.05,0.95,0,1,0,0,0,1,0,0,0.05,0.95,0,0,0,0,0,0,0,0,0,0,0,0,0.275,0.05,0,0,1,0,0.95,0.05,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.275,0.05,0.05,0.05,0.05,0.95,0.95,0.95,1,1,0.05,0.95,1,1,0,1,0.05,0.05,0,0,1,0,1,0,1,1,0.95,0.95,0.95,0.05,0.05,0.05,0,0,1,0,1,1,0,1,0.275,0.95,1,1,0.275,0.95,0.95,0.95,0.95,0.05,0.05,0.05,1,0,1,1,0.95,0.95,1,0,0,0,1,0,0.725,0.05,0,0,0.725,0.05,0.05,0.05,0.95,0.95,1,1,0.05,0.95,1,1,0,1,0.05,0.95,0,0,0.05,0.05,0.05,0.95,0,0,1,0,0.95,0.05,0.05,0.05,0.05,0.95,0,0,0.05,0.95,0,1,0,0,0,0,1,0,0.725,0.05,0.05,0.05,0.05,0.95,0,1,0,0,0.725,0.05,0.05,0.05,1,1,0,1,0.05,0.95,0.95,0.95,0.95,0.05,1,0,1,1,0.05,0.95,0.95,0.95,1,0,1,1,0.95,0.95,0.95,0.05,0.725,0.05,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0.05,0.05,0.05,0.95,0.275,0.95,0,1,0,0,0.05,0.05,0.05,0.95,0.05,0.95,0.95,0.95,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,0.95,0.05,1,1,0.95,0.95,0.95,0.05,0.95,0.05,0.275,0.05,1,0,1,1,0,1,0.95,0.95,0,1,0.05,0.95,0.95,0.95,0.95,0.05,0.725,0.05,1,0,1,1,0.95,0.95,0.95,0.05,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0'.split(','));

const meshGeometry = new THREE.BufferGeometry();
meshGeometry.addAttribute('position', new THREE.BufferAttribute(meshGeometryPosition, 3));
meshGeometry.addAttribute('uv', new THREE.BufferAttribute(meshGeometryUV, 2));
meshGeometry.setIndex(new THREE.BufferAttribute(meshGeometryIndices, 1));
meshGeometry.computeVertexNormals();
meshGeometry.scale(WIDE / 2, WIDE / 2, WIDE / 2);

const meshMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load('textures/metal-1.png'),
});

const mesh = new THREE.InstancedMesh(meshGeometry, meshMaterial, (ROWS * 2 + 1) * ROWS * ROWS + 1);
container.add(mesh);

const large = new THREE.Object3D();
large.scale.setScalar(2);
large.updateMatrix();
mesh.setMatrixAt(0, large.matrix);

const cubes = [];
for (let x = 0; x <= ROWS * 2; x++) {
    for (let y = 0; y < ROWS; y++) {
        for (let z = 0; z < ROWS; z++) {
            const cube = new THREE.Object3D();
            cubes.push(cube);

            cube.position.x = WIDE * SPACING * (x - ROWS);
            cube.position.y = WIDE * SPACING * y;
            cube.position.z = WIDE * SPACING * -z;

            cube.userData.delay = Math.sqrt(cube.position.x * cube.position.x + cube.position.y * cube.position.y + cube.position.z * cube.position.z) / (WIDE * SPACING * ROWS);

            cube.updateMatrix();
            mesh.setMatrixAt(cubes.length, cube.matrix);
        }
    }
}

const planeGeometry = new THREE.PlaneGeometry(PLANE, PLANE);

const planeMaterial = new THREE.MeshBasicMaterial({
    color: '#111',
});

const planes = new THREE.Object3D();
container.add(planes);

const planeLeft = new THREE.Mesh(planeGeometry, planeMaterial);
planes.add(planeLeft);
planeLeft.scale.y = 3;

const planeRight = new THREE.Mesh(planeGeometry, planeMaterial);
planes.add(planeRight);
planeRight.scale.y = 3;

const planeTopLeft = new THREE.Mesh(planeGeometry, planeMaterial);
planes.add(planeTopLeft);
planeTopLeft.scale.x = WIDE / PLANE * 2;
planeTopLeft.position.x = -WIDE;
planeTopLeft.position.y = PLANE / 2 + WIDE;
planeTopLeft.rotation.y = -Math.PI / 2;

const planeTopMiddle = new THREE.Mesh(planeGeometry, planeMaterial);
planes.add(planeTopMiddle);
planeTopMiddle.scale.x = WIDE / PLANE * 2;
planeTopMiddle.position.y = PLANE / 2 + WIDE;
planeTopMiddle.position.z = WIDE;

const planeTopRight = new THREE.Mesh(planeGeometry, planeMaterial);
planes.add(planeTopRight);
planeTopRight.scale.x = WIDE / PLANE * 2;
planeTopRight.position.x = WIDE;
planeTopRight.position.y = PLANE / 2 + WIDE;
planeTopRight.rotation.y = Math.PI / 2;

const planeBottomLeft = new THREE.Mesh(planeGeometry, planeMaterial);
planes.add(planeBottomLeft);
planeBottomLeft.scale.x = WIDE / PLANE * 2;
planeBottomLeft.position.x = -WIDE;
planeBottomLeft.position.y = -PLANE / 2 - WIDE;
planeBottomLeft.rotation.y = Math.PI / 2;

const planeBottomMiddle = new THREE.Mesh(planeGeometry, planeMaterial);
planes.add(planeBottomMiddle);
planeBottomMiddle.scale.x = WIDE / PLANE * 2;
planeBottomMiddle.position.y = -PLANE / 2 - WIDE;
planeBottomMiddle.position.z = -WIDE;

const planeBottoRight = new THREE.Mesh(planeGeometry, planeMaterial);
planes.add(planeBottoRight);
planeBottoRight.scale.x = WIDE / PLANE * 2;
planeBottoRight.position.x = WIDE;
planeBottoRight.position.y = -PLANE / 2 - WIDE;
planeBottoRight.rotation.y = -Math.PI / 2;

let side;

function ease(t, b = 0, c = 1, d = 1) {
    t = Math.max(0, Math.min(1, t));
    if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t + b;
    }
    return c / 2 * ((t -= 2) * t * t + 2) + b;
}

Recorder.setup({
    duration: 12,
    target: renderer.domElement,
    render: (tick) => {

        container.rotation.x = 0.2 * Math.sin(PI2 * tick) - 0.55;
        container.rotation.y = -PI_HALF * tick + PI_QUARTER;

        const s = tick < 0.28 ? 'left' : (tick > 0.78 ? 'right' : 'middle');

        for (let i = 0; i < cubes.length; i++) {
            const cube = cubes[i];

            if (side !== s) {
                cube.userData.hide = (s === 'left' && cube.position.x < 0) || (s === 'right' && cube.position.x > 0);
                if (cube.userData.hide) {
                    cube.scale.setScalar(0.0001);
                }
            }

            if (!cube.userData.hide) {
                const t = 12 * tick - cube.userData.delay;
                cube.rotation.x = PI_HALF * (ease(t) + ease(t - 6));
                cube.rotation.y = PI_HALF * (ease(t - 2) + ease(t - 8));
                cube.rotation.z = -PI_HALF * (ease(t - 4) + ease(t - 10));

                cube.scale.setScalar(0.2 * Math.sin(PI2 * tick) + 1);
            }

            cube.updateMatrix();
            mesh.setMatrixAt(i + 1, cube.matrix);
        }

        if (side !== s) {
            planeLeft.position.x = s === 'left' ? (-PLANE / 2 - WIDE) : -WIDE;
            planeLeft.position.z = s === 'left' ? -WIDE : (PLANE / 2 + WIDE);
            planeLeft.rotation.y = s === 'left' ? 0 : PI_HALF;

            planeRight.position.x = s === 'right' ? (PLANE / 2 + WIDE) : WIDE;
            planeRight.position.z = s === 'right' ? -WIDE : (PLANE / 2 + WIDE);
            planeRight.rotation.y = s === 'right' ? 0 : -PI_HALF;
        }

        side = s;

        mesh.instanceMatrix.needsUpdate = true;

        // renderer.render(scene, camera);
        composer.render();
    },
});
