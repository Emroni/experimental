import * as PIXI from 'pixi.js';

const PI2 = Math.PI * 2;
const SIZE = 30;
const SPACING = 5;
const ROWS = 14;

const app = new PIXI.Application({
    antialias: true,
    width: 640,
    height: 640,
});

const container = new PIXI.Container();
app.stage.addChild(container);

const shape = new PIXI.Graphics();
shape.beginFill(0xFFFFFF);
shape.moveTo(0, 0.5 * SIZE);
shape.lineTo(0.4330125 * SIZE, 0.25 * SIZE);
shape.lineTo(0.4330125 * SIZE, -0.25 * SIZE);
shape.lineTo(0, -0.5 * SIZE);
shape.lineTo(-0.4330125 * SIZE, -0.25 * SIZE);
shape.lineTo(-0.4330125 * SIZE, 0.25 * SIZE);
shape.endFill();
const texture = app.renderer.generateTexture(shape);

const rows = [];
let x = 0, y = 0;
for (let i = 0; i <= ROWS; i++) {
    const row = [];
    rows.push(row);

    add(row, x += 2, y);
    for (let j = 0; j < i - 1; j++) add(row, ++x, ++y);
    for (let j = 0; j < i; j++) add(row, --x, ++y);
    for (let j = 0; j < i; j++) add(row, x -= 2, y);
    for (let j = 0; j < i; j++) add(row, --x, --y);
    for (let j = 0; j < i; j++) add(row, ++x, --y);
    for (let j = 0; j < i; j++) add(row, x += 2, y);
}

function add(row, x, y) {
    x = (x - 2.625) * ((SIZE * 0.4330125) + SPACING) + app.view.width / 2;
    y = (y - 0.55) * ((SIZE * 0.75) + SPACING) + app.view.height / 2;

    if (x <= -SIZE || x >= app.view.width || y < -SIZE || y >= app.view.height) {
        return;
    }

    const hex = PIXI.Sprite.from(texture);
    container.addChild(hex);
    row.push(hex);

    hex.position.x = x;
    hex.position.y = y;
}

export default {
    duration: 5,
    element: app.view,
    size: SIZE,
    onTick: (tick) => {
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const alpha = Math.abs(Math.sin(PI2 * (tick - i / rows.length)));

            for (let j = 0; j < row.length; j++) {
                let hex = row[j];
                hex.alpha = alpha;
            }
        }
    },
}