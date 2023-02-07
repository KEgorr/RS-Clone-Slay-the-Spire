import * as PIXI from 'pixi.js';
import './assets/css/style.css';
import './assets/css/reset.css';
import { Card } from './modules/card-generator';
import { ironcladCards } from './modules/cards-ironclad';

const app = new PIXI.Application({
  width: 700,
  height: 700,
  antialias: true,
});

document.body.appendChild(app.view as HTMLCanvasElement);
const button = document.createElement('button');
button.innerHTML = 'add card';
button.style.width = '200px';
button.style.height = '200px';
button.style.transform = 'translateX(-100px)';
button.style.fontSize = '50px';

button.addEventListener('click', nextCard);
document.body.appendChild(button);

function nextCard() {
  // очистить сцену перед добавлением новой карты
  // while (app.stage.children[0]) {
  //   app.stage.removeChild(app.stage.children[0]);
  // }
  app.stage
    .addChild(new Card(ironcladCards[Math.floor(Math.random() * 74)]).render().on('pointerdown', onDragStart))
    .position.set(Math.floor(Math.random() * 350), Math.floor(Math.random() * 250));
}

let dragTarget: PIXI.DisplayObject;

app.stage.interactive = true;
app.stage.hitArea = app.screen;
app.stage.on('pointerup', onDragEnd);
app.stage.on('pointerupoutside', onDragEnd);

function onDragMove(event: PIXI.FederatedPointerEvent) {
  if (dragTarget) {
    // dragTarget.parent.toLocal(event.global, null, dragTarget.position);
    dragTarget.x = event.client.x - 180;
    dragTarget.y = event.client.y - 250;
  }
}

function onDragStart(event: PointerEvent) {
  dragTarget = event.target as PIXI.Container;
  app.stage.on('pointermove', onDragMove);
}

function onDragEnd() {
  if (dragTarget) {
    app.stage.off('pointermove', onDragMove);
  }
}
