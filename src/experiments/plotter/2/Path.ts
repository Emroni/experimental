import { PI2 } from '@/constants';
import * as PIXI from 'pixi.js';
import { ROWS, SIZE } from '.';
import Line from './Line';

export default class Path extends PIXI.Container {

    container: PIXI.Container;

    constructor(app, container, offsetX, offsetY, rotation, angle, length) {
        super();
        container.addChild(this);

        this.x = (SIZE / 2) + (SIZE * offsetX);
        this.y = (SIZE / 2) + (SIZE * offsetY);

        this.container = new PIXI.Container();
        this.addChild(this.container);
        this.container.rotation = PI2 * (rotation / 360);

        for (let i = 0; i <= ROWS; i++) {
            const line = new Line(app, i);
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
        this.container.children.forEach((child: Path) => child.move(tick));
    }

}