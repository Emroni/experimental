import * as PIXI from 'pixi.js';

export const PI2 = Math.PI * 2;
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

class Container extends PIXI.Container {

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

export const main = new Container();
app.stage.addChild(main);

export const mirror = new Container(true);
app.stage.addChild(mirror);

export class Shape extends PIXI.Container {

    spriteMain: PIXI.Sprite
    spriteMirror: PIXI.Sprite
    texture: PIXI.RenderTexture;
    onMove: (time: number, spriteMain: PIXI.Sprite) => void;

    constructor(draw, onMove) {
        super();

        this.onMove = onMove;

        main.addChild(this);

        const graph = new PIXI.Graphics();
        draw(graph);

        this.texture = app.renderer.generateTexture(graph);
        this.spriteMain = PIXI.Sprite.from(this.texture);
        this.addChild(this.spriteMain);
        this.spriteMain.pivot.x = this.spriteMain.width / 2;
        this.spriteMain.pivot.y = this.spriteMain.height / 2;

        this.spriteMirror = PIXI.Sprite.from(this.texture);
        mirror.addChild(this.spriteMirror);
        this.spriteMirror.pivot.x = this.spriteMain.pivot.x;
        this.spriteMirror.pivot.y = this.spriteMain.pivot.y;
    }

    move(tick) {
        this.onMove(tick, this.spriteMain);
        this.spriteMirror.x = this.spriteMain.x;
        this.spriteMirror.y = this.spriteMain.y;
        this.spriteMirror.rotation = this.spriteMain.rotation;
        this.spriteMirror.scale.x = this.spriteMain.scale.x;
        this.spriteMirror.scale.y = this.spriteMain.scale.y;
    }
}


export default {
    duration: 10,
    element: app.view,
    onTick: (tick) => {
        main.children.forEach((child: Shape) => child.move(tick));
    },
}
