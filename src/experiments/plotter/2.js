import * as PIXI from 'pixi.js';
import * as Filters from 'pixi-filters';
import SimplexNoise from 'simplex-noise';
import * as Recorder from '../recorder';

const ROWS = 20;
const CELL = 10;
const SEGMENT = 30;
const SIZE = 1280;
const PI2 = 2 * Math.PI;

const app = new PIXI.Application({
    antiAlias: true,
    width: SIZE,
    height: SIZE,
});
document.body.appendChild(app.view);

const bg = new PIXI.Graphics();
bg.beginFill(0x0E0E0E);
bg.drawRect(0, 0, SIZE, SIZE);
bg.beginFill(0);
bg.drawCircle(SIZE / 2, SIZE / 2, SIZE / 2);
bg.endFill();
app.stage.addChild(bg);
bg.filters = [
    new Filters.TiltShiftFilter(100, 100),
];

const container = new PIXI.Container();
app.stage.addChild(container);

container.filters = [
    new Filters.DotFilter(0.1),
    new Filters.AdvancedBloomFilter(),
    new Filters.TiltShiftFilter(4),
];

const simplex = new SimplexNoise();

class Path extends PIXI.Container {

    constructor(offsetX, offsetY, rotation, angle, length) {
        super();
        container.addChild(this);

        this.x = (SIZE / 2) + (SIZE * offsetX);
        this.y = (SIZE / 2) + (SIZE * offsetY);

        this.container = new PIXI.Container();
        this.addChild(this.container);
        this.container.rotation = PI2 * (rotation / 360);

        for (let i = 0; i <= ROWS; i++) {
            const line = new Line(i);
            this.container.addChild(line);
        }

        const width = SIZE * length;
        const mask = new PIXI.Graphics();
        this.addChild(mask);
        this.container.mask = mask;
        mask.rotation = PI2 * (angle / 360);
        mask.beginFill(0xFF0000);
        mask.moveTo(-width / 2, -SIZE);
        mask.lineTo(width / 2, -SIZE);
        mask.lineTo(width / 2, SIZE);
        mask.lineTo(-width / 2, SIZE);
        mask.lineTo(-width / 2, -SIZE);
        mask.endFill();
    }

    move(tick) {
        for (let i = 0; i < this.container.children.length; i++) {
            this.container.children[i].move(tick);
        }
    }

}

class Line extends PIXI.Container {

    constructor(index) {
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
            const sprite = new PIXI.Sprite.from(texture);
            this.addChild(sprite);
            sprite.y = -SIZE * j;
        }
    }

    move(tick) {
        this.y = SIZE * tick * this.speed;
    }

}

new Path(0.01, -0.06, -60, 60, 0.8);
new Path(0.131, 0.24, 60, -60, 0.557);
new Path(-0.19, 0.285, 120, 60, 0.4);
new Path(-0.39, -0.06, -180, 60, 0.4);
new Path(-0.07, -0.105, -120, 0, 0.8);
new Path(0.01, -0.005, -180, 60, 0.7);

function ease(t, b = 0, c = 1, d = 1) {
    t = Math.max(0, Math.min(1, t));
    if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t + b;
    }
    return c / 2 * ((t -= 2) * t * t + 2) + b;
}

Recorder.init({
    duration: 10,
    target: app.view,
    render: (tick) => {
        const t = ease(tick * 5 % 1) * 0.2 + (Math.floor(tick / 0.2) * 0.2);
        for (let i = 0; i < container.children.length; i++) {
            container.children[i].move(t);
        }
    },
});