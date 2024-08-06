interface ThreePlayerProps {
    duration?: number;
    size?: number;
    onInit(scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): Function | void;
    onTick(progress: number): void;
}

interface ThreePlayerState {
    duration: number;
    playing: boolean;
    progress: number;
    size: number;
    startTime: number;
}
