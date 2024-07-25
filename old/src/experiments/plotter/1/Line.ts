import * as PIXI from 'pixi.js';
import SimplexNoise from 'simplex-noise';
import { app, ROWS, SIZE } from '.';

PIXI.utils.skipHello();

const CELL = 12;
const SEGMENT = 30;
const LINE = 2;

const simplex = new SimplexNoise();

export default class Line extends PIXI.Container {

    direction: number;

    constructor(index) {
        super();

        this.x = CELL * index - (ROWS * CELL / 2);
        this.direction = (index % 2 - 0.5) * 2;

        const graphics = new PIXI.Graphics();
        graphics.moveTo(0, 0);

        for (let i = 0; i < SIZE / SEGMENT; i++) {
            const noise = Math.abs(simplex.noise3D(0, i, index));
            graphics.lineStyle(LINE, 0xFFFFFF, noise);
            graphics.lineTo(0, i * SEGMENT);
        }

        const texture = app.renderer.generateTexture(graphics);

        for (let j=-3; j<=4;j++) {
            const sprite = PIXI.Sprite.from(texture);
            this.addChild(sprite);
            sprite.y = SIZE * j;
        }
    }

    move(tick) {
        this.y = SIZE * tick * this.direction;
    }

}