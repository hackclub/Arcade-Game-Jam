import { gameInfo } from "../data/gameInfo.js";
import { config } from "../../script.js";
import { playerInfo } from "../data/playerInfo.js";

export default class GameOver extends Phaser.Scene {
  constructor() {
      super({ key: 'StartMenu' });
  }
  preload() {
    this.load.image('title1', 'assets/titleScreen/octodiveTitle1.png');
    this.load.image('title2', 'assets/titleScreen/octodiveTitle2.png');
    this.load.image('startMenuBg', 'assets/background/startMenu.png');
    this.load.audio('pageFlip', 'assets/audio/sfx/pageFlip.wav');
    this.load.audio('restart', 'assets/audio/sfx/restart.wav');
  }
  create() {
    this.add.image(0, 0, 'startMenuBg').setOrigin(0, 0).setScale(7.7);
    let title = this.add.container(0, 0, [
      this.add.image(80, 80, 'title2').setOrigin(0, 0).setScale(8),
      this.add.image(0, -20, 'title1').setOrigin(0, 0).setScale(7),
    ])
    title.setPosition(config.width/2-title.getBounds().width/2, 60)

    this.add.text(config.width/2, 460, 'Press "Z" to start', { font:'bold 40px Open Sans', fontFamily: 'Open Sans, sans-serif', color:'back', fontStyle: 'bold'}).setOrigin(0.5, 0.5).setDepth(3);
    this.add.text(config.width/2, 530, 'Press "X" for instructions', { font:'bold 40px Open Sans', fontFamily: 'Open Sans, sans-serif', color:'back', fontStyle: 'bold'}).setOrigin(0.5, 0.5).setDepth(3);
    playerInfo.zKey = this.input.keyboard.on('keydown_Z', function () {
      this.scene.stop('StartMenu').launch('GameScene');
      this.sound.add('restart').play();

    }, this);
    playerInfo.xKey = this.input.keyboard.on('keydown_X', function () {
      this.scene.stop('StartMenu').launch('TutorialScene');
      this.sound.add('pageFlip').play();
    }, this);

  }

  update() {
  }
}