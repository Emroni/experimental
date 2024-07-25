interface ThreePlayerProps {
    duration?: number;
    size?: number;
}

interface ThreePlayerState {
    duration: number;
    playing: boolean;
    progress: number;
    size: number;
    startTime: number;
}