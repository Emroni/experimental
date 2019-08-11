import * as PIXI from 'pixi.js';
import Recorder from '../inc/recorder';

const SIZE = 30;
const SPACING = 7;
const ROWS = 13;

const app = new PIXI.Application({
    antiAlias: true,
    width: 640,
    height: 640,
});
document.body.appendChild(app.view);

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

function add(x, y) {
    const hex = new PIXI.Sprite.from(texture);
    container.addChild(hex);
    hex.position.x = (x - 2.625) * ((SIZE * 0.4330125) + SPACING) + app.view.width / 2;
    hex.position.y = (y - 0.5) * ((SIZE * 0.75) + SPACING) + app.view.height / 2;
}

let x = 0, y = 0;
for (let i = 0; i <= ROWS; i++) {
    add(x += 2, y);
    for (let j = 0; j < i - 1; j++) add(++x, ++y);
    for (let j = 0; j < i; j++) add(--x, ++y);
    for (let j = 0; j < i; j++) add(x -= 2, y);
    for (let j = 0; j < i; j++) add(--x, --y);
    for (let j = 0; j < i; j++) add(++x, --y);
    for (let j = 0; j < i; j++) add(x += 2, y);
}

new Recorder({
    duration: 5,
    target: app.view,
    render: (tick) => {

    },
});