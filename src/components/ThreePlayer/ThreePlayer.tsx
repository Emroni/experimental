'use client';
import { Box } from '@mui/material';
import { NextPage } from 'next';
import { Component, createRef } from 'react';
import * as THREE from 'three';
import PlayerControls from '../PlayerControls/PlayerControls';

export default class ThreePlayer extends Component<{}, ThreePlayerState> {

    camera: THREE.PerspectiveCamera;
    canvasContainerRef: React.RefObject<HTMLDivElement>;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;

    constructor(pageProps: NextPage, playerProps: ThreePlayerProps) {
        super(pageProps);

        this.canvasContainerRef = createRef();

        // Prepare state
        this.state = {
            duration: playerProps.duration || 10,
            playing: false,
            progress: 0,
            size: playerProps.size || 640,
            startTime: 0,
        };
    }

    componentDidMount() {
        const { size } = this.state;

        // Create components
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, 1, 1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(size, size);

        // Add to render container
        if (this.canvasContainerRef.current) {
            while (this.canvasContainerRef.current.childElementCount) {
                this.canvasContainerRef.current.lastChild?.remove();
            }
            this.canvasContainerRef.current.appendChild(this.renderer.domElement);
        }

        // Update components
        this.onMount();
        this.camera.updateProjectionMatrix();

        // Add listeners
        window.addEventListener('resize', this.handleResize);
        this.handleResize();

        // Start playing
        this.togglePlaying(true);
    }

    componentWillUnmount() {
        // Remove listeners
        this.renderer?.setAnimationLoop(null);
        window.removeEventListener('resize', this.handleResize);
    }

    handleAnimationLoop = () => {
        const { duration, startTime } = this.state;

        // Update progress
        const progress = (((performance.now() / 1000) - startTime) / duration) % 1;
        this.setState({
            progress,
        });

        // Call tick and render
        this.onTick(progress);
        this.renderer.render(this.scene, this.camera);
    }

    handleResize = () => {
        //  Resize canvas to fit
        if (this.canvasContainerRef.current) {
            const { size } = this.state;
            const containerRect = this.canvasContainerRef.current.getBoundingClientRect();
            const scale = Math.min(size, containerRect.width, containerRect.height) / size;
            this.renderer.domElement.style.transform = scale < 1 ? `scale(${scale})` : '';
        }
    }

    handleProgressChange = (progress: number) => {
        this.setState(prevState => ({
            progress,
            startTime: (performance.now() / 1000) - (progress * prevState.duration),
        }), () => {
            this.handleAnimationLoop();
        });
    }

    togglePlaying = (play?: boolean) => {
        this.setState(prevState => ({
            playing: play !== undefined ? play : !prevState.playing,
            startTime: (performance.now() / 1000) - (prevState.progress * prevState.duration),
        }), () => {
            // Toggle animation loop
            if (this.state.playing) {
                this.renderer.setAnimationLoop(this.handleAnimationLoop);
            } else {
                this.renderer.setAnimationLoop(null);
            }
        });
    }

    onMount = () => {
        // Override in experiments
    }

    onTick = (time: number) => {
        // Override in experiments
    }

    render() {
        return <>
            <Box
                alignItems="center"
                display="flex"
                height="100%"
                justifyContent="center"
                ref={this.canvasContainerRef}
            />
            <PlayerControls
                playing={this.state.playing}
                progress={this.state.progress}
                onProgressChange={this.handleProgressChange}
                onToggle={this.togglePlaying}
            />
        </>;
    }

}