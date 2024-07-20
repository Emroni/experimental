// Modification of https://github.com/danro/jquery-easing/blob/master/jquery.easing.js

export function easeInOutCubic(t = 0, b = 0, c = 1, d = 1) {
    t = Math.max(0, Math.min(1, t));
    if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t + b;
    }
    t -= 2;
    return c / 2 * (t * t * t + 2) + b;
}