'use client';
import { Box } from '@mui/material';
import * as PIXI from 'pixi.js';
import { Component, createRef, RefObject } from 'react';
import PlayerControls from '../PlayerControls/PlayerControls';

export default class PixiPlayer extends Component<PixiPlayerProps, PixiPlayerState> {

    app: PIXI.Application<PIXI.Renderer>;
    canvasContainerRef: RefObject<HTMLDivElement>;

    constructor(props: PixiPlayerProps) {
        super(props);

        this.canvasContainerRef = createRef();

        // Prepare state
        this.state = {
            duration: 10,
            initialized: false,
            playing: false,
            progress: 0,
            size: 640,
            startTime: 0,
            ...props,
        };
    }

    componentDidMount() {
        this.init();
    }

    componentWillUnmount() {
        // Remove listeners
        if (this.state.initialized) {
            this.app.ticker.destroy();
        }
        window.removeEventListener('resize', this.handleResize);
    }

    init = async () => {
        // Initialize
        if (!this.app) {
            // Create app
            this.app = new PIXI.Application();

            await this.app.init({
                antialias: true,
                width: this.state.size,
                height: this.state.size,
            });

            this.app.canvas.style.left = '50%';
            this.app.canvas.style.top = '50%';
            this.app.canvas.style.position = 'absolute';

            // Initialize page
            this.props.onInit(this.app);
            this.setState({
                initialized: true,
            }, () => {
                this.init();
            });
        }

        // Mount
        if (this.state.initialized) {
            // Add to render container
            if (this.canvasContainerRef.current) {
                while (this.canvasContainerRef.current.childElementCount) {
                    this.canvasContainerRef.current.lastChild?.remove();
                }
                this.canvasContainerRef.current.appendChild(this.app.canvas);
            }

            // Add listeners
            this.app.ticker.add(this.handleTicker);
            window.addEventListener('resize', this.handleResize);
            this.handleResize();

            // Start playing
            this.togglePlaying(true);
        }
    }

    handleTicker = () => {
        const { duration, startTime } = this.state;

        // Update progress
        const progress = (((performance.now() / 1000) - startTime) / duration) % 1;
        this.setState({
            progress,
        });

        // Call tick
        this.props.onTick?.(progress);
    }

    handleResize = () => {
        //  Resize canvas to fit
        if (this.canvasContainerRef.current) {
            const { size } = this.state;
            const containerRect = this.canvasContainerRef.current.getBoundingClientRect();
            const scale = Math.min(size, containerRect.width, containerRect.height) / size;
            this.app.canvas.style.transform = `translate(-50%, -50%) scale(${scale})`;
        }
    }

    handleProgressChange = (progress: number) => {
        this.setState(prevState => ({
            progress,
            startTime: (performance.now() / 1000) - (progress * prevState.duration),
        }), () => {
            this.handleTicker();
            this.app.ticker.update();
        });
    }

    togglePlaying = (play?: boolean) => {
        this.setState(prevState => ({
            playing: play !== undefined ? play : !prevState.playing,
            startTime: (performance.now() / 1000) - (prevState.progress * prevState.duration),
        }), () => {
            // Toggle ticker
            if (this.state.playing) {
                this.app.ticker.start();
            } else {
                this.app.ticker.stop();
            }
        });
    }

    render() {
        return <>
            <Box flex={1} padding={3}>
                <Box height="100%" position="relative" ref={this.canvasContainerRef} />
            </Box>
            {!!this.props.onTick && (
                <PlayerControls
                    playing={this.state.playing}
                    progress={this.state.progress}
                    onProgressChange={this.handleProgressChange}
                    onToggle={this.togglePlaying}
                />
            )}
        </>;
    }

}