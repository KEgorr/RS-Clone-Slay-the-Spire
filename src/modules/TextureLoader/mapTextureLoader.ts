import { Assets } from '@pixi/assets';
import { Texture } from '@pixi/core';
import { Sprite } from 'pixi.js';

export default class MapSpriteLoader {
  protected async getMapTopSprite(): Promise<Sprite> {
    const asset: Texture = await Assets.load('./assets/map/mapTop.png');
    const sprite = new Sprite(asset);
    return sprite;
  }
  protected async getMapMidSprite(): Promise<Sprite> {
    const asset: Texture = await Assets.load('./assets/map/mapMid.png');
    const sprite = new Sprite(asset);
    return sprite;
  }
  protected async getMapBotSprite(): Promise<Sprite> {
    const asset: Texture = await Assets.load('./assets/map/mapBot.png');
    const sprite = new Sprite(asset);
    return sprite;
  }
  protected async getMapChestTexture(): Promise<Texture> {
    const asset: Texture = await Assets.load('./assets/map/chest.png');
    return asset;
  }
  protected async getMapMonsterTexture(): Promise<Texture> {
    const asset: Texture = await Assets.load('./assets/map/monster.png');
    return asset;
  }
  protected async getMapEventTexture(): Promise<Texture> {
    const asset: Texture = await Assets.load('./assets/map/event.png');
    return asset;
  }
  protected async getMapEliteTexture(): Promise<Texture> {
    const asset: Texture = await Assets.load('./assets/map/elite.png');
    return asset;
  }
  protected async getMapRestTexture(): Promise<Texture> {
    const asset: Texture = await Assets.load('./assets/map/rest.png');
    return asset;
  }
  protected async getMapShopTexture(): Promise<Texture> {
    const asset: Texture = await Assets.load('./assets/map/shop.png');
    return asset;
  }
  protected async getMapDotTexture(): Promise<Texture> {
    const asset: Texture = await Assets.load('./assets/map/dot1.png');
    return asset;
  }

  protected async getPickedAnimTextures(): Promise<Texture[]> {
    const asset1: Texture = await Assets.load('./assets/map/circle1.png');
    const asset2: Texture = await Assets.load('./assets/map/circle2.png');
    const asset3: Texture = await Assets.load('./assets/map/circle3.png');
    const asset4: Texture = await Assets.load('./assets/map/circle4.png');
    const asset5: Texture = await Assets.load('./assets/map/circle5.png');

    return [asset1, asset2, asset3, asset4, asset5];
  }

  protected async getRandomBossTexture(): Promise<Texture> {
    const guardian: Texture = await Assets.load('./assets/map/boss/guardian.png');
    const hexaghost: Texture = await Assets.load('./assets/map/boss/hexaghost.png');
    const slime: Texture = await Assets.load('./assets/map/boss/slimeBoss.png');

    return [guardian, hexaghost, slime][Math.round(Math.random() * 3)];
  }
}
