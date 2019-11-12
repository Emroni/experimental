import SimplexNoise from 'simplex-noise';
import * as THREE from 'three';
import * as Recorder from '../recorder';

const FRAME = 640;
const PARTICLES = 10000;
const SIZE = 2;
const PI2 = Math.PI * 2;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.z = 500;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(FRAME, FRAME);
document.body.appendChild(renderer.domElement);

export function run(shape, layers, spread) {
    const lines = [];
    for (let i = 0; i < shape.faces.length; i++) {
        const face = shape.faces[i];

        lines.push({
            from: shape.vertices[face.a],
            to: shape.vertices[face.b],
        });

        lines.push({
            from: shape.vertices[face.b],
            to: shape.vertices[face.c],
        });

        lines.push({
            from: shape.vertices[face.c],
            to: shape.vertices[face.a],
        });
    }

    const particles = [];
    const geometry = new THREE.Geometry();
    const group = Math.ceil(PARTICLES / lines.length / layers);
    for (let i = 0; i < PARTICLES; i++) {
        const line = lines[Math.floor(i / group / layers)];
        const index = i % group;

        const n = 1.6 * (index / group) - 0.3;
        const dX = line.from.x + (line.to.x - line.from.x) * n;
        const dY = line.from.y + (line.to.y - line.from.y) * n;
        const dZ = line.from.z + (line.to.z - line.from.z) * n;
        const position = new THREE.Vector3(dX, dY, dZ);
        geometry.vertices.push(position.clone());

        const particle = {
            point: geometry.vertices[i],
            group: Math.floor(i / group),
            layer: Math.floor(i / group) % layers,
            position,
            index,
            line,
        };
        particles.push(particle);
    }

    const material = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        opacity: 0.2,
        size: SIZE,
        transparent: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const simplex = new SimplexNoise();

    Recorder.init({
        duration: 10,
        target: renderer.domElement,
        render: (tick) => {
            const d = (0.5 * Math.sin(PI2 * tick) + 0.5);
            const p = 1 - 0.75 * d;
            const s = spread * d + 5;

            scene.rotation.y = PI2 * tick;

            for (let i=0; i<particles.length;i++){
                const particle = particles[i];

                const n = particle.index / group;
                const alpha = PI2 * (n + tick);
                const cos = Math.cos(alpha);
                const sin = Math.sin(alpha);
                const noiseX = simplex.noise3D(cos + particle.group + 1, sin, n) * s;
                const noiseY = simplex.noise3D(cos + particle.group + 2, sin, n) * s;
                const noiseZ = simplex.noise3D(cos + particle.group + 3, sin, n) * s;
                particle.point.x = particle.position.x * p + noiseX;
                particle.point.y = particle.position.y * p + noiseY;
                particle.point.z = particle.position.z * p + noiseZ;
            }

            points.geometry.verticesNeedUpdate = true;

            renderer.render(scene, camera);
        },
    });
}
