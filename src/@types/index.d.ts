interface Experiment {
    duration: number;
    element: HTMLElement;
    size: number;
    onTick(time: number): void;
}