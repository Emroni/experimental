'use client';
import { PixiPlayer } from '@/components';
import { PI_M2 } from '@/setup';
import * as PIXI from 'pixi.js';

export default function Hexagon3() {

    const container = new PIXI.Container();
    const rows: PIXI.Container[][] = [];
    const size = 25;
    const spacing = 2;

    function handleInit(app: PIXI.Application) {
        app.stage.addChild(container);

        // Create draw
        function draw(color: number) {
            const shape = new PIXI.Graphics()
                .moveTo(0, 0.5 * size)
                .lineTo(0.4330125 * size, 0.25 * size)
                .lineTo(0.4330125 * size, -0.25 * size)
                .lineTo(0, -0.5 * size)
                .lineTo(-0.4330125 * size, -0.25 * size)
                .lineTo(-0.4330125 * size, 0.25 * size)
                .fill(color);
            return app.renderer.generateTexture(shape);
        }

        // Get textures
        const textures = [
            draw(0xc62828),
            draw(0x00e575),
            draw(0x00acc1),
        ];

        // Create add
        function add(row: PIXI.Container[], x: number, y: number) {
            x = (x - 2) * ((size * 0.4330125) + spacing) + app.canvas.width / 2;
            y = y * ((size * 0.75) + spacing) + app.canvas.height / 2;

            if (x <= -size / 2 || x >= app.canvas.width + size / 2 || y < -size / 2 || y >= app.canvas.height + size / 2) {
                return;
            }

            const hex = new PIXI.Container();
            container.addChild(hex);
            row.push(hex);
            hex.position.x = x;
            hex.position.y = y;

            for (let i = 0; i < textures.length; i++) {
                const sprite = PIXI.Sprite.from(textures[i]);
                hex.addChild(sprite);
                sprite.position.x = -sprite.width / 2;
                sprite.position.y = -sprite.height / 2;
            }
        }

        // Add rows
        let x = 0, y = 0;
        for (let i = 0; i <= 20; i++) {
            const row: PIXI.Container[] = [];
            rows.push(row);

            add(row, x += 2, y);
            for (let j = 0; j < i - 1; j++) add(row, ++x, ++y);
            for (let j = 0; j < i; j++) add(row, --x, ++y);
            for (let j = 0; j < i; j++) add(row, x -= 2, y);
            for (let j = 0; j < i; j++) add(row, --x, --y);
            for (let j = 0; j < i; j++) add(row, ++x, --y);
            for (let j = 0; j < i; j++) add(row, x += 2, y);
        }
    }

    function handleTick(progress: number) {
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const alpha = PI_M2 * (progress - i / rows.length);
            const alphas = [
                Math.max(0, Math.sin(alpha)),
                Math.max(0, Math.sin(2 * alpha)),
                Math.max(0, Math.sin(3 * alpha)),
            ];
            const beta = 0.5 * Math.abs(Math.sin(PI_M2 * (progress - i / rows.length))) + 0.5;

            for (let j = 0; j < row.length; j++) {
                let hex = row[j];
                hex.scale.x = hex.scale.y = beta;

                for (let k = 0; k < alphas.length; k++) {
                    hex.children[k].alpha = alphas[k];
                }
            }
        }
    }

    return <PixiPlayer
        duration={5}
        size={540}
        onInit={handleInit}
        onTick={handleTick}
    />;

}