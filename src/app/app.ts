import { Application } from 'pixi.js';

const app = new Application({
  resolution: window.devicePixelRatio || 1,
  backgroundColor: 0x6495ed,
  width: window.innerWidth,
  height: window.innerHeight,
});

app.stage.interactive = true;

export default app;
