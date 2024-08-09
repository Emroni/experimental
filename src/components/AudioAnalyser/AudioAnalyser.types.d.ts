interface AudioAnalyserProps {
    onTick(frequencies: Float32Array, average: number): void;
}

interface AudioAnalyserState {
    initialized: boolean;
}