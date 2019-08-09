import GIF from './gif';

export default class Recorder {

    constructor(options) {
        this.duration = options.duration || 1;
        this.render = options.render;
        this.target = options.target;
        this.time = options.time || 0;

        this.increment = 1 / 60;
        this.frames = [];
        this.framesTarget = this.duration * 60 - 1;

        this.progressTime = document.getElementById('progress-time');
        this.progressBar = document.getElementById('progress-bar');

        this.gifButton = document.getElementById('gif');
        this.gifButton.onclick = this.gifStart.bind(this);

        this.tick = this.tick.bind(this);
        this.tick();
    }

    tick() {
        this.render(this.time / this.duration);

        if (this.recording && this.time >= 1) {
            if (this.frames.length < this.framesTarget) {
                this.frames.push(this.target.toDataURL('image/png'));
                this.progress((this.frames.length / this.framesTarget) * 0.2, 0);
            } else {
                this.recording = false;
                this.parse();
                return;
            }
        }

        requestAnimationFrame(this.tick);
        this.time += this.increment;
    }

    gifStart() {
        this.gifButton.disabled = true;

        this.gif = new GIF({
            workers: 2,
            quality: 1,
            workerScript: '/js/gif.worker.js',
            height: this.target.height,
            width: this.target.width,
        });

        this.gif.on('progress', this.progress.bind(this));
        this.gif.on('finished', this.finished.bind(this));

        this.start = performance.now();
        this.recording = true;
    }

    parse() {
        if (this.frames.length) {
            if (this.gif) {
                const img = new Image();
                img.onload = () => {
                    this.gif.addFrame(img, {
                        delay: 1000 / 60,
                    });
                    this.parse();
                };
                img.src = this.frames.shift();
            }

        } else if (this.gif) {
            this.gif.render();
        }
    }

    progress(progress, offset = 0.2) {
        progress = (1 - offset) * progress + offset;
        this.progressBar.style.width = `${100 * progress}vw`;

        const time = Math.floor((performance.now() - this.start) / 1000);
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        this.progressTime.innerText = `${minutes}:${seconds < 10 ? 0 : ''}${seconds}`
    }

    finished(blob) {
        const a = document.createElement('a');
        a.classList.add('output');
        a.target = '_blank';
        a.href = URL.createObjectURL(blob);
        document.body.appendChild(a);

        const img = document.createElement('img');
        img.src = a.href;
        a.appendChild(img);
    }

}