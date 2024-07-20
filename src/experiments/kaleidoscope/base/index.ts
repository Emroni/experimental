import * as PIXI from 'pixi.js';
import Container from './Container';
import Shape from './Shape';

PIXI.utils.skipHello();

export { default as Shape } from './Shape';

export const SIZE = 640;
export const SIZE_HALF = SIZE / 2;
export const RADIUS = Math.sqrt(SIZE_HALF * SIZE_HALF + SIZE_HALF * SIZE_HALF);
export const WEDGES = 16;

export const COLORS = [
    0xf44336,
    0xe91e63,
    0x9c27b0,
    0x673ab7,
    0x3f51b5,
    0x2196f3,
    0x03a9f4,
    0x03a9f4,
    0x00bcd4,
    0x009688,
    0x4caf50,
    0x8bc34a,
    0xcddc39,
    0xffeb3b,
    0xffc107,
    0xff9800,
];

export const app = new PIXI.Application({
    antialias: true,
    width: SIZE,
    height: SIZE,
});

export const main = new Container();
app.stage.addChild(main);

export const mirror = new Container(true);
app.stage.addChild(mirror);

export default {
    duration: 10,
    element: app.view,
    size: SIZE,
    onTick: (tick) => {
        main.children.forEach((child: Shape) => child.move(tick));
    },
}
