'use client';
import { PixiPlayer } from '@/components';
import { PI_M2 } from '@/setup';
import * as PIXI from 'pixi.js';
import { createNoise3D } from 'simplex-noise';

export default function SimplexNoise1() {

    const container = new PIXI.Container();
    const noise3D = createNoise3D();
    const size = 640;
    
    const center = size / 2;

    function handleInit(app: PIXI.Application) {
        app.stage.addChild(container);

        // Get particle texture
        const particleShape = new PIXI.Graphics()
            .circle(0, 0, 1)
            .fill({
                alpha: 0.1,
                color: 0xFFFFFF,
            });
        const particleTexture = app.renderer.generateTexture(particleShape);

        // Add to container
        for (let i = 0; i < 2000; i++) {
            const particle = PIXI.Sprite.from(particleTexture);
            container.addChild(particle);
        }
    }

    function handleTick(progress: number) {
        for (let i = 0; i < container.children.length; i++) {
            // Get particle
            const particle = container.children[i];
            const n = i / container.children.length;

            // Get noise
            const noiseAlpha = PI_M2 * (n + progress);
            const noiseX = Math.cos(noiseAlpha);
            const noiseY = Math.sin(noiseAlpha);
            const noise1 = noise3D(noiseX, noiseY, n) * 50;
            const noise2 = noise3D(noiseX + 2, noiseY, n) * 50;

            // Update particle
            particle.x = window.innerWidth * (i / container.children.length) + noise1;
            particle.y = center + noise2;
        }
    }

    return <PixiPlayer
        duration={5}
        size={640}
        onInit={handleInit}
        onTick={handleTick}
    />;

}