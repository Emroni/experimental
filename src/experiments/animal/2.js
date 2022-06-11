import * as THREE from 'three';
import * as Recorder from '../recorder';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const SIZE = 1200;
const PI2 = 2 * Math.PI;
const SCALE = 150;

const controls = {
    explode: {
        base: {
            min: 0,
            max: 1,
            step: 0.001,
            value: 0.1,
        },
        move: {
            min: 0,
            max: 1,
            step: 0.001,
            value: 0.05,
        },
        wave: {
            min: 0,
            max: 1,
            step: 0.001,
            value: 0.3,
        },
    },
    bloom: {
        strength: 1,
        radius: 1,
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

const shapes = [];

class Shape extends THREE.Object3D {
    constructor(positions) {
        super();

        const buffer = new Float32Array(positions);

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(buffer, 3));
        geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array('0,0,1,0,0,1'.split(',')), 2));
        geometry.computeBoundingSphere();

        this.offset = geometry.boundingSphere.center.clone();
        for (let i = 0; i < 9; i += 3) {
            buffer[i] -= this.offset.x;
            buffer[i + 1] -= this.offset.y;
            buffer[i + 2] -= this.offset.z;
        }

        geometry.computeBoundingSphere();

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                speed: {
                    value: Math.round(Math.sin(PI2 * this.offset.z) + 2),
                },
                offset: {
                    value: Math.cos(PI2 * this.offset.z),
                },
                tick: {
                    value: 0,
                },
            },
            fragmentShader: `
                precision highp float;
                uniform float tick;
                uniform float speed;
                uniform float offset;
                varying vec2 vUv;
                
                vec4 to = vec4(0.0, 0.0, 0.0, 1.0);
                
                void main() {
                    float t = ${PI2} * tick * speed + offset;
                    vec4 from = vec4(sin(t), sin(speed * t), cos(t), 1.0);
                    float a = abs(sin(t + vUv.x));
                    gl_FragColor = mix(from, to, a);
                }
            `,
            vertexShader: `
                precision highp float;
                varying vec2 vUv;
            
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
        });

        const face = new THREE.Mesh(geometry, this.material);
        this.add(face);

        this.scale.setScalar(SCALE);

        this.index = this.offset.z;
    }

    move(tick) {
        const r = controls.explode.move * Math.sin(PI2 * 2 * (controls.explode.wave * this.index + tick)) + (controls.explode.base + controls.explode.move + 1);
        this.position.x = 1.2 * SCALE * this.offset.x * r;
        this.position.y = SCALE * this.offset.y * r;
        this.position.z = SCALE * this.offset.z * r;

        this.material.uniforms.tick.value = tick;
    }
}

const loader = new GLTFLoader();
loader.load('models/animal-2.gltf', gltf => {
    const head = gltf.scene.children[0];

    for (let i = 0; i < head.geometry.index.array.length; i += 3) {
        const indices = Array.from(head.geometry.index.array.slice(i, i + 3));

        let positions = [];
        indices.forEach(index => {
            positions = positions.concat(Array.from(head.geometry.attributes.position.array.slice(index * 3, (index + 1) * 3)));
        });

        const shape = new Shape(positions);
        container.add(shape);
        shapes.push(shape);
    }
});

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
    duration: 10,
    target: renderer.domElement,
    progress: true,
    render: (tick) => {
        container.rotation.x = 0.1 * Math.sin(PI2 * 2 * tick) + 0.5;
        container.rotation.y = 0.1 * Math.sin(PI2 * tick);

        for (let i = 0; i < shapes.length; i++) {
            shapes[i].move(tick);
        }

        composer.render();
    },
});
