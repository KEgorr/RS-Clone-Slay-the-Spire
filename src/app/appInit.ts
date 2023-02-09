import app from './app';
import Map from '../modules/map/mapSceneInit';

export default class AppInitializer {
  map: Map;

  constructor() {
    this.map = new Map();
  }
  public async start() {
    document.body.append(app.view as HTMLCanvasElement);
    await this.map.renderMap();
    app.stage.addChild(this.map.mapScene);
  }
}
