'use client';
import { PixiPlayer } from '@/components';
import { PI_M2 } from '@/setup';
import * as PIXI from 'pixi.js';

export default function Hexagon3() {

    const border = 2;
    const container = new PIXI.Container();
    const rows: PIXI.Container[][] = [];
    const size = 50;
    const spacing = 5;

    function handleInit(app: PIXI.Application) {
        app.stage.addChild(container);

        // Get shape texture
        const shape = new PIXI.Graphics()
            .moveTo(0, 0.5 * (size + border))
            .lineTo(0.4330125 * (size + border), 0.25 * (size + border))
            .lineTo(0.4330125 * (size + border), -0.25 * (size + border))
            .lineTo(0, -0.5 * (size + border))
            .lineTo(-0.4330125 * (size + border), -0.25 * (size + border))
            .lineTo(-0.4330125 * (size + border), 0.25 * (size + border))
            .fill(0)
            .moveTo(0, 0.5 * size)
            .lineTo(0.4330125 * size, 0.25 * size)
            .lineTo(0.4330125 * size, -0.25 * size)
            .lineTo(0, -0.5 * size)
            .lineTo(-0.4330125 * size, -0.25 * size)
            .lineTo(-0.4330125 * size, 0.25 * size)
            .fill(0xFFFFFF);
        const texture = app.renderer.generateTexture(shape);

        // Create add
        function add(row: PIXI.Container[], x: number, y: number) {
            x = (x - 2.125) * ((size * 0.4330125) + spacing) + app.canvas.width / 2;
            y = (y - 0.05) * ((size * 0.75) + spacing) + app.canvas.height / 2;

            if (x <= -size / 2 || x >= app.canvas.width + size / 2 || y < -size / 2 || y >= app.canvas.height + size / 2) {
                return;
            }

            const hex = new PIXI.Container();
            container.addChild(hex);
            row.push(hex);
            hex.position.x = x;
            hex.position.y = y;

            const sprite = PIXI.Sprite.from(texture);
            hex.addChild(sprite);
            sprite.position.x = -sprite.width / 2;
            sprite.position.y = -sprite.height / 2;
        }

        // Add rows
        let x = 0, y = 0;
        for (let i = 0; i <= 13; i++) {
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
            const alpha = Math.sin(PI_M2 * (progress - i / rows.length)) + 0.5;

            for (let j = 0; j < row.length; j++) {
                let hex = row[j];
                hex.scale.x = hex.scale.y = alpha;
            }
        }
    }

    return <PixiPlayer
        duration={5}
        onInit={handleInit}
        onTick={handleTick}
    />;

}