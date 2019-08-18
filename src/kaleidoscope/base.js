import * as PIXI from 'pixi.js';
import Recorder from '../recorder';

export const PI2 = Math.PI * 2;
export const SIZE = 640;
export const SIZE_HALF = SIZE / 2;
export const RADIUS = Math.sqrt(SIZE_HALF * SIZE_HALF + SIZE_HALF * SIZE_HALF);
export const WEDGES = 16;

const app = new PIXI.Application({
    antiAlias: true,
    width: SIZE,
    height: SIZE,
});
document.body.appendChild(app.view);

class Container extends PIXI.Container {
    constructor(mirrored) {
        super();
        this.x = SIZE_HALF;
        this.y = SIZE_HALF;
        this.scale.x = mirrored ? -1 : 1;

        this.mask = new PIXI.Graphics();
        for (let i = mirrored ? 1 : 0; i < WEDGES; i += 2) {
            this.mask.beginFill(0);
            this.mask.moveTo(SIZE_HALF, SIZE_HALF);
            this.mask.lineTo(RADIUS * Math.cos(PI2 * (i / WEDGES)) + SIZE_HALF, RADIUS * Math.sin(PI2 * (i / WEDGES)) + SIZE_HALF);
            this.mask.lineTo(RADIUS * Math.cos(PI2 * ((i + 1) / WEDGES)) + SIZE_HALF, RADIUS * Math.sin(PI2 * ((i + 1) / WEDGES)) + SIZE_HALF);
            this.mask.lineTo(SIZE_HALF, SIZE_HALF);
            this.mask.endFill();
        }
    }
}

const main = new Container();
app.stage.addChild(main);

const mirror = new Container(true);
app.stage.addChild(mirror);

export class Shape extends PIXI.Container {
    constructor(draw, onMove) {
        super();

        this.onMove = onMove;

        main.addChild(this);

        const graph = new PIXI.Graphics();
        draw(graph);

        this.texture = app.renderer.generateTexture(graph);
        this.spriteMain = new PIXI.Sprite.from(this.texture);
        this.addChild(this.spriteMain);
        this.spriteMain.pivot.x = this.spriteMain.width / 2;
        this.spriteMain.pivot.y = this.spriteMain.height / 2;

        this.spriteMirror = new PIXI.Sprite.from(this.texture);
        mirror.addChild(this.spriteMirror);
        this.spriteMirror.pivot.x = this.spriteMain.pivot.x;
        this.spriteMirror.pivot.y = this.spriteMain.pivot.y;
    }

    move(tick) {
        this.onMove(tick, this.spriteMain);
        this.spriteMirror.rotation = this.spriteMain.rotation;
        this.spriteMirror.scale.x = this.spriteMain.scale.x;
        this.spriteMirror.scale.y = this.spriteMain.scale.y;
    }
}


new Recorder({
    duration: 10,
    target: app.view,
    render: (tick) => {
        for (let i = 0; i < main.children.length; i++) {
            const mainChild = main.children[i];
            mainChild.move(tick);
        }
    },
});
