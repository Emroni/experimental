'use client';
import { Box } from '@mui/material';
import { NextPage } from 'next';
import { Component, createRef } from 'react';
import * as THREE from 'three';

export default class ThreePlayer extends Component {

    camera: THREE.PerspectiveCamera;
    canvasContainerRef: React.RefObject<HTMLDivElement>;
    duration: number;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    size: number;
    startTime: number;

    constructor(pageProps: NextPage, playerProps: ThreePlayerProps) {
        super(pageProps);

        // Set props
        this.canvasContainerRef = createRef();
        this.duration = playerProps.duration || 10;
        this.size = playerProps.size || 640;
    }

    componentDidMount() {
        // Create components
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, 1, 1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.size, this.size);

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

        // Start renderer
        this.startTime = performance.now();
        this.renderer.setAnimationLoop(this.handleAnimationLoop);

        // Add listeners
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
    }

    componentWillUnmount() {
        // Remove listeners
        this.renderer?.setAnimationLoop(null);
        window.removeEventListener('resize', this.handleResize);
    }

    handleAnimationLoop = () => {
        // Call tick and render
        const time = (((performance.now() - this.startTime) / 1000) / this.duration) % 1;
        this.onTick(time);
        this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
        //  Resize canvas to fit
        if (this.canvasContainerRef.current) {
            const containerRect = this.canvasContainerRef.current.getBoundingClientRect();
            const scale = Math.min(this.size, containerRect.width, containerRect.height) / this.size;
            this.renderer.domElement.style.transform = scale < 1 ? `scale(${scale})` : '';
        }
    }

    onMount = () => {
        // Override in experiments
    }

    onTick = (time: number) => {
        // Override in experiments
    }

    render() {
        return <Box
            alignItems="center"
            display="flex"
            height="100%"
            justifyContent="center"
            ref={this.canvasContainerRef}
        />;
    }

}