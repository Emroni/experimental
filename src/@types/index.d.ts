interface Experiment {
    duration: number;
    element: HTMLElement;
    size: number;
    onTick(time: number): void;
}

interface SidebarItem {
    anchor: HTMLAnchorElement;
    element: HTMLLIElement;
    url: string;
}