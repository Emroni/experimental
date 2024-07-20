import { PI2 } from '@/constants';
import * as PIXI from 'pixi.js';
import SimplexNoise from 'simplex-noise';

PIXI.utils.skipHello();

const SIZE = 640;
const simplex = new SimplexNoise();
const app = new PIXI.Application({
    antialias: true,
    width: SIZE,
    height: SIZE,
});

const center = {
    x: app.view.width / 2,
    y: app.view.height / 2,
};

const container = new PIXI.ParticleContainer();
app.stage.addChild(container);

const particleShape = new PIXI.Graphics();
particleShape.beginFill(0xFFFFFF, 0.1);
particleShape.drawCircle(0, 0, 1);
particleShape.endFill();
const particleTexture = app.renderer.generateTexture(particleShape);

for (let i = 0; i < 2000; i++) {
    const particle = PIXI.Sprite.from(particleTexture);
    container.addChild(particle);
}

export default {
    duration: 5,
    element: app.view,
    size: SIZE,
    onTick: (tick) => {
        for (let i = 0; i < container.children.length; i++) {
            const particle = container.children[i];
            const n = i / container.children.length;

            const noiseAlpha = PI2 * (n + tick);
            const noiseX = Math.cos(noiseAlpha);
            const noiseY = Math.sin(noiseAlpha);
            const noise1 = simplex.noise3D(noiseX, noiseY, n) * 50;
            const noise2 = simplex.noise3D(noiseX + 2, noiseY, n) * 50;

            particle.x = window.innerWidth * (i / container.children.length) + noise1;
            particle.y = center.y + noise2;
        }
    },
}