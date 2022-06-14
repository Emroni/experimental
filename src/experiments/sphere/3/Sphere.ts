import { PI2 } from '@/constants';
import * as THREE from 'three';
import fragmentShader from './shader.frag';
import vertexShader from './shader.vert';

export default class Sphere extends THREE.Object3D {

    offset: number;
    shaderMaterial: THREE.ShaderMaterial;

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

            shape.userData.hexagon = hexagon.clone();
            shape.add(shape.userData.hexagon);
            shape.userData.hexagon.rotation.y = PI2 / 16;
            shape.userData.hexagon.rotation.x = Math.PI / 2;
        }
    }

    move(tick) {
        this.scale.setScalar(0.1 * Math.sin(PI2 * (tick + this.offset)) + 0.9);
        this.shaderMaterial.uniforms.tick.value = tick;

        for (let i = 0; i < this.children.length; i++) {
            const shape = this.children[i];
            shape.userData.hexagon.rotation.y = -2 * PI2 * tick;
        }
    }
}