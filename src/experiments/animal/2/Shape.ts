import { PI2 } from '@/constants';
import * as THREE from 'three';

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

export default class Shape extends THREE.Object3D {

    index: number;
    material: THREE.ShaderMaterial;
    offset: THREE.Vector3;

    constructor(positions) {
        super();

        const buffer = new Float32Array(positions);

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(buffer, 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array('0,0,1,0,0,1'.split(',').map(n => parseInt(n))), 2));
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
        // const r = controls.explode.move * Math.sin(PI2 * 2 * (controls.explode.wave * this.index + tick)) + (controls.explode.base + controls.explode.move + 1);
        const r = controls.explode.move.value * Math.sin(PI2 * 2 * (controls.explode.wave.value * this.index + tick)) + (controls.explode.base.value + controls.explode.move.value + 1);
        this.position.x = 1.2 * SCALE * this.offset.x * r;
        this.position.y = SCALE * this.offset.y * r;
        this.position.z = SCALE * this.offset.z * r;

        this.material.uniforms.tick.value = tick;
    }
}