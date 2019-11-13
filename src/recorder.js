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
let progress;
let recordButton;
let recording;
let render;
let saveButton;
let saving;
let time;

export function init(options) {
    target = options.target;
    render = options.render;
    progress = options.progress && document.getElementById('progress');

    controls.duration = options.duration || 10;
    controls.skip = options.skip || 0;
    controls.size = target.height;

    const recorderFolder = gui.addFolder('Recorder');
    recorderFolder.open();

    recorderFolder.add(controls, 'duration', 1, 60, 1);
    recorderFolder.add(controls, 'size', 0, 1200, 20);
    recorderFolder.add(controls, 'skip', 0, 60, 0.01);
    recorderFolder.add(controls, 'play');
    recordButton = recorderFolder.add(controls, 'record');
    saveButton = recorderFolder.add(controls, 'save');

    if (options.change !== undefined) {
        recorderFolder.__controllers.forEach(controller => {
            controller.onChange(val => {
                options.change(controller.property, val);
            })
        });
    }

    if (options.controls) {
        controls.custom = options.controls;

        const customFolder = gui.addFolder('Controls');
        customFolder.open();

        Object.entries(options.controls)
            .forEach(([key, value]) => {

                if (value instanceof Object && !value.hasOwnProperty('value')) {
                    const folder = customFolder.addFolder(key);
                    folder.open();

                    const change = options.change === undefined ? undefined : () => {
                        options.change(key, controls.custom[key]);
                    };

                    if (Array.isArray(value)) {
                        value.forEach((val, index) => {
                            addControl(controls.custom[key], folder, index, val, change);
                        });

                    } else {
                        Object.entries(value)
                            .forEach(([child, val]) => {
                                addControl(controls.custom[key], folder, child, val, change);
                            });
                    }

                } else {
                    addControl(controls.custom, customFolder, key, value, options.change);
                }
            });

        if (options.change !== undefined) {
            options.change();
        }
    }

    window.addEventListener('resize', resize);
    resize();

    play();
}

function addControl(object, folder, key, value, change) {
    let control;

    if (typeof value === 'string' && value.substr(0, 1) === '#') {
        control = folder.addColor(object, key);

    } else {
        let min = 0;
        let max = (value * 10) || 100;
        let step = (value / 100) || 1;

        if (value instanceof Object) {
            min = value.min || min;
            max = value.max || max;
            step = value.step || step;
            object[key] = value.value;
        }

        control = folder.add(object, key, min, max, step);
    }

    if (change !== undefined) {
        control.onChange(val => {
            change(key, val);
        });
    }
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
    const t = controls.play ? ((((performance.now() - time) / 1000 + controls.skip) / controls.duration) % 1) : (controls.skip / controls.duration);
    render(t);

    if (progress) {
        progress.style.width = (100 * t) + '%';
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