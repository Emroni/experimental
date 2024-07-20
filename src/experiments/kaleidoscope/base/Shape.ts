import * as PIXI from 'pixi.js';
import { app, main, mirror } from '.';

PIXI.utils.skipHello();

export default class Shape extends PIXI.Container {

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