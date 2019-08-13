import * as PIXI from 'pixi.js';
import SimplexNoise from 'simplex-noise';
import Recorder from '../recorder';

const PI2 = 2 * Math.PI;
const ROWS = 3;
const PARTICLES = 1000;
const LOOPS = 10;

const app = new PIXI.Application({
    antiAlias: true,
    width: 640,
    height: 640,
});
document.body.appendChild(app.view);

const center = {
    x: app.view.width / 2,
    y: app.view.height / 2,
};

const container = new PIXI.ParticleContainer(ROWS * PARTICLES);
app.stage.addChild(container);

const particleShape = new PIXI.Graphics();
particleShape.beginFill(0xFFFFFF, 0.2);
particleShape.drawCircle(0, 0, 1);
particleShape.endFill();
const particleTexture = app.renderer.generateTexture(particleShape);

const simplexes = [];
for (let i = 0; i < ROWS; i++) {
    const simplex = new SimplexNoise(i);
    simplexes.push(simplex);

    for (let j = 0; j < PARTICLES; j++) {
        const particle = new PIXI.Sprite.from(particleTexture);
        container.addChild(particle);
        particle.alpha = 0.8 * (i / ROWS) + 0.2;
    }
}

new Recorder({
    duration: 10,
    target: app.view,
    render: (tick) => {
        for (let i = 0; i < ROWS; i++) {
            const simplex = simplexes[i];
            const offset = PI2 * tick + (i / ROWS) * PI2;

            for (let j = 0; j < PARTICLES; j++) {
                const particle = container.children[PARTICLES * i + j];
                const n = j / PARTICLES;

                const spiralAlpha = PI2 * n;
                const spiralRadius = 50 * Math.sin(PI2 * (j / (PARTICLES / LOOPS)) + offset) + 200;
                const spiralX = spiralRadius * Math.sin(spiralAlpha) + center.x;
                const spiralY = spiralRadius * Math.cos(spiralAlpha) + center.y;

                const noiseAlpha = PI2 * (n + tick);
                const noiseX = Math.cos(noiseAlpha);
                const noiseY = Math.sin(noiseAlpha);
                const noise1 = simplex.noise3D(noiseX, noiseY, n) * 50;
                const noise2 = simplex.noise3D(noiseX + 2, noiseY, n) * 50;

                particle.x = spiralX + noise1;
                particle.y = spiralY + noise2;
            }
        }
    },
});