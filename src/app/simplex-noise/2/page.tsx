'use client';
import { PixiPlayer } from '@/components';
import { PI_M2 } from '@/setup';
import alea from 'alea';
import * as PIXI from 'pixi.js';
import { createNoise3D } from 'simplex-noise';

export default function SimplexNoise2() {

    const container = new PIXI.Container();
    const loops = 10;
    const particles = 1000;
    const rows = 3;
    const size = 640;
    
    const center = size / 2;

    const noise3Ds = new Array(rows).fill(0).map((_, index) => {
        return createNoise3D(alea(index));
    });

    function handleInit(app: PIXI.Application) {
        app.stage.addChild(container);

        // Get particle texture
        const particleShape = new PIXI.Graphics()
            .circle(0, 0, 1)
            .fill({
                alpha: 0.2,
                color: 0xFFFFFF,
            });
        const particleTexture = app.renderer.generateTexture(particleShape);

        // Add to container
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < particles; j++) {
                const particle = PIXI.Sprite.from(particleTexture);
                container.addChild(particle);
                particle.alpha = 0.8 * (i / rows) + 0.2;
            }
        }
    }

    function handleTick(progress: number) {
        for (let i = 0; i < rows; i++) {
            // Get noise
            const noise3D = noise3Ds[i];
            const offset = PI_M2 * progress + (i / rows) * PI_M2;

            for (let j = 0; j < particles; j++) {
                // Get particle
                const particle = container.children[particles * i + j];
                const n = j / particles;

                // Get spiral
                const spiralAlpha = PI_M2 * n;
                const spiralRadius = 50 * Math.sin(PI_M2 * (j / (particles / loops)) + offset) + 200;
                const spiralX = spiralRadius * Math.sin(spiralAlpha) + center;
                const spiralY = spiralRadius * Math.cos(spiralAlpha) + center;

                // Get noise
                const noiseAlpha = PI_M2 * (n + progress);
                const noiseX = Math.cos(noiseAlpha);
                const noiseY = Math.sin(noiseAlpha);
                const noise1 = noise3D(noiseX, noiseY, n) * 50;
                const noise2 = noise3D(noiseX + 2, noiseY, n) * 50;

                // Update particle
                particle.x = spiralX + noise1;
                particle.y = spiralY + noise2;
            }
        }
    }

    return <PixiPlayer
        duration={5}
        onInit={handleInit}
        onTick={handleTick}
    />;

}