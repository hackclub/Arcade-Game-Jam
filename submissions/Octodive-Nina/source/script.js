
import GameScene from './javascript/scene/gameScene.js';
import GameOver from './javascript/scene/gameOver.js';
import StartMenu from './javascript/scene/startMenu.js';
import TutorialScene from './javascript/scene/tutorial.js';
import {funFactList} from "./javascript/data/funfact.js";
import PauseMenu from "./javascript/scene/pauseMenu.js";
let config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 600,
  scene: {
      preload: preload,
      create: create,
      update: update
  },
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 0 },
        debug: false
    }
  },
  fps: {
    target: 60,
    forceSetTimeOut: true
  },
  pixelArt: true,
  scene: [StartMenu, PauseMenu, TutorialScene, GameScene, GameOver]
};

let game = new Phaser.Game(config);

function preload (){
}

function create () {
  gameInfo.game = game;
}

function update (time, delta) {
}

export {config}