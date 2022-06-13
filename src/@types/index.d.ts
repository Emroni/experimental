declare module '*.frag' {
    const value: string
    export default value
}

declare module '*.vert' {
    const value: string
    export default value
}

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