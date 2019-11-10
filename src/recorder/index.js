import axios from 'axios';
import * as Controls from './controls';

export let target;

let delay;
let duration;
let frameRequest;
let recordComplete;
let recordFrames;
let recordIncrement;
let recordIndex;
let render;
let skip;
let time;

export function setup(options) {
    delay = options.delay || 0;
    duration = options.duration || 10;
    render = options.render;
    skip = options.skip || 0;
    target = options.target;

    window.addEventListener('resize', resize);
    resize();

    play();
}

function resize() {
    const scale = Math.min(1, (window.innerWidth - 20) / target.width, (window.innerHeight - 100) / target.height);
    target.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

export function play() {
    cancelAnimationFrame(frameRequest);
    time = performance.now();
    tick();
}

export function record(onComplete) {
    cancelAnimationFrame(frameRequest);

    recordComplete = onComplete;
    recordIncrement = 1 / duration / Controls.fpsInput.value;
    recordIndex = -1 - delay * Controls.fpsInput.value;
    recordFrames = duration * Controls.fpsInput.value;

    snap();
}

function tick() {
    frameRequest = requestAnimationFrame(tick);
    const t = (((performance.now() - time) / 1000) / duration) % 1;
    render(t, t * duration);
}

async function snap() {
    recordIndex++;

    if (recordIndex < recordFrames) {
        const t = (recordIncrement * (recordIndex + skip * Controls.fpsInput.value)) % 1;
        render(t, t * duration);

        if (recordIndex < 0) {
            requestAnimationFrame(snap);

        } else {
            Controls.progress(recordIndex, recordFrames);

            const size = parseInt(Controls.sizeInput.value);
            await axios.post('http://localhost:3000/add', {
                data: target.toDataURL('image/png'),
                index: recordIndex,
                resize: target.width !== size,
                size,
            });

            snap();
        }

    } else {
        recordComplete();
    }
}