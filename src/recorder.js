import axios from 'axios';
import * as dat from 'dat.gui';

export const gui = new dat.GUI();

export const controls = {
    play: true,
    record,
    save,
};

export let target;

let frameRequest;
let render;
let recording;
let recordButton;
let saveButton;
let saving;
let time;

export function init(options) {
    target = options.target;
    render = options.render;

    controls.duration = options.duration || 10;
    controls.skip = options.skip || 0;
    controls.size = target.height;

    const recorderFolder = gui.addFolder('Recorder');
    recorderFolder.add(controls, 'duration', 1, 60, 1);
    recorderFolder.add(controls, 'size', 0, 1200, 20);
    recorderFolder.add(controls, 'skip', 0, 60, 0.01);
    recorderFolder.add(controls, 'play');
    recordButton = recorderFolder.add(controls, 'record');
    saveButton = recorderFolder.add(controls, 'save');

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

function tick() {
    frameRequest = requestAnimationFrame(tick);
    if (controls.play) {
        const t = (((performance.now() - time) / 1000 + controls.skip) / controls.duration) % 1;
        render(t);

    } else {
        render(controls.skip / controls.duration);
    }
}

function record() {
    cancelAnimationFrame(frameRequest);

    if (recording) {
        recordButton.name('record');
        recording = null;
        play();

    } else {
        if (saving) {
            save();
        }

        recording = {
            increment: 1 / controls.duration / 60,
            index: -1,
            frames: controls.duration * 60,
            skip: controls.skip * 60,
        };

        axios.post('http://localhost:3000/clean')
            .then(snap)
            .catch(e => {
                console.error(e.message);
                record();
            });
    }
}

function snap() {
    if (recording) {
        recording.index++;

        recordButton.name(`${recording.index}/${recording.frames}`);

        if (recording.index < recording.frames) {
            const t = (recording.increment * (recording.index + recording.skip)) % 1;
            render(t);

            if (recording.index < 0) {
                requestAnimationFrame(snap);

            } else {
                axios.post('http://localhost:3000/add', {
                        data: target.toDataURL('image/png'),
                        index: recording.index,
                    })
                    .then(snap)
                    .catch(e => {
                        console.error(e.message);
                        record();
                    });
            }

        } else {
            record();
        }
    }
}

function save() {
    if (saving) {
        saveButton.name('save');
        saving.source.cancel('Cancel save');
        saving = null;

    } else {
        if (recording) {
            record();
        }

        saveButton.name('saving');

        saving = {
            source: axios.CancelToken.source(),
        };

        saving.post = axios.post('http://localhost:3000/save', {
                name: PROJECT,
                size: controls.size,
            }, {
                cancelToken: saving.source.token,
            })
            .then(response => {
                saveButton.name('save');
                saving = null;
                window.open(response.data.file);
            })
            .catch(e => {
                console.error(e.message);
                saveButton.name('save');
                saving = null;
            });
    }
}