import { PI2 } from '@/constants';
import * as PIXI from 'pixi.js';
import { RADIUS, SIZE_HALF, WEDGES } from '.';

PIXI.utils.skipHello();

export default class Container extends PIXI.Container {

    constructor(mirrored = false) {
        super();
        this.x = SIZE_HALF;
        this.y = SIZE_HALF;
        this.scale.x = mirrored ? -1 : 1;

        const mask = new PIXI.Graphics();
        this.mask = mask;
        for (let i = mirrored ? 1 : 0; i < WEDGES; i += 2) {
            mask.beginFill(0);
            mask.moveTo(SIZE_HALF, SIZE_HALF);
            mask.lineTo(RADIUS * Math.cos(PI2 * (i / WEDGES)) + SIZE_HALF, RADIUS * Math.sin(PI2 * (i / WEDGES)) + SIZE_HALF);
            mask.lineTo(RADIUS * Math.cos(PI2 * ((i + 1) / WEDGES)) + SIZE_HALF, RADIUS * Math.sin(PI2 * ((i + 1) / WEDGES)) + SIZE_HALF);
            mask.lineTo(SIZE_HALF, SIZE_HALF);
            mask.endFill();
        }
    }
}