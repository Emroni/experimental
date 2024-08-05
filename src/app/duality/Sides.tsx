import { BLACK, PI_D2, WHITE } from '@/setup';
import * as PIXI from 'pixi.js';
import { Circle, Dashed, Iterated, Polygon, ShapeBase } from './Shapes';

class SideBase extends PIXI.Container {

    background = new PIXI.Graphics();
    shapes = new PIXI.Container<ShapeBase>();
    size = 1920;

    constructor(primary: number, secondary: number, offset: number) {
        super();

        const center = this.size / 2;

        // Add background
        this.addChild(this.background);
        this.background.clear();
        this.background.rect(offset * (center), 0, center, this.size);
        this.background.fill(primary);

        // Add shapes container
        this.addChild(this.shapes);
        this.shapes.x = Math.round(center);
        this.shapes.y = Math.round(center);

        // Add shapes mask
        const mask = new PIXI.Graphics();
        this.shapes.mask = mask;
        mask.clear();
        mask.rect(offset * (center), 0, center, this.size);
        mask.fill(0);

        // Add shapes
        this.add(new Dashed(secondary, 130, 0.5, 2, 5, 1));
        this.add(new Dashed(secondary, 160, 3, 3, 100, -5));
        this.add(new Dashed(secondary, 260, 0.5, 2, 5, -1));
        this.add(new Circle(secondary, 280, 1));
        this.add(new Dashed(secondary, 290, 10, 1, 15, 3));
        this.add(new Circle(secondary, 300, 1));
        this.add(new Circle(secondary, 270, 2, 0.3, 20));
        this.add(new Circle(secondary, 310, 2, 0.4, -30));
        this.add(new Dashed(secondary, 390, 3, 3, 118, 4));
        this.add(new Dashed(secondary, 470, 2, 2, 15, 3));
        this.add(new Dashed(secondary, 480, 2, 2, 7, -2));
        this.add(new Circle(secondary, 490, 2));
        this.add(new Circle(secondary, 555, 1));
        this.add(new Dashed(secondary, 570, 25, 2, 100, -5));
        this.add(new Circle(secondary, 585, 1));
        this.add(new Dashed(secondary, 600, 2, 2, 7, 6));
        this.add(new Circle(secondary, 625, 2, 0.3, -40));
        this.add(new Circle(secondary, 655, 2, 0.4, 30));
        this.add(new Circle(secondary, 710, 2));
        this.add(new Circle(secondary, 871, 1));
        this.add(new Circle(secondary, 890, 1));
    }

    add = (shape: ShapeBase) => {
        this.shapes.addChild(shape);
        shape.rotation = this.shapes.children.length % 2 ? PI_D2 : -PI_D2;
    }

    intro = () => {
        for (const shape of this.shapes.children) {
            shape.intro(shape.radius / 890 * this.shapes.children.length);
        }
    }
}

export class BlackSide extends SideBase {

    constructor() {
        super(BLACK, WHITE, 0);

        this.add(new Polygon(WHITE, 80, 0.5, 8, -5));
        this.add(new Polygon(WHITE, 95, 1, 8, -5));
        this.add(new Polygon(WHITE, 100, 0.5, 8, -5));
        this.add(new Iterated(WHITE, 210, 1, 12, 15, '-5,-10,-5,10,8,0,-5,-10'));
        this.add(new Iterated(WHITE, 390, 1, 14, -3, '-40,0,-20,-35,20,-35,40,0,20,35,-20,35,-40,0'));
        this.add(new Iterated(WHITE, 520, 1, 50, 5, '-5,-5,5,5;-5,5,5,-5'));
        this.add(new Iterated(WHITE, 640, 1, 260, 4, '-10,0,0,-10,10,0,0,10,-10,0'));
        this.add(new Polygon(WHITE, 690, 2, 20, -5));
        this.add(new Polygon(WHITE, 695, 0.5, 20, -5));
        this.add(new Iterated(WHITE, 787, 1, 100, -2, '0,50,-3,-50,3,-50,0,50'));

        this.intro();
    }

}

export class WhiteSide extends SideBase {

    constructor() {
        super(WHITE, BLACK, 1);

        this.add(new Circle(BLACK, 80, 0.5));
        this.add(new Circle(BLACK, 95, 1));
        this.add(new Circle(BLACK, 100, 0.5));
        this.add(new Iterated(BLACK, 210, 1, 12, 15, '0,0,10'));
        this.add(new Iterated(BLACK, 390, 1, 14, -3, '0,0,40'));
        this.add(new Iterated(BLACK, 520, 1, 50, 5, '0,-6,0,6;-6,0,6,0'));
        this.add(new Iterated(BLACK, 640, 1, 260, 4, '0,0,10'));
        this.add(new Circle(BLACK, 690, 2));
        this.add(new Circle(BLACK, 695, 0.5));
        this.add(new Iterated(BLACK, 787, 1, 100, -2, '0,-50,0,50'));

        this.intro();
    }

}