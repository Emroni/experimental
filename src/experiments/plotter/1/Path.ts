import * as PIXI from 'pixi.js';
import { ROWS, SIZE } from '.';
import Line from './Line';

export default class Path extends PIXI.Container {

    constructor(app, offsetX, offsetY, rotation) {
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