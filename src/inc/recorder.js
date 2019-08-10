import axios from 'axios';

const SERVER = 'http://localhost:3000';
const SERVER_CLEAN = `${SERVER}/clean`;
const SERVER_GIF_ADD = `${SERVER}/gif/add`;
const SERVER_GIF_RENDER = `${SERVER}/gif/render`;

export default class Recorder {

    constructor(options) {
        this.duration = options.duration || 1;
        this.render = options.render;
        this.target = options.target;
        this.time = options.time || 0;

        this.increment = 1 / 60;
        this.framesIndex = 0;
        this.framesTarget = this.duration * 60;

        this.progressBar = document.getElementById('progress');

        this.gifButton = document.getElementById('gif');
        this.gifButton.onclick = this.record.bind(this);

        this.snap = this.snap.bind(this);
        this.tick = this.tick.bind(this);
        this.tick();
    }

    tick() {
        this.frameRequest = requestAnimationFrame(this.tick);
        this.renderTick();
    }

    renderTick() {
        this.render(this.time / this.duration);
        this.time += this.increment;
    }

    record() {
        this.gifButton.disabled = true;
        cancelAnimationFrame(this.frameRequest);

        axios.get(SERVER_CLEAN)
            .then(this.snap);
    }

    async snap() {
        if (this.framesIndex) {
            await axios.post(SERVER_GIF_ADD, {
                index: this.framesIndex,
                data: this.target.toDataURL('image/png'),
            });
        }

        this.framesIndex++;
        this.progressBar.style.width = `${100 * (this.framesIndex - 1) / this.framesTarget}vw`;

        if (this.framesIndex <= this.framesTarget) {
            this.renderTick();
            requestAnimationFrame(this.snap);

        } else {
            await axios.post(SERVER_GIF_RENDER, {
                name: PROJECT,
                delay: 1000 / 60,
                width: this.target.width,
                height: this.target.height,
            });

            this.progressBar.style.width = 0;
            this.gifButton.disabled = false;
            this.tick();
        }
    }
}