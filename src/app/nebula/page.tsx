'use client';
import { ExperimentControls } from '@/components';
import { PI_M2 } from '@/setup';
import { Box } from '@mui/material';
import { Component, createRef } from 'react';
import { createNoise3D } from 'simplex-noise';

export default class Ripples extends Component {

    containerRef = createRef<HTMLDivElement>();
    fade = '';
    field: NebulaPoint[][] = [];
    frameRequest = 0;
    lineDistance = 0;
    noise3D = createNoise3D();
    noiseZ = 0;
    particles: NebulaParticle[] = [];

    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null;

    state = {
        particles: { min: 100, max: 5000, step: 100, value: 3000 },
        opacity: { min: 0, max: 1, step: 0.01, value: 0.2 },
        size: { min: 0, max: 5, step: 1, value: 0 },
        trail: { min: 0, max: 1, step: 0.01, value: 0.7 },
        colors: { min: 0, max: 255, step: 1, value: 20 },
        noise: { min: 0.01, max: 1, step: 0.01, value: 0.1 },
        velocity: { min: 0.1, max: 3, step: 0.01, value: 0.7 },
        lines: { min: 0, max: 100, step: 1, value: 50 },
        vectors: { min: 1, max: 100, step: 1, value: 50 },
    };

    componentDidMount() {
        // Get canvas and context
        if (this.containerRef.current) {
            this.canvas = this.containerRef.current.firstChild as HTMLCanvasElement | null;
            this.ctx = this.canvas?.getContext('2d') || null;
        }

        // Add listeners
        window.addEventListener('resize', this.resize);
        this.resize();

        // Trigger state change
        this.setState({});
    }

    componentWillUnmount() {
        // Remove listeners
        cancelAnimationFrame(this.frameRequest);
        window.removeEventListener('resize', this.resize);
    }

    componentDidUpdate() {
        const { particles } = this.state;

        // Remove excess particles
        while (this.particles.length > particles.value) {
            this.particles.pop();
        }

        // Add missing particles
        for (let i = this.particles.length; i < particles.value; i++) {
            this.particles.push({
                c: '',
                v: (0.1 + Math.random() * 0.9),
                x: 0,
                y: 0,
            });
        }

        this.resize();
    }

    resize = () => {
        if (!this.containerRef.current || !this.canvas || !this.ctx) {
            return;
        }

        // Update canvas
        const rect = this.containerRef.current.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;

        console.log(rect.width, rect.height)

        // Update context
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, rect.width, rect.height);
        this.ctx.lineWidth = 1;

        // Update particles
        for (const particle of this.particles) {
            particle.x = Math.random() * rect.width;
            particle.y = Math.random() * rect.height;
        }

        this.change();
    }

    change = () => {
        const { colors, lines, opacity, trail, vectors } = this.state;

        if (!this.ctx) {
            return;
        }

        // Set particle colors
        for (const particle of this.particles) {
            particle.c = `hsla(${Math.round(Math.random() * colors.value)}, 100%, 50%, ${Math.random() * opacity.value})`;
        }

        // Set styles
        this.fade = `rgba(0,0,0,${(1 - trail.value) * 0.3})`;
        this.lineDistance = lines.value * lines.value;
        this.ctx.strokeStyle = `hsla(${colors.value},100%,50%,${(110 - lines.value) * 0.0005})`;

        // Get vector field
        this.field = new Array(vectors.value);
        for (let x = 0; x < vectors.value; x++) {
            this.field[x] = new Array(vectors.value).fill(0).map(() => ({
                x: 0,
                y: 0,
            }));
        }

        // Start tick
        cancelAnimationFrame(this.frameRequest);
        this.tick();
    }

    tick = () => {
        const { lines, noise, size, vectors, velocity } = this.state;
        this.frameRequest = requestAnimationFrame(this.tick);

        if (!this.canvas || !this.ctx) {
            return;
        }

        // Clear context
        this.ctx.fillStyle = this.fade;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Update field
        this.noiseZ += noise.value * 0.01;
        for (let x = 0; x < vectors.value; x++) {
            for (let y = 0; y < vectors.value; y++) {
                const a = this.noise3D(x / vectors.value, y / vectors.value, this.noiseZ) * PI_M2;
                const v = this.field[x][y];
                v.x = Math.sin(a);
                v.y = Math.cos(a);
            }
        }

        // Update particles
        for (const particle of this.particles) {
            const x = Math.floor(particle.x / this.canvas.width * vectors.value);
            const y = Math.floor(particle.y / this.canvas.height * vectors.value);
            const v = this.field[x]?.[y];

            if (v) {
                particle.x = Math.max(1, Math.min(this.canvas.width - 1, particle.x + v.x * particle.v * velocity.value));
                particle.y = Math.max(1, Math.min(this.canvas.height - 1, particle.y + v.y * particle.v * velocity.value));
            }
        }

        // Draw lines
        if (lines.value) {
            this.ctx.beginPath();
            for (let i = 0; i < this.particles.length; i++) {
                const p1 = this.particles[i];
                for (let j = i + 1; j < this.particles.length; j++) {
                    const p2 = this.particles[j];
                    const dx = p2.x - p1.x;
                    const dy = p2.y - p1.y;

                    if (dx * dx + dy * dy <= this.lineDistance) {
                        this.ctx.moveTo(p1.x, p1.y);
                        this.ctx.lineTo(p2.x, p2.y);
                    }
                }
            }

            this.ctx.stroke();
        }

        // Draw particles
        if (size.value) {
            const h = size.value / 2;
            for (const particle of this.particles) {
                this.ctx.fillStyle = particle.c;
                this.ctx.fillRect(particle.x - h, particle.y - h, size.value, size.value);
            }
        }
    }

    render() {
        return <>
            <ExperimentControls
                items={this.state}
                onChange={items => this.setState(items)}
            />
            <Box flex={1} overflow="hidden" ref={this.containerRef}>
                <canvas />
            </Box>
        </>;
    }

}