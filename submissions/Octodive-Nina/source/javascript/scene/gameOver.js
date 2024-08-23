import { config } from "../../script.js";
import { playerInfo } from "../data/playerInfo.js";
import { generateFunFact } from "../function/UIUpdate/generateFunFact.js";
import { gameInfo } from "../data/gameInfo.js";
import { handleGameRestart } from "../function/UIUpdate/handleGameRestart.js";

let gameOverMenu;
let gameOverText;
let restartText;
let scoreText;
let distanceText;
let funFactDiv;
let didYouKnowText;
let funFactText;

export default class GameOver extends Phaser.Scene {
  constructor() {
      super({ key: 'GameOver' });
  }
  preload() {
    this.load.image('gameOver', 'assets/gameOverMenu.png');
    this.load.image('funFactDiv', 'assets/funFactDiv.png');
    this.load.audio('restart', 'assets/audio/sfx/restart.wav');
  }
  create() {
    let gameOverInfoWidth = config.width/3.5;
    gameOverMenu = this.add.image(0, 0, 'gameOver').setOrigin(0, 0).setScale(7.7);
    gameOverText = this.add.text(0, 0, 'Game Over', { font:'bold 80px Open Sans', fontFamily: 'Open Sans, sans-serif', fontStyle: 'bold'}).setOrigin(0.5, 0.5).setDepth(3);
    gameOverText.setPosition(gameOverInfoWidth, config.height/2-160);
    scoreText = this.add.text(0, 0, `Score: ${playerInfo.score}`, { font:'50px Open Sans', fontFamily: 'Open Sans, sans-serif' }).setOrigin(0.5, 0.5).setDepth(3);
    scoreText.setPosition(gameOverInfoWidth, config.height/2-30);
    distanceText = this.add.text(0, 0, `Distance: ${Math.floor(playerInfo.distanceTraveled)}`, { font:'50px Open Sans', fontFamily: 'Open Sans, sans-serif' }).setOrigin(0.5, 0.5).setDepth(3);
    distanceText.setPosition(gameOverInfoWidth, config.height/2+40);
    restartText = this.add.text(0, 0, 'Press "Z" to restart', { font:'50px Open Sans', fontFamily: 'Open Sans, sans-serif', fill: 'yellow'}).setOrigin(0.5, 0.5).setDepth(3);
    restartText.setPosition(gameOverInfoWidth, config.height/2+150);
    funFactDiv = this.add.image(config.width/2+60, config.height/2, 'funFactDiv').setOrigin(0,0.5).setScale(9);
    funFactDiv = this.add.image(config.width/2+60, config.height/2, 'funFactDiv').setOrigin(0,0.5).setScale(9);
    didYouKnowText = this.add.text(funFactDiv.getBounds().x+funFactDiv.getBounds().width/2, funFactDiv.getBounds().y+30, 'Did You Know?', { font:'bold 43px Open Sans', fontFamily: 'Open Sans, sans-serif', fill:'00008B'}).setOrigin(0.5,0);
    funFactText = this.add.text(funFactDiv.getBounds().x+funFactDiv.getBounds().width/2, funFactDiv.getBounds().y+250, `Fun fact goes here`, { font:'40px Open Sans', fontFamily: 'Open Sans, sans-serif', align: 'center', wordWrap: { width: 300, useAdvancedWrap: true }}).setOrigin(0.5, 0.5).setDepth(3);
    gameInfo.funFactText = funFactText;
    generateFunFact();
    playerInfo.rKey = this.input.keyboard.on('keydown_Z', handleGameRestart, this);
    
  }
  update() {
  }
}