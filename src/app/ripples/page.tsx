'use client';
import { Box } from '@mui/material';
import gsap, { Power2 } from 'gsap';
import { Component, createRef } from 'react';
import './styles.css';

export default class Ripples extends Component {

    containerRef = createRef<HTMLDivElement>();
    dots: RipplesDot[] = [];
    
    rect: DOMRect;
    timeout: NodeJS.Timeout;

    componentDidMount() {
        window.addEventListener('resize', this.resize);
        this.resize();
    }

    componentWillUnmount() {
        this.reset();
        window.removeEventListener('resize', this.resize);
    }

    reset = () => {
        clearTimeout(this.timeout);
        gsap.killTweensOf('.dot');
    }

    resize = () => {
        this.reset();
        if (!this.containerRef.current) {
            return;
        }

        // Get grid
        this.rect = this.containerRef.current.getBoundingClientRect();
        const wide = Math.ceil(this.rect.width / 30);
        const high = Math.ceil(this.rect.height / 30);
        const total = wide * high;

        // Create grid
        for (let i = 0; i < total; i++) {
            // Get dot
            let dot = this.dots[i];
            if (!dot) {
                // Create dot
                dot = {
                    element: document.createElement('div'),
                    x: 0,
                    y: 0,
                };
                this.dots.push(dot);

                dot.element.className = 'dot';
                this.containerRef.current.appendChild(dot.element);
            }

            // Position in grid
            dot.x = (i % wide) * 30;
            dot.y = Math.floor(i / wide) * 30;
            dot.element.style.left = dot.x + 'px';
            dot.element.style.top = dot.y + 'px';
            dot.element.style.opacity = '';
            dot.element.style.width = '';
            dot.element.style.height = '';
        }

        // Start ripple
        this.ripple();
    }

    ripple = () => {
        // Select random dot from grid
        const selected = this.dots[Math.floor(Math.random() * this.dots.length)];

        // Loop through all dots
        for (const dot of this.dots) {
            // Get distance to selected dot
            const x = dot.x - selected.x;
            const y = dot.y - selected.y;
            const distance = Math.sqrt(x * x + y * y);

            // Effect amount, decreases over distance
            const amount = 1 - (distance / window.innerWidth);

            // Animate dot out/in, delayed by the distance
            gsap.to(dot.element, {
                opacity: 1 - amount,
                width: (1 - amount) * 20,
                height: (1 - amount) * 20,
                left: dot.x + amount * 10,
                top: dot.y + amount * 10,
                repeat: 3, // Creates (value - 1) ripples
                yoyo: true, // So it animates back and forth
                delay: distance * 0.002, // The further away, the more delay, causing a ripple effect
                duration: 0.5,
                ease: Power2.easeInOut,
            });
        }

        // Repeat, wait max delay + duration + 1 second
        this.timeout = setTimeout(this.ripple, this.rect.width * 2 + 500 + 1000);
    }

    render() {
        return <Box flex={1} position="relative" ref={this.containerRef} />;
    }

}