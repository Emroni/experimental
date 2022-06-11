import experiments from '@/experiments';

const START_TIME = performance.now();

let experiment: Experiment;

window.addEventListener('load', () => {
    const path = window.location.pathname.replace('/', '');
    const loader = experiments[path];

    if (loader) {
        loader().then(mod => {
            init(mod.default);
        });
    }
});

function init(exp: Experiment) {
    experiment = {
        duration: 10,
        ...exp,
    };

    document.body.innerHTML = '';
    document.body.appendChild(experiment.element);

    tick();
}

function tick() {
    requestAnimationFrame(tick);
    const time = (((performance.now() - START_TIME) / 1000) / experiment.duration) % 1;
    experiment.onTick(time);
}