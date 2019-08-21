import axios from 'axios';
import * as Output from './output';
import * as Recorder from './index';

const element = document.createElement('div');
document.body.appendChild(element);
element.classList.add('controls');

export const fpsInput = document.createElement('input');
element.appendChild(fpsInput);
fpsInput.type = 'number';
fpsInput.value = localStorage.getItem('fps') || 60;
fpsInput.addEventListener('input', () => {
    localStorage.setItem('fps', fpsInput.value);
});

export const sizeInput = document.createElement('input');
element.appendChild(sizeInput);
sizeInput.type = 'number';
sizeInput.value = localStorage.getItem('size') || 640;
sizeInput.addEventListener('input', () => {
    localStorage.setItem('size', sizeInput.value);
});

const recordButton = document.createElement('button');
element.appendChild(recordButton);
recordButton.innerText = 'record';
recordButton.addEventListener('click', record);

const gifButton = document.createElement('button');
element.appendChild(gifButton);
gifButton.innerText = 'gif';
gifButton.addEventListener('click', create);

const mp4Button = document.createElement('button');
element.appendChild(mp4Button);
mp4Button.innerText = 'mp4';
mp4Button.addEventListener('click', create);

const progressBar = document.createElement('div');
element.appendChild(progressBar);
progressBar.classList.add('progress');

function toggle(value) {
    fpsInput.disabled = value;
    recordButton.disabled = value;
    sizeInput.disabled = value;
    gifButton.disabled = value;
    mp4Button.disabled = value;

    recordButton.innerHTML = 'record';
    progressBar.style.width = 0;
    document.body.classList[value ? 'add' : 'remove']('loading');

    Output.clear();
}

function record() {
    toggle(true);

    axios.post('http://localhost:3000/clean', {
            name: PROJECT,
        })
        .then(() => {
            Recorder.record(recorded);
        });
}

function recorded() {
    toggle(false);

    Recorder.play();
}

export function progress(value, target) {
    recordButton.innerText = `${value}/${target}`;
    progressBar.style.width = `${100 * (value / target)}vw`;
}

async function create(e) {
    toggle(true);

    const response = await axios.post(`http://localhost:3000/${e.target.innerText}`, {
        name: PROJECT,
        fps: fpsInput.value,
        size: sizeInput.value,
    });

    toggle(false);

    Output.show(response.data);
}