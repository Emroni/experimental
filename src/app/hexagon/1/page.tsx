'use client';
import { PixiPlayer } from '@/components';
import { PI_M2 } from '@/setup';
import * as PIXI from 'pixi.js';

export default function Hexagon1() {

    const container = new PIXI.Container();
    const rows: PIXI.Sprite[][] = [];
    const size = 30;
    const spacing = 5;

    function handleInit(app: PIXI.Application) {
        app.stage.addChild(container);

        // Get shape texture
        const shape = new PIXI.Graphics()
            .moveTo(0, 0.5 * size)
            .lineTo(0.4330125 * size, 0.25 * size)
            .lineTo(0.4330125 * size, -0.25 * size)
            .lineTo(0, -0.5 * size)
            .lineTo(-0.4330125 * size, -0.25 * size)
            .lineTo(-0.4330125 * size, 0.25 * size)
            .fill(0xFFFFFF);
        const texture = app.renderer.generateTexture(shape);

        // Create add
        function add(row: PIXI.Sprite[], x: number, y: number) {
            x = (x - 2.625) * ((size * 0.4330125) + spacing) + app.canvas.width / 2;
            y = (y - 0.55) * ((size * 0.75) + spacing) + app.canvas.height / 2;

            if (x <= -size || x >= app.canvas.width || y < -size || y >= app.canvas.height) {
                return;
            }

            const hex = PIXI.Sprite.from(texture);
            container.addChild(hex);
            row.push(hex);

            hex.position.x = x;
            hex.position.y = y;
        };

        // Add rows
        let x = 0, y = 0;
        for (let i = 0; i <= 14; i++) {
            const row: PIXI.Sprite[] = [];
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
            const alpha = Math.abs(Math.sin(PI_M2 * (progress - i / rows.length)));

            for (let j = 0; j < row.length; j++) {
                let hex = row[j];
                hex.alpha = alpha;
            }
        }
    }

    return <PixiPlayer
        duration={5}
        onInit={handleInit}
        onTick={handleTick}
    />;

}