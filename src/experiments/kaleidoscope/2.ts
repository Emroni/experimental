import Base, { Shape, COLORS, PI2, RADIUS, WEDGES } from './base';

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

for (let i = 0; i < COLORS.length; i+=2) {
    const layer = i / COLORS.length;
    const direction = i % 2 ? 1 : -1;
    const speed = (i % 2) + 1;

    const count = WEDGES * 2;
    const size = (RADIUS * PI2) / count / 3;

    for (let j=0; j <count;j++) {
        new Shape(graph => {
            graph.beginFill(COLORS[i + (j % 2)]);
            graph.drawRect(0, 0, size, size);
            graph.endFill();

        }, (tick, shape) => {
            const n = ((tick + layer) * speed) % 1;
            const r = (RADIUS + size) * Math.pow(n, 5);
            const alpha = PI2 * (j / count + tick);
            shape.x = r * Math.sin(alpha);
            shape.y = r * Math.cos(alpha);
            shape.rotation = PI2 * tick * speed * 5 * direction;
            shape.scale.x = shape.scale.y = Math.min(1, n);
        });
    }
}

for (let i = 0; i < COLORS.length; i+=2) {
    const layer = (i + 1) / COLORS.length;
    const direction = i % 2 ? -1 : 1;
    const speed = ((i % 2) + 1) * 2;
    const count = WEDGES * 3;
    const size = (RADIUS * PI2) / count / 2;

    for (let j=0; j <count;j++) {
        new Shape(graph => {
            graph.beginFill(COLORS[(i + ((j + 1) % 2) + Math.floor(COLORS.length / 2)) % COLORS.length]);
            graph.moveTo(0, 0);
            graph.lineTo(size, size / 2);
            graph.lineTo(0, size);
            graph.lineTo(0, 0);
            graph.endFill();

        }, (tick, shape) => {
            const n = ((tick + layer) * speed) % 1;
            const r = (RADIUS + size) * Math.pow(n, 5);
            const alpha = PI2 * (j / count + tick);
            shape.x = r * Math.sin(alpha);
            shape.y = r * Math.cos(alpha);
            shape.rotation = PI2 * tick * speed * direction;
            shape.scale.x = shape.scale.y = Math.min(1, n);
        });
    }
}

export default Base;