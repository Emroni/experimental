import * as PIXI from 'pixi.js';
import SimplexNoise from 'simplex-noise';
import * as Recorder from '../recorder';

const ROWS = 10;
const CELL = 12;
const SEGMENT = 30;
const LINE = 2;
const SIZE = 640;

const app = new PIXI.Application({
    antiAlias: true,
    width: SIZE,
    height: SIZE,
});
document.body.appendChild(app.view);

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
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].move(tick);
        }
    }

}

class Line extends PIXI.Container {

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
            const sprite = new PIXI.Sprite.from(texture);
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

function ease(t, b = 0, c = 1, d = 1) {
    t = Math.max(0, Math.min(1, t));
    if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t + b;
    }
    return c / 2 * ((t -= 2) * t * t + 2) + b;
}

Recorder.setup({
    duration: 5,
    target: app.view,
    render: (tick) => {
        const t = ease(tick * 5 % 1) * 0.2 + (Math.floor(tick / 0.2) * 0.2);
        for (let i = 0; i < app.stage.children.length; i++) {
            app.stage.children[i].move(t);
        }
    },
});