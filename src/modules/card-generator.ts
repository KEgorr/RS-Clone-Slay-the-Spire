/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import * as PIXI from 'pixi.js';
import { ICard } from '../interfaces';

export class Card {
  constructor(options: ICard) {
    this.options = options;
  }

  private options;

  render() {
    const cardContainer = new PIXI.Container();
    cardContainer.scale.set(0.5);
    const base = PIXI.Sprite.from(`./assets/cards/ui/base_${this.options.type.toLowerCase()}_${this.options.category.toLowerCase()}.png`);
    const imgFileName = `/assets/cards/img/${this.options.category.toLowerCase()}/${this.options.type.toLowerCase()}/${(this.options.name.toLowerCase().split(' ').join('_'))}.png`
    console.log(imgFileName);
    const img = PIXI.Sprite.from(imgFileName);
    img.position.set(100, 110);
    if (!this.options.rarity) {
      this.options.rarity = 'common'
    }
    const frame = PIXI.Sprite.from(`./assets/cards/ui/frame_${this.options.type.toLowerCase()}_${this.options.rarity.toLowerCase()}.png`);
    const title = PIXI.Sprite.from(`./assets/cards/ui/title_${this.options.rarity.toLowerCase()}.png`);
    cardContainer.addChild(base, img, frame, title);

    function splitText(str: string) {
      const arr = str.split(' ');
      let newStr = '';
      let counter = 0;
      for (let i = 0; i < arr.length; i += 1) {
        counter += arr[i].length;
        if (counter <= 20) {
          newStr += arr[i];
          newStr += ' ';
        } else {
          newStr += '\n';
          newStr += arr[i];
          newStr += ' ';
          counter = 3;
        }
      }
      return newStr;
    }

    const textDesc = new PIXI.Text(`${splitText(this.options.desc)}`, {
      fontFamily: 'Kreon',
      fontSize: 40,
      fill: 0xffffff,
      align: 'center',
      stroke: '0x505050',
      strokeThickness: 5,
    });

    textDesc.position.set(360, 650);
    textDesc.anchor.set(0.5, 0.5);

    const textTitle = new PIXI.Text(`${this.options.name}`, {
      fontFamily: 'Kreon',
      fontSize: 50,
      fill: 0xffffff,
      align: 'center',
      stroke: '0x505050',
      strokeThickness: 10,
    });
    textTitle.position.set(360, 110);
    textTitle.anchor.set(0.5, 0.5);

    const textCardType = new PIXI.Text(`${this.options.type.toUpperCase()}`, {
      fontFamily: 'Kreon',
      fontSize: 25,
      fill: 0xffffff,
      align: 'center',
      stroke: '0x505050',
      strokeThickness: 7,
    });
    textCardType.position.set(357, 486);
    textCardType.anchor.set(0.5, 0.5);

    if (this.options.cost) {
      const textEnergy = new PIXI.Text(`${this.options.cost}`, {
        fontFamily: 'Kreon',
        fontWeight: 'bold',
        fontSize: 75,
        fill: 0xffffff,
        align: 'center',
        stroke: '0x505050',
        strokeThickness: 10,
      });
      textEnergy.position.set(85, 65);
      textEnergy.anchor.set(0.5, 0.5);
      const energy = PIXI.Sprite.from(`./assets/cards/ui/energy_${this.options.category.toLowerCase()}.png`);
      cardContainer.addChild(energy, textEnergy);
    }

    cardContainer.interactive = true;
    cardContainer.cursor = 'pointer';
    cardContainer.addChild(textTitle, textDesc, textCardType);
    return cardContainer;
  }
}
