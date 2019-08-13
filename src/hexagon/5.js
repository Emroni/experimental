import * as PIXI from 'pixi.js';
import Recorder from '../recorder';

const PI2 = Math.PI * 2;
const SIZE = 25;
const SPACING = 2;
const ROWS = 20;

const app = new PIXI.Application({
    antiAlias: true,
    width: 540,
    height: 540,
});
document.body.appendChild(app.view);

const container = new PIXI.Container();
app.stage.addChild(container);

const textures = [
    draw(0xc62828),
    draw(0x00e575),
    draw(0x00acc1),
];

function draw(color) {
    const shape = new PIXI.Graphics();
    shape.beginFill(color);
    shape.moveTo(0, 0.5 * SIZE);
    shape.lineTo(0.4330125 * SIZE, 0.25 * SIZE);
    shape.lineTo(0.4330125 * SIZE, -0.25 * SIZE);
    shape.lineTo(0, -0.5 * SIZE);
    shape.lineTo(-0.4330125 * SIZE, -0.25 * SIZE);
    shape.lineTo(-0.4330125 * SIZE, 0.25 * SIZE);
    shape.endFill();
    return app.renderer.generateTexture(shape);
}

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

    for (let i=0; i<textures.length;i++) {
        const sprite = new PIXI.Sprite.from(textures[i]);
        hex.addChild(sprite);
        sprite.position.x = -sprite.width / 2;
        sprite.position.y = -sprite.height / 2;
    }
}

new Recorder({
    duration: 5,
    target: app.view,
    render: (tick) => {
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const alpha = PI2 * (tick - i / rows.length);
            const alphas = [
                Math.max(0, Math.sin(alpha)),
                Math.max(0, Math.sin(2 * alpha)),
                Math.max(0, Math.sin(3 * alpha)),
            ];
            const beta = 0.5 * Math.abs(Math.sin(PI2 * (tick - i / rows.length))) + 0.5;

            for (let j = 0; j < row.length; j++) {
                let hex = row[j];
                hex.scale.x = hex.scale.y = beta;

                for (let k=0;k<alphas.length;k++) {
                    hex.children[k].alpha = alphas[k];
                }
            }
        }
    },
});