import { Black, White } from './side.js';

const app = new PIXI.Application({
  width: 256, 
  height: 256,
  antialias: true,
});

document.body.appendChild(app.view);

const black = new Black();
app.stage.addChild(black);

const white = new White();
app.stage.addChild(white);

app.renderer.autoResize = true;
window.addEventListener('resize', resize);
resize();

function resize() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  black.resize(window.innerWidth, window.innerHeight);
  white.resize(window.innerWidth, window.innerHeight);
}