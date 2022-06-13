import Base, { COLORS, PI2, RADIUS, Shape } from './base';

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

export default Base;