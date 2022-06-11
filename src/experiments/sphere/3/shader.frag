#pragma glslify: noise3D = require(glsl-noise/simplex/3d)
#define PI2 6.2831853072

precision highp float;
uniform vec3 color;
uniform float offset;
uniform float speed;
uniform float spread;
uniform float tick;
varying vec4 vPosition;

vec3 white = vec3(1.0, 1.0, 1.0);

void main() {
    float t = 2.0 * tick;
    t = t < 1.0 ? t : (2.0 - t);
    float alpha = noise3D(vec3(spread * vPosition.x, spread * vPosition.y, speed * t + offset));
    vec3 mixed = mix(color, white, max(0.0, alpha - 0.6) * 2.5);
    gl_FragColor = vec4(mixed, alpha * alpha);
}