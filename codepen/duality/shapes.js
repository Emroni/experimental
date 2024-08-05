import { EASE, PI2, PI_HALF, SPEED } from './constants.js';

class Base extends PIXI.Container {

  constructor(color, radius, thickness, length = 1, velocity = 0) {
    super();

    this.radius = radius;
    this.length = length;
    this.velocity = velocity;

    this.mask = new PIXI.Graphics();
    this.addChild(this.mask);
    this.maskThickness = thickness + 5;

    this.shape = new PIXI.Graphics();
    this.addChild(this.shape);
    this.tickElement = this.shape;

    this.introProgress = this.introProgress.bind(this);
    this.introComplete = this.introComplete.bind(this);
    this.tick = this.tick.bind(this);
  }

  intro(index) {
    const delay = index * 0.1;
    this.progress = 0;

    TweenMax.from(this, 0.5, {
      maskThickness: 0,
      delay,
      ease: EASE,
    });

    TweenMax.from(this.scale, 3, {
      x: 0.9,
      y: 0.9,
      delay,
      ease: Back.easeInOut,
    });

    TweenMax.to(this, 3, {
      progress: Math.PI * this.length,
      delay,
      ease: EASE,
      onUpdate: this.introProgress,
      onComplete: this.introComplete,
    });

    if (this.velocity) {
      PIXI.ticker.shared.add(this.tick);
    }
  }

  introProgress() {
    this.mask.clear();
    this.mask.lineStyle(this.maskThickness, 0);
    this.mask.arc(0, 0, this.radius, -this.progress, this.progress);

    if (this.maskRounded) {
      this.mask.drawCircle(Math.sin(PI_HALF + this.progress) * this.radius, Math.cos(PI_HALF + this.progress) * this.radius, 1);
      this.mask.drawCircle(Math.sin(PI_HALF - this.progress) * this.radius, Math.cos(PI_HALF - this.progress) * this.radius, 1);
    }

    this.mask.endFill();
  }

  introComplete() {
    if (this.length === 1) {
      this.removeChild(this.mask);
      this.mask = null;
    }
  }

  tick(delta) {
    this.tickElement.rotation += this.velocity * delta * SPEED;
  }
}

export class Circle extends Base {

  constructor(color, radius, thickness, length, velocity) {
    super(color, radius, thickness, length, velocity);

    this.shape.lineStyle(thickness, color);
    this.shape.drawCircle(0, 0, radius);
    this.shape.endFill();

    this.tickElement = this.mask;
  }

}

export class Dashed extends Base {

  constructor(color, radius, thickness, dash, gap, velocity) {
    super(color, radius, thickness, 1, velocity);

    this.maskRounded = true;

    const circumference = PI2 * radius;
    const segments = Math.round(circumference / (dash + gap));
    const radiusInner = radius - thickness / 2;
    const radiusOuter = radiusInner + thickness;

    this.shape.lineStyle(dash, color);
    for (let i = 0; i < segments; i++) {
      const n = (i / segments) * PI2;
      const x = Math.sin(n);
      const y = Math.cos(n);

      this.shape.moveTo(x * radiusInner, y * radiusInner);
      this.shape.lineTo(x * radiusOuter, y * radiusOuter);
    }
    this.shape.endFill();
  }

}

export class Iterated extends Base {

  constructor(color, radius, thickness, segments, velocity, shapes) {
    super(color, radius, thickness, 1, velocity);

    this.maskRounded = true;

    const bounds = {
      left: Number.MAX_VALUE,
      right: -Number.MAX_VALUE,
    };

    shapes = shapes.split(';')
      .map(shape => {
      shape = shape.split(',');

      const data = {
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

    this.shape.lineStyle(thickness, color);
    for (let i = 0; i < segments; i++) {
      const n = (i / segments) * PI2;
      const cosN = Math.cos(n);
      const sinN = Math.sin(n);

      for (let j = 0; j < shapes.length; j++) {
        const shape = shapes[j];

        if (shape.type === 'circle') {
          this.shape.drawCircle(shape.x * cosN - shape.y * sinN, shape.y * cosN + shape.x * sinN, shape.radius);

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
    this.shape.endFill();
  }

}

export class Polygon extends Base {

  constructor(color, radius, thickness, sides, velocity) {
    super(color, radius, thickness, 1, velocity);

    const angle = PI2 / sides;

    this.shape.lineStyle(thickness, color);
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
    this.shape.endFill();

    this.maskThickness = thickness + 20;
  }

}