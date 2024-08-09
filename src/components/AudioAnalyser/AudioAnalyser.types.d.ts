interface AudioAnalyserProps {
    onTick(frequencies: number[], average: number): void;
}

interface AudioAnalyserState {
    initialized: boolean;
}