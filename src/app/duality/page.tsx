'use client';
import { PixiPlayer } from '@/components';
import * as PIXI from 'pixi.js';
import { Component } from 'react';
import { BlackSide, WhiteSide } from './Sides';

export default class Duality extends Component<any, ExperimentControlItems> {

    // TODO: Link to https://tympanus.net/codrops/2019/06/06/awesome-demos-roundup-5/#:~:text=Grid%20Card%20Slider-,Duality
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