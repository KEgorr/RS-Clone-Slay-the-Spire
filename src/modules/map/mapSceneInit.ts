import { AnimatedSprite, Container, FederatedPointerEvent, Graphics, Sprite } from 'pixi.js';
import { DashLine } from 'pixi-dashed-line';
import app from '../../app/app';
import MapSpriteLoader from '../TextureLoader/mapTextureLoader';
import MapData from '../data/mapData';

export default class Map extends MapSpriteLoader {
  public mapScene: Container;
  private locLines: Container;
  private mapContainer: Container;
  private mapData: MapData;
  private pulsingLocations: NodeJS.Timer[] = [];

  constructor() {
    super();
    this.mapScene = new Container();
    this.mapScene.name = 'map-scene';
    this.locLines = new Container();
    this.mapContainer = new Container();
    this.mapData = new MapData();
  }
  public async renderMap() {
    const mapTop = await this.getMapTopSprite();
    const mapMid = await this.getMapMidSprite();
    const mapBot = await this.getMapBotSprite();

    mapTop.anchor.set(0.5, 0);
    mapTop.x = app.screen.width / 2;
    mapTop.y = 0;

    mapMid.anchor.set(0.5, 0);
    mapMid.x = app.screen.width / 2;
    mapMid.y = mapTop.height;

    mapBot.anchor.set(0.5, 0);
    mapBot.x = app.screen.width / 2;
    mapBot.y = mapTop.height + mapMid.height;

    this.mapContainer.addChild(mapTop, mapMid, mapBot);
    await this.fillMap();
    this.mapScene.addChild(this.mapContainer);

    this.mapData.setFlor('line_0');

    app.stage.on('wheel', (event: WheelEvent) => {
      this.mapContainer.y -= event.deltaY;
      const mapHeightToScroll = -mapMid.height - mapTop.height - 100;
      if (this.mapContainer.y > 0) {
        this.mapContainer.y = 0;
      } else if (this.mapContainer.y < mapHeightToScroll) {
        this.mapContainer.y = mapHeightToScroll;
      }
    });
    let dragTarget: Sprite | null = null;
    app.stage.hitArea = app.screen;
    app.stage.on('pointerup', onDragEnd);
    app.stage.on('pointerupoutside', onDragEnd);
    mapMid.interactive = true;
    mapMid.on('mousedown', onDragStart);
    function onDragEnd() {
      if (dragTarget) {
        app.stage.off('pointermove', onDragMove);
        dragTarget = null;
      }
    }
    function onDragStart() {
      dragTarget = mapMid;
      app.stage.on('pointermove', onDragMove);
      mapTop.interactive = true;
    }

    function onDragMove(event: FederatedPointerEvent) {
      if (dragTarget) {
        dragTarget.y += event.movementY;
        dragTarget.x += event.movementX;
      }
    }
    this.setLocPicker('line_0-loc_0');
  }

  private setLocPicker(pickedLoc: string) {
    const currentFlor = this.locLines.getChildByName(this.mapData.getFlorName());
    currentFlor.children?.forEach((loc) => {
      if (loc instanceof Sprite) {
        if (this.mapData.isConnected('lower', loc.name, pickedLoc)) {
          setTimeout(() => {
            loc.interactive = true;
            loc.cursor = 'pointer';
            loc.on('pointerdown', (event) => {
              (async () => {
                await this.pickLoc(event);
              })().catch((err) => console.log(err));
            });

            let count = 0;
            const interval = setInterval(() => {
              loc.scale.x = 0.5 + Math.abs(Math.sin(count)) * 0.5;
              loc.scale.y = 0.5 + Math.abs(Math.sin(count)) * 0.5;
              count += 0.01;
            }, 1);
            this.pulsingLocations.push(interval);
          }, Math.random() * 1000);
        }
      }
    });
  }

  private async pickLoc(event: FederatedPointerEvent) {
    const target = event.target;
    if (target instanceof Sprite) {
      console.log(this.mapData.getType(target.name));

      const pickedAnimTexture = await this.getPickedAnimTextures();
      const pickedAnim = new AnimatedSprite(pickedAnimTexture);

      pickedAnim.anchor.set(0.5);
      pickedAnim.tint = 0x293133;
      pickedAnim.animationSpeed = 0.5;
      target.addChild(pickedAnim);

      pickedAnim.play();
      pickedAnim.loop = false;

      pickedAnim.onComplete = () => {
        this.pulsingLocations.forEach((loc) => clearInterval(loc));
        this.pulsingLocations = [];
        this.setLocPicker(target.name); // TODO add this stroke to another method
      };
      const currentFlor = this.locLines.getChildByName(this.mapData.getFlorName());

      currentFlor.children?.forEach((loc) => {
        if (loc instanceof Sprite) {
          loc.interactive = false;
          loc.cursor = 'default';
          loc.removeAllListeners();
          loc.scale.set(0.5);
        }
      });
      this.mapData.setFlor(`line_${this.mapData.getFlorNumber() + 1}`);
    }
  }

  private async fillMap() {
    const chest = await this.getMapChestTexture();
    const monster = await this.getMapMonsterTexture();
    const event = await this.getMapEventTexture();
    const elite = await this.getMapEliteTexture();
    const rest = await this.getMapRestTexture();
    const shop = await this.getMapShopTexture();
    const texturesArr = [chest, rest, shop, elite, event, monster];

    for (let i = 0; i < 11; i += 1) {
      const line = new Container();
      line.name = `line_${i}`;

      line.x = 500;
      line.y = 3000 - 250 * i;

      for (let j = 0; j < 4; j += 1) {
        let picked = Sprite.from(texturesArr[this.getRandomIndexWithChance()]);
        if (i === 0) {
          picked = Sprite.from(texturesArr[texturesArr.length - 1]);
        } else if (i === 6) {
          picked = Sprite.from(texturesArr[0]);
        } else if (i === 10) {
          picked = Sprite.from(texturesArr[1]);
        }

        picked.anchor.set(0.5);
        picked.tint = 0x293133;
        picked.scale.set(0.5);
        picked.y = Math.round(Math.random() * 100);
        picked.x = Math.round(Math.random() * 100) + j * 250;
        picked.name = `line_${i}-loc_${j}`;
        const type = this.getLocType(picked.texture.textureCacheIds[0]);
        this.mapData.addLoc(picked.name, type);
        line.addChild(picked);
      }
      this.locLines.addChild(line);
    }
    this.mapContainer.addChild(this.locLines);
    this.drawLines();
  }

  private getRandomIndexWithChance() {
    const random = Math.random();

    if (random < 0.05) {
      return 0;
    } else if (random < 0.1) {
      return 1;
    } else if (random < 0.15) {
      return 2;
    } else if (random < 0.3) {
      return 3;
    } else if (random < 0.65) {
      return 4;
    } else {
      return 5;
    }
  }

  private drawLines() {
    for (let i = 0; i < this.locLines.children.length - 1; i += 1) {
      const bottomLine = this.locLines.getChildByName(`line_${i}`);
      const upperLine = this.locLines.getChildByName(`line_${i + 1}`);

      for (let j = 0; j < 4; j += 1) {
        const isTwo = Math.random() < 0.5 ? true : false;
        const graphics = new Graphics();

        const dashedLine = new DashLine(graphics, {
          dash: [20, 10],
          width: 5,
          color: 0x293133,
        });
        if (bottomLine instanceof Container && upperLine instanceof Container) {
          const locOnBottomLine = bottomLine.getChildByName(`line_${i}-loc_${j}`);

          const locOnBottomLinePos = locOnBottomLine.getGlobalPosition();
          const locBottomX = locOnBottomLinePos.x - 2;
          const locBottomY = locOnBottomLinePos.y - 30;
          dashedLine.moveTo(locBottomX, locBottomY);

          const locUpperLineFirst = upperLine.getChildByName(`line_${i + 1}-loc_${j}`);

          const locUpperLinePos = locUpperLineFirst.getGlobalPosition();

          const locUpperX = locUpperLinePos.x + 2;
          const locUpperY = locUpperLinePos.y + 30;
          dashedLine.lineTo(locUpperX, locUpperY);

          this.mapData.setConnection('upper', locOnBottomLine.name, locUpperLineFirst.name);
          this.mapData.setConnection('lower', locUpperLineFirst.name, locOnBottomLine.name);

          if (isTwo) {
            dashedLine.moveTo(locBottomX, locBottomY);
            const randomPos = Math.random() < 0.5 ? -1 : 1;
            let locUpperLineSecond = upperLine.getChildByName(`line_${i + 1}-loc_${j + randomPos}`);

            if (locUpperLineSecond === null) {
              locUpperLineSecond = upperLine.getChildByName(`line_${i + 1}-loc_${j + 1}`);
              if (locUpperLineSecond === null) {
                locUpperLineSecond = upperLine.getChildByName(`line_${i + 1}-loc_${j - 1}`);
              }
            }

            const locUpperLineSecondPos = locUpperLineSecond.getGlobalPosition();

            const locUpperLineSecondX = locUpperLineSecondPos.x + 2;
            const locUpperLineSecondY = locUpperLineSecondPos.y + 30;

            dashedLine.lineTo(locUpperLineSecondX, locUpperLineSecondY);
            this.mapData.setConnection('upper', locOnBottomLine.name, locUpperLineSecond.name);
            this.mapData.setConnection('lower', locUpperLineSecond.name, locOnBottomLine.name);
          }
          this.mapContainer.addChild(graphics);
        }
      }
    }
  }
  private getLocType(texturePath: string) {
    const textureName = texturePath.split('/').at(-1);
    if (textureName) {
      return textureName.split('.')[0];
    }
    return '';
  }
}
