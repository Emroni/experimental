import axios from 'axios';
import * as Controls from './controls';

const INCREMENT = 1 / 60;

export let target;

let duration;
let frameRequest;
let recordComplete;
let recordIndex;
let recordIncrement;
let recordFrames;
let render;
let time;

export function setup(options) {
    duration = options.duration || 10;
    render = options.render;
    target = options.target;

    play();
}

export function play() {
    cancelAnimationFrame(frameRequest);
    time = 0;
    tick();
}

export function record(onComplete) {
    cancelAnimationFrame(frameRequest);

    recordComplete = onComplete;
    recordIncrement = 1 / duration / Controls.fpsInput.value;
    recordIndex = -1;
    recordFrames = duration * Controls.fpsInput.value;

    snap();
}

function tick() {
    frameRequest = requestAnimationFrame(tick);
    time += INCREMENT;
    render((time / duration) % 1);
}

async function snap() {
    recordIndex++;

    if (recordIndex <= recordFrames) {
        requestAnimationFrame(snap);

        render(recordIncrement * recordIndex);
        Controls.progress(recordIndex, recordFrames);

        if (recordIndex) {
            await axios.post('http://localhost:3000/add', {
                data: target.toDataURL('image/png'),
                index: recordIndex,
                size: Controls.sizeInput.value,
            });
        }

    } else {
        recordComplete();
    }
}