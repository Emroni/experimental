interface PlayerControlsProps {
    playing: boolean
    progress: number;
    onProgressChange(progress: number): void;
    onToggle(): void;
}