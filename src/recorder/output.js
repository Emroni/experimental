let element;

export function clear() {
    if (element) {
        document.body.removeChild(element);
        element = null;
    }
}

export function show(data) {
    const {file, size, type} = data;

    element = document.createElement('a');
    document.body.appendChild(element);
    element.classList.add('output');
    element.download = file.split('/')
        .pop();
    element.href = file;

    const display = document.createElement(type);
    element.appendChild(display);
    display.src = file;

    if (type === 'video') {
        display.autoplay = true;
        display.loop = true;
    }

    const span = document.createElement('span');
    element.appendChild(span);
    span.innerText = `Download: ${size}mb`;
}