import * as PIXI from 'pixi.js';
import SimplexNoise from 'simplex-noise';

const PI2 = 2 * Math.PI;
const simplex = new SimplexNoise();
const center = {};
let tick = 0;

const app = new PIXI.Application({
    antiAlias: true,
    autoResize: true,
    resolution: devicePixelRatio,
});
document.body.appendChild(app.view);

const container = new PIXI.ParticleContainer();
app.stage.addChild(container);

const particleShape = new PIXI.Graphics();
particleShape.beginFill(0xFFFFFF, 0.1);
particleShape.drawCircle(0, 0, 1);
particleShape.endFill();
const particleTexture = app.renderer.generateTexture(particleShape);

for (let i=0; i<1000; i++) {
    const particle = new PIXI.Sprite.from(particleTexture);
    container.addChild(particle);
}

window.addEventListener('resize', resize);
resize();
render();

function resize() {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    center.x = window.innerWidth / 2;
    center.y = window.innerHeight / 2;
}

function render() {
    requestAnimationFrame(render);
    tick += 0.0025;

    for (let i=0; i<container.children.length; i++) {
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
}