import experiments from '@/experiments';

let container: HTMLElement;
let experiment: Experiment;
let frameRequest: number;
let startTime: number;

window.addEventListener('load', () => {
    // Get elements 
    container = document.getElementById('player');

    // Add listeners
    window.addEventListener('popstate', changeExperiment);
    changeExperiment();
});

function changeExperiment() {
    cancelAnimationFrame(frameRequest);

    // Get experiment loader
    const path = window.location.pathname.replace('/', '');
    const loader = experiments[path];

    if (loader) {
        // Load experiment
        loader().then(mod => {
            init(mod.default);
        });
    }
}

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
    startTime = performance.now();
    tick();
}

function tick() {
    // Request next frame
    frameRequest = requestAnimationFrame(tick);

    // Get time and call onTick
    const time = (((performance.now() - startTime) / 1000) / experiment.duration) % 1;
    experiment.onTick(time);
}