import * as THREE from 'three';
import * as Recorder from '../../recorder';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import fragmentShader from './shader.frag';
import vertexShader from './shader.vert';

const SIZE = 1200;
const PI2 = 2 * Math.PI;

const controls = {
    bloom: {
        strength: 1,
        radius: 0.5,
        threshold: 0.3,
    },
};

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 1, 1, 10000);
camera.position.z = 1000;

const renderer = new THREE.WebGLRenderer({
    antialias: true,
});
renderer.setSize(SIZE, SIZE);
document.body.appendChild(renderer.domElement);

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(SIZE, SIZE), controls.bloom.strength, controls.bloom.radius, controls.bloom.threshold);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const container = new THREE.Object3D();
scene.add(container);

class Sphere extends THREE.Object3D {

    constructor(color, radius, shapes, offset, speed, spread) {
        super();

        this.offset = offset;

        color = {
            r: 0,
            g: 0,
            b: 0,
            [color]: 1,
        };

        const geometry = new THREE.CylinderGeometry(radius / 10, radius / 10, radius / 50, 8);

        const transparentMaterial = new THREE.MeshBasicMaterial({
            color: '#' + Object.values(color)
                .join('')
                .replace('1', 'f'),
            opacity: 10 / radius,
            transparent: true,
        });

        this.shaderMaterial = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                color: {
                    value: color,
                },
                offset: {
                    value: Math.random(),
                },
                speed: {
                    value: speed,
                },
                spread: {
                    value: spread,
                },
                tick: {
                    value: 0,
                },
            },
            vertexShader,
            fragmentShader,
        });

        const hexagon = new THREE.Mesh(geometry, [
            this.shaderMaterial,
            transparentMaterial,
            transparentMaterial,
        ]);

        const f = (2 / shapes);
        for (let i = 0; i < shapes; i++) {
            const shape = new THREE.Object3D();
            this.add(shape);

            const n = (i * f) - 1 + (f / 2);
            const r = Math.sqrt(1 - (n * n)) * radius;
            const alpha = (i % shapes) * Math.PI * (3 - Math.sqrt(5));

            shape.position.x = Math.cos(alpha) * r;
            shape.position.y = -n * radius;
            shape.position.z = Math.sin(alpha) * r;
            shape.lookAt(0, 0, 0);

            shape.hexagon = hexagon.clone();
            shape.add(shape.hexagon);
            shape.hexagon.rotation.y = PI2 / 16;
            shape.hexagon.rotation.x = Math.PI / 2;
        }
    }

    move(tick) {
        this.scale.setScalar(0.1 * Math.sin(PI2 * (tick + this.offset)) + 0.9);
        this.shaderMaterial.uniforms.tick.value = tick;

        for (let i = 0; i < this.children.length; i++) {
            const shape = this.children[i];
            shape.hexagon.rotation.y = -2 * PI2 * tick;
        }
    }
}

container.add(new Sphere('r', 500, 300, 0, 2, 0.0015));
container.add(new Sphere('b', 600, 200, 0.1, 4, 0.001));
container.add(new Sphere('g', 3000, 100, 0.2, 6, 0.0005));

function change(key) {
    if (!key || key === 'bloom') {
        bloomPass.strength = controls.bloom.strength;
        bloomPass.radius = controls.bloom.radius;
        bloomPass.threshold = controls.bloom.threshold;
    }
}

Recorder.init({
    controls,
    change,
    duration: 30,
    target: renderer.domElement,
    progress: true,
    render: (tick) => {
        container.rotation.y = PI2 * tick;

        for (let i = 0; i < container.children.length; i++) {
            container.children[i].move(tick);
        }

        composer.render();
    },
});
