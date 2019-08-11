import * as PIXI from 'pixi.js';
import Recorder from '../inc/recorder';

const PI2 = Math.PI * 2;
const SIZE = 25;
const BORDER = 1;
const SPACING = 2;
const ROWS = 20;

const app = new PIXI.Application({
    antiAlias: true,
    width: 640,
    height: 640,
});
document.body.appendChild(app.view);

const container = new PIXI.Container();
app.stage.addChild(container);

const shape = new PIXI.Graphics();
shape.beginFill(0);
shape.moveTo(0, 0.5 * SIZE);
shape.lineTo(0.4330125 * SIZE, 0.25 * SIZE);
shape.lineTo(0.4330125 * SIZE, -0.25 * SIZE);
shape.lineTo(0, -0.5 * SIZE);
shape.lineTo(-0.4330125 * SIZE, -0.25 * SIZE);
shape.lineTo(-0.4330125 * SIZE, 0.25 * SIZE);
shape.endFill();
shape.beginFill(0xFFFFFF);
shape.moveTo(0, 0.5 * (SIZE - BORDER));
shape.lineTo(0.4330125 * (SIZE - BORDER), 0.25 * (SIZE - BORDER));
shape.lineTo(0.4330125 * (SIZE - BORDER), -0.25 * (SIZE - BORDER));
shape.lineTo(0, -0.5 * (SIZE - BORDER));
shape.lineTo(-0.4330125 * (SIZE - BORDER), -0.25 * (SIZE - BORDER));
shape.lineTo(-0.4330125 * (SIZE - BORDER), 0.25 * (SIZE - BORDER));
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
    x = (x - 2) * ((SIZE * 0.4330125) + SPACING) + app.view.width / 2;
    y = y * ((SIZE * 0.75) + SPACING) + app.view.height / 2;

    if (x <= -SIZE / 2 || x >= app.view.width + SIZE / 2 || y < -SIZE / 2 || y >= app.view.height + SIZE / 2) {
        return;
    }

    const hex = new PIXI.Container();
    container.addChild(hex);
    row.push(hex);
    hex.position.x = x;
    hex.position.y = y;

    const sprite = new PIXI.Sprite.from(texture);
    hex.addChild(sprite);
    sprite.position.x = -sprite.width / 2;
    sprite.position.y = -sprite.height / 2;
}

new Recorder({
    duration: 3.5,
    target: app.view,
    render: (tick) => {
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const alpha = 1.5 - Math.max(0.5, Math.sin(PI2 * (tick - i / rows.length) + (i % 2 ? 1 : 3)));

            for (let j = 0; j < row.length; j++) {
                let hex = row[j];
                hex.scale.x = hex.scale.y = alpha;
            }
        }
    },
});