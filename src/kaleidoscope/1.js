import { Shape, PI2, RADIUS } from './base';

const COLORS = [
    0xf44336,
    0xe91e63,
    0x9c27b0,
    0x9673ab7,
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
    0xff5722,
    0x795548,
];

for (let i = 0; i < COLORS.length; i++) {
    const layer = i / COLORS.length;
    const direction = i % 2 ? 1 : -1;
    const speed = (i % 2) + 1;

    new Shape(graph => {
        const count = Math.ceil(30 * layer) + 20;
        const size = (RADIUS * PI2) / count;
        const radius = RADIUS + size / 2;

        graph.beginFill(COLORS[i]);
        for (let i = 0; i < count; i++) {
            const alpha = PI2 * (i / count);
            const x = radius * Math.sin(alpha);
            const y = radius * Math.cos(alpha);
            graph.drawCircle(x, y, size / 2);
        }
        graph.endFill();

    }, (tick, shape) => {
        shape.rotation = PI2 * tick * direction;
        shape.scale.x = shape.scale.y = Math.pow((speed * tick + layer * 5) % 1, 3);
    });
}

