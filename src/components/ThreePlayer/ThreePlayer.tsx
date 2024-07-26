'use client';
import { Box } from '@mui/material';
import { Component, createRef } from 'react';
import * as THREE from 'three';
import PlayerControls from '../PlayerControls/PlayerControls';

export default class ThreePlayer extends Component<ThreePlayerProps, ThreePlayerState> {

    camera: THREE.PerspectiveCamera;
    canvasContainerRef: React.RefObject<HTMLDivElement>;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;

    constructor(props: ThreePlayerProps) {
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

    init = () => {
        // Initialize
        if (!this.state.initialized) {
            // Create components
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, 1, 1, 1000);

            // Create renderer 
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(this.state.size, this.state.size);
            this.renderer.domElement.style.left = '50%';
            this.renderer.domElement.style.top = '50%';
            this.renderer.domElement.style.position = 'absolute';

            // Initialize page
            this.props.onInit(this.scene, this.camera);
            this.setState({
                initialized: true,
            }, () => {
                this.init();
            });

        } else {
            // Add to render container
            if (this.canvasContainerRef.current) {
                while (this.canvasContainerRef.current.childElementCount) {
                    this.canvasContainerRef.current.lastChild?.remove();
                }
                this.canvasContainerRef.current.appendChild(this.renderer.domElement);
            }

            // Update components
            this.camera.updateProjectionMatrix();

            // Add listeners
            window.addEventListener('resize', this.handleResize);
            this.handleResize();

            // Start playing
            this.togglePlaying(true);
        }
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
        this.props.onTick(progress);
        this.renderer.render(this.scene, this.camera);
    }

    handleResize = () => {
        //  Resize canvas to fit
        if (this.canvasContainerRef.current) {
            const { size } = this.state;
            const containerRect = this.canvasContainerRef.current.getBoundingClientRect();
            const scale = Math.min(size, containerRect.width, containerRect.height) / size;
            this.renderer.domElement.style.transform = `translate(-50%, -50%) scale(${scale})`;
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

    render() {
        return <>
            <Box flex={1} padding={3}>
                <Box height="100%" position="relative" ref={this.canvasContainerRef} />
            </Box>
            <PlayerControls
                playing={this.state.playing}
                progress={this.state.progress}
                onProgressChange={this.handleProgressChange}
                onToggle={this.togglePlaying}
            />
        </>;
    }

}