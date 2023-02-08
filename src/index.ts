/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import * as PIXI from 'pixi.js';
import './assets/css/style.css';
import './assets/css/reset.css';
import { Card } from './modules/card-generator';
// import { ironcladCards } from './modules/cards-ironclad';
import { colorlessCards } from './modules/cards-colorless';

import { Point } from 'pixi.js';

const app = new PIXI.Application({
  width: window.innerWidth - 10,
  height: window.innerHeight - 10,
  antialias: true,
});

document.body.appendChild(app.view as HTMLCanvasElement);

let dragTarget: PIXI.Container | null;
let pointerInCard: PIXI.Point;

function onDragMove(event: PIXI.FederatedPointerEvent) {
  if (dragTarget) {
    const pointerPosition = new Point(event.clientX, event.clientY);
    dragTarget.x = pointerPosition.x - pointerInCard.x;
    dragTarget.y = pointerPosition.y - pointerInCard.y;
  }
}

function onDragStart(event: PointerEvent) {
  dragTarget = event.target as PIXI.Container;
  dragTarget.zIndex = 1;
  app.stage.sortChildren();
  const targetPosition = (event.target as PIXI.Container).position;
  const pointerPosition = new Point(event.clientX, event.clientY);
  pointerInCard = new Point(pointerPosition.x - targetPosition.x, pointerPosition.y - targetPosition.y);
  console.log('pointerInCard', pointerInCard);
}

function onDragEnd() {
  if (dragTarget) {
    dragTarget.zIndex = 0;
    app.stage.sortChildren();
    dragTarget = null;
  }
}

function onPointerOver(event: PointerEvent) {
  (event.target as PIXI.Container).zIndex = 1;
  app.stage.sortChildren();
}
function onPointerOut(event: PointerEvent) {
  (event.target as PIXI.Container).zIndex = 0;
  app.stage.sortChildren();
}

function addCard(n: number) {
  const arr = new Array(n)
    .fill(0)
    .map((item, index) => 0 + index)
    .reverse();
  arr.forEach((item) => {
    const card: PIXI.Container = new Card(colorlessCards[item]).render();
    card.position.set(200 * item, 500);
    card.on('pointerdown', onDragStart);
    card.on('pointerup', onDragEnd);
    card.on('pointerupoutside', onDragEnd);
    card.on('pointermove', onDragMove);
    card.on('pointerover', onPointerOver);
    card.on('pointerout', onPointerOut);
    app.stage.addChild(card);
  });
}

app.stage.interactive = true;
addCard(7);
