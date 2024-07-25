import * as PIXI from 'pixi.js';
import SimplexNoise from 'simplex-noise';
import { ROWS, SIZE } from '.';

PIXI.utils.skipHello();

const CELL = 10;
const SEGMENT = 30;

const simplex = new SimplexNoise();

export default class Line extends PIXI.Container {

    speed: number;

    constructor(app, index) {
        super();

        this.x = CELL * index - (ROWS * CELL / 2);
        this.speed = Math.round(3 * Math.random() + 1);

        const graphics = new PIXI.Graphics();
        graphics.moveTo(0, 0);

        for (let i = 0; i < SIZE / SEGMENT; i++) {
            const noise = Math.abs(simplex.noise3D(0, i, index));
            graphics.lineStyle(Math.round(5 * Math.random()), 0xFFFFFF, noise);
            graphics.lineTo(0, i * SEGMENT);
        }

        const texture = app.renderer.generateTexture(graphics);

        for (let j = 0; j <= 5; j++) {
            const sprite = PIXI.Sprite.from(texture);
            this.addChild(sprite);
            sprite.y = -SIZE * j;
        }
    }

    move(tick) {
        this.y = SIZE * tick * this.speed;
    }

}