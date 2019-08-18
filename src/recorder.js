import axios from 'axios';

const SERVER = 'http://localhost:3000';
const SERVER_CLEAN = `${SERVER}/clean`;
const SERVER_ADD = `${SERVER}/add`;

export default class Recorder {

    constructor(options) {
        this.duration = options.duration || 1;
        this.fps = options.fps || 30;
        this.render = options.render;
        this.target = options.target;
        this.time = options.time || 0;

        this.incrementRender = 1 / 60;
        this.incrementRecord = 1 / this.fps;

        this.framesIndex = -1;
        this.framesTarget = this.duration * this.fps;

        this.progressBar = document.getElementById('progress');

        this.gifButton = document.getElementById('record-gif');
        this.gifButton.onclick = this.record.bind(this);

        this.mp4Button = document.getElementById('record-mp4');
        this.mp4Button.onclick = this.record.bind(this);

        this.output = document.getElementById('output');
        this.outputImg = document.getElementById('output-img');
        this.outputVideo = document.getElementById('output-video');

        this.snap = this.snap.bind(this);
        this.tick = this.tick.bind(this);
        this.tick();
    }

    tick() {
        this.frameRequest = requestAnimationFrame(this.tick);
        this.renderTick(this.incrementRender);
    }

    renderTick(increment) {
        this.render((this.time / this.duration) % 1);
        this.time += increment;
    }

    record(e) {
        this.recordType = e.currentTarget.id.replace('record-', '');
        cancelAnimationFrame(this.frameRequest);

        this.gifButton.disabled = true;
        this.mp4Button.disabled = true;

        this.output.href = null;
        this.outputImg.src = null;
        this.outputImg.style.display = null;
        this.outputVideo.src = null;
        this.outputVideo.style.display = null;

        axios.get(SERVER_CLEAN)
            .then(this.snap);
    }

    async snap() {
        this.framesIndex++;
        this.progressBar.style.width = `${100 * (this.framesIndex - 1) / this.framesTarget}vw`;

        if (this.framesIndex <= this.framesTarget) {
            requestAnimationFrame(this.snap);
            this.renderTick(this.incrementRecord);

            if (this.framesIndex) {
                await axios.post(SERVER_ADD, {
                    index: this.framesIndex,
                    data: this.target.toDataURL('image/png'),
                });
            }

        } else {
            const response = await axios.post(`${SERVER}/${this.recordType}`, {
                name: PROJECT,
                fps: this.fps,
                width: this.target.width,
                height: this.target.height,
            });

            this.output.href = response.data;
            switch (this.recordType) {
                case 'gif':
                    this.outputImg.src = response.data;
                    this.outputImg.style.display = 'block';
                    break;
                case 'mp4':
                    this.outputVideo.src = response.data;
                    this.outputVideo.style.display = 'block';
                    break;
            }

            this.progressBar.style.width = 0;
            this.gifButton.disabled = false;
            this.mp4Button.disabled = false;
            this.tick();
        }
    }
}