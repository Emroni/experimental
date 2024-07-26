interface PixiPlayerProps {
    duration?: number;
    size?: number;
    onInit(app: PIXI.Application<PIXI.Renderer>): void;
    onTick(progress: number): void;
}

interface PixiPlayerState {
    duration: number;
    initialized: boolean;
    playing: boolean;
    progress: number;
    size: number;
    startTime: number;
}