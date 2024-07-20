import { easeInOutCubic } from '@/helpers';
import * as PIXI from 'pixi.js';
import Path from './Path';

PIXI.utils.skipHello();

export const SIZE = 640;
export const ROWS = 10;

export const app = new PIXI.Application({
    antialias: true,
    width: SIZE,
    height: SIZE,
});

new Path(app, -0.25, 0, 0.125);
new Path(app, 0.25, 0, -0.125);
new Path(app, -0.25, 0.5, 0.125);
new Path(app, 0.25, 0.5, -0.125);

export default {
    duration: 5,
    element: app.view,
    size: SIZE,
    onTick: (tick) => {
        const t = easeInOutCubic(tick * 5 % 1) * 0.2 + (Math.floor(tick / 0.2) * 0.2);
        app.stage.children.forEach((child: Path) => child.move(t));
    },
}