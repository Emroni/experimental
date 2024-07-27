interface ExperimentControlsProps {
    items: ExperimentControlItems;
    onChange(items: ExperimentControlItems): void;
}

interface ExperimentControlItems {
    [index: string]: ExperimentControlItem;
}

interface ExperimentControlItem {
    max: number;
    min: number;
    step?: number;
    value: number;
}