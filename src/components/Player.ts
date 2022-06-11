import experiments from '@/experiments';

const START_TIME = performance.now();

let container: HTMLElement;
let experiment: Experiment;

window.addEventListener('load', () => {
    // Get elements 
    container = document.getElementById('player');

    // Load experiment
    const path = window.location.pathname.replace('/', '');
    const loader = experiments[path];
    if (loader) {
        loader().then(mod => {
            init(mod.default);
        });
    }
});

function init(exp: Experiment) {
    // Merge options
    experiment = {
        duration: 10,
        ...exp,
    };

    // Add to container
    container.innerHTML = '';
    container.appendChild(experiment.element);

    // Start ticking
    tick();
}

function tick() {
    requestAnimationFrame(tick);

    // Get time and call onTick
    const time = (((performance.now() - START_TIME) / 1000) / experiment.duration) % 1;
    experiment.onTick(time);
}