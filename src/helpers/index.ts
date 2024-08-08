// Modification of https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
export function easeInOutCubic(t = 0, b = 0, c = 1, d = 1) {
    t = Math.max(0, Math.min(1, t));
    if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t + b;
    }
    t -= 2;
    return c / 2 * (t * t * t + 2) + b;
}

export function hslToHex(h: number, s: number, l: number) {
    const d = l / 100;
    const a = (s * Math.min(d, 1 - d)) / 100;

    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = d - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };

    return `#${f(0)}${f(8)}${f(4)}`;
}