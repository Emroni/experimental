'use client';
import { PixiPlayer } from '@/components';
import * as PIXI from 'pixi.js';
import React from 'react';
import { BlackSide, WhiteSide } from './Sides';

export default class Duality extends React.Component<any, ExperimentControlItems> {

    // TODO: Add experiment controls
    // TODO: Add player controls

    handleInit = (app: PIXI.Application) => {
        const black = new BlackSide();
        app.stage.addChild(black);

        const white = new WhiteSide();
        app.stage.addChild(white);
    }

    render() {
        return <PixiPlayer
            duration={5}
            size={1920}
            onInit={this.handleInit}
        />;
    }

}