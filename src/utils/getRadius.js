export const getRadius = (p1, p2, p3) => {
    const {x: x1, y: y1} = p1;
    const {x: x2, y: y2} = p2;
    const {x: x3, y: y3} = p3;

    const A = x1 * (y2 - y3) - y1 * (x2 - x3) + x2 * y3 - x3 * y2;
    const B = (x1 * x1 + y1 * y1) * (y3 - y2) + (x2 * x2 + y2 * y2) * (y1 - y3) + (x3 * x3 + y3 * y3) * (y2 - y1);
    const C = (x1 * x1 + y1 * y1) * (x2 - x3) + (x2 * x2 + y2 * y2) * (x3 - x1) + (x3 * x3 + y3 * y3) * (x1 - x2);
    const D =
        (x1 * x1 + y1 * y1) * (x3 * y2 - x2 * y3) +
        (x2 * x2 + y2 * y2) * (x1 * y3 - x3 * y1) +
        (x3 * x3 + y3 * y3) * (x2 * y1 - x1 * y2);

    return Math.sqrt((B * B + C * C - 4 * A * D) / (4 * A * A));
};

export const calculateVector = (p1, p2) => {
    return {x: p2.x - p1.x, y: p2.y - p2.x};
};
