import { PI_D2, PI_M2 } from '@/setup';
import gsap, { Back, Power2 } from 'gsap';
import * as PIXI from 'pixi.js';
import { Ticker } from 'pixi.js';

export class ShapeBase extends PIXI.Container {

    mask = new PIXI.Graphics();
    maskRounded = false;
    progress = 0;
    shape = new PIXI.Graphics();
    speed = 0.00001;

    length: number;
    maskThickness: number;
    radius: number;
    tickElement: PIXI.Graphics | null;
    velocity: number;

    constructor(radius: number, thickness: number, length = 1, velocity = 0) {
        super();

        this.radius = radius;
        this.length = length;
        this.velocity = velocity;

        this.addChild(this.mask);
        this.maskThickness = thickness + 5;

        this.addChild(this.shape);
        this.tickElement = this.shape;
    }

    intro = (index: number) => {
        const delay = index * 0.1;
        this.progress = 0;

        gsap.from(this, {
            delay,
            duration: 0.5,
            ease: Power2.easeInOut,
            maskThickness: 0,
        });

        gsap.from(this.scale, {
            delay,
            duration: 3,
            ease: Back.easeInOut,
            x: 0.9,
            y: 0.9,
        });

        gsap.to(this, {
            delay,
            duration: 3,
            ease: Power2.easeInOut,
            progress: Math.PI * this.length,
            onUpdate: this.introProgress,
        });

        if (this.velocity) {
            PIXI.Ticker.shared.add(this.tick);
        }
    }

    introProgress = () => {
        if (this.mask) {
            this.mask.clear();
            this.mask.setStrokeStyle({
                color: 0,
                width: this.maskThickness,
            });
            this.mask.arc(0, 0, this.radius, -this.progress, this.progress);

            if (this.maskRounded) {
                this.mask.circle(Math.sin(PI_D2 + this.progress) * this.radius, Math.cos(PI_D2 + this.progress) * this.radius, 1);
                this.mask.circle(Math.sin(PI_D2 - this.progress) * this.radius, Math.cos(PI_D2 - this.progress) * this.radius, 1);
            }

            this.mask.stroke();
        }
    }

    tick = (ticker: Ticker) => {
        if (this.tickElement) {
            this.tickElement.rotation += this.velocity * ticker.deltaMS * this.speed;
        }
    }
}

export class Circle extends ShapeBase {

    constructor(color: number, radius: number, thickness: number, length?: number, velocity?: number) {
        super(radius, thickness, length, velocity);

        this.shape.setStrokeStyle({
            color,
            width: thickness,
        });
        this.shape.circle(0, 0, radius);
        this.shape.stroke();

        this.tickElement = this.mask;
    }

}

export class Dashed extends ShapeBase {

    color: number;
    radius: number;
    thickness: number;
    dash: number;
    gap: number;
    velocity: number;

    constructor(color: number, radius: number, thickness: number, dash: number, gap: number, velocity: number) {
        super(radius, thickness, 1, velocity);

        this.maskRounded = true;

        const circumference = PI_M2 * radius;
        const segments = Math.round(circumference / (dash + gap));
        const radiusInner = radius - thickness / 2;
        const radiusOuter = radiusInner + thickness;

        this.shape.setStrokeStyle({
            color,
            width: dash,
        });
        for (let i = 0; i < segments; i++) {
            const n = (i / segments) * PI_M2;
            const x = Math.sin(n);
            const y = Math.cos(n);

            this.shape.moveTo(x * radiusInner, y * radiusInner);
            this.shape.lineTo(x * radiusOuter, y * radiusOuter);
        }
        this.shape.stroke();
    }

}

export class Iterated extends ShapeBase {

    constructor(color: number, radius: number, thickness: number, segments: number, velocity: number, shapesData: string) {
        super(radius, thickness, 1, velocity);

        this.maskRounded = true;

        const bounds = {
            left: Number.MAX_VALUE,
            right: -Number.MAX_VALUE,
        };

        const shapes = shapesData.split(';')
            .map(shapeData => {
                const shape = shapeData.split(',');

                const data: any = {
                    type: shape.length === 3 ? 'circle' : 'line',
                };

                if (data.type === 'circle') {
                    data.x = parseInt(shape[0]) + radius;
                    data.y = parseInt(shape[1]);
                    data.radius = parseInt(shape[2]);

                    bounds.left = Math.min(bounds.left, -data.radius);
                    bounds.right = Math.max(bounds.right, data.radius);

                } else {
                    data.x = [];
                    data.y = [];

                    for (let i = 0; i < shape.length; i++) {
                        const value = parseInt(shape[i]);
                        if (i % 2) {
                            data.x.push(value + radius);
                        } else {
                            data.y.push(value);
                        }
                    }

                    bounds.left = Math.min.apply(this, [
                        bounds.left,
                        ...data.x,
                    ]);
                    bounds.right = Math.max.apply(this, [
                        bounds.right,
                        ...data.x,
                    ]);
                }

                return data;
            });

        this.maskThickness = Math.abs(bounds.right - bounds.left) + 5;

        this.shape.setStrokeStyle({
            color,
            width: thickness,
        });
        for (let i = 0; i < segments; i++) {
            const n = (i / segments) * PI_M2;
            const cosN = Math.cos(n);
            const sinN = Math.sin(n);

            for (const shape of shapes) {
                if (shape.type === 'circle') {
                    this.shape.circle(shape.x * cosN - shape.y * sinN, shape.y * cosN + shape.x * sinN, shape.radius);

                } else {
                    for (let k = 0; k < shape.x.length; k++) {
                        const x = shape.x[k];
                        const y = shape.y[k];
                        if (k) {
                            this.shape.lineTo(x * cosN - y * sinN, y * cosN + x * sinN);
                        } else {
                            this.shape.moveTo(x * cosN - y * sinN, y * cosN + x * sinN);
                        }
                    }

                }

            }
        }
        this.shape.stroke();
    }

}

export class Polygon extends ShapeBase {

    constructor(color: number, radius: number, thickness: number, sides: number, velocity: number) {
        super(radius, thickness, 1, velocity);

        const angle = PI_M2 / sides;

        this.shape.setStrokeStyle({
            color,
            width: thickness, 
        });
        for (let i = 0; i <= sides; i++) {
            const a = i * angle;
            const x = Math.sin(a) * radius;
            const y = Math.cos(a) * radius;

            if (i) {
                this.shape.lineTo(x, y);
            } else {
                this.shape.moveTo(x, y);
            }
        }
        this.shape.stroke();

        this.maskThickness = thickness + 20;
    }

}