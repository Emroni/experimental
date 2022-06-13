import { easeInOutCubic } from '@/helpers';
import * as PIXI from 'pixi.js';
import SimplexNoise from 'simplex-noise';

const ROWS = 10;
const CELL = 12;
const SEGMENT = 30;
const LINE = 2;
const SIZE = 640;

const app = new PIXI.Application({
    antialias: true,
    width: SIZE,
    height: SIZE,
});

const simplex = new SimplexNoise();

class Path extends PIXI.Container {

    constructor(offsetX, offsetY, rotation) {
        super();
        app.stage.addChild(this);

        this.x = (SIZE / 2) + (SIZE * offsetX);
        this.y = (SIZE / 2) + (SIZE * offsetY);
        this.rotation = Math.PI * 2 * rotation;

        for (let i = 0; i <= ROWS; i++) {
            const line = new Line(i);
            this.addChild(line);
        }
    }

    move(tick) {
        this.children.forEach((child: Line) => child.move(tick));
    }

}

class Line extends PIXI.Container {

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

new Path(-0.25, 0, 0.125);
new Path(0.25, 0, -0.125);
new Path(-0.25, 0.5, 0.125);
new Path(0.25, 0.5, -0.125);

export default {
    duration: 5,
    element: app.view,
    onTick: (tick) => {
        const t = easeInOutCubic(tick * 5 % 1) * 0.2 + (Math.floor(tick / 0.2) * 0.2);
        app.stage.children.forEach((child: Path) => child.move(t));
    },
}