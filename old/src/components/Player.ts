import experiments from '@/experiments';

let container: HTMLElement;
let experiment: Experiment;
let frameRequest: number;
let startTime: number;

window.addEventListener('load', () => {
    // Get elements 
    container = document.getElementById('player');

    // Get experiment loader
    const path = window.location.pathname.replace('/', '');
    const loader = experiments[path];

    if (loader) {
        // Load experiment
        loader().then(mod => {
            // Merge options
            experiment = {
                duration: 10,
                ...mod.default,
            };

            // Add to container
            container.appendChild(experiment.element);
    
            // Add listeners
            window.addEventListener('resize', handleResize);
            handleResize();

            // Start ticking
            startTime = performance.now();
            tick();
        });
    }
});

function handleResize() {
    // Get scale
    const rect = container.getBoundingClientRect();
    const scale = Math.min(experiment.size, rect.width, rect.height) / experiment.size;

    // Scale experiment element down if needed
    experiment.element.style.transform = scale < 1 ? `scale(${scale})` : '';
}

function tick() {
    // Request next frame
    frameRequest = requestAnimationFrame(tick);

    // Get time and call onTick
    const time = (((performance.now() - startTime) / 1000) / experiment.duration) % 1;
    experiment.onTick(time);
}