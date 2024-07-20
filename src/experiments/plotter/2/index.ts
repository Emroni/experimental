import { easeInOutCubic } from '@/helpers';
import * as Filters from 'pixi-filters';
import * as PIXI from 'pixi.js';
import Path from './Path';

export const ROWS = 20;
export const SIZE = 1280;

const app = new PIXI.Application({
    antialias: true,
    width: SIZE,
    height: SIZE,
});

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

new Path(app, container, 0.01, -0.06, -60, 60, 0.8);
new Path(app, container, 0.131, 0.24, 60, -60, 0.557);
new Path(app, container, -0.19, 0.285, 120, 60, 0.4);
new Path(app, container, -0.39, -0.06, -180, 60, 0.4);
new Path(app, container, -0.07, -0.105, -120, 0, 0.8);
new Path(app, container, 0.01, -0.005, -180, 60, 0.7);

export default {
    duration: 10,
    element: app.view,
    size: SIZE,
    onTick: (tick) => {
        const t = easeInOutCubic(tick * 5 % 1) * 0.2 + (Math.floor(tick / 0.2) * 0.2);
        container.children.forEach((child: Path) => child.move(t));
    },
}