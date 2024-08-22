import { config } from "../../script.js";
import { gameInfo } from "../data/gameInfo.js";
import { playerInfo } from "../data/playerInfo.js";
export default class GameOver extends Phaser.Scene {
  constructor() {
      super({ key: 'TutorialScene' });
  }
  preload() {
    this.load.audio('restart', 'assets/audio/sfx/restart.wav');
    this.load.audio('pageFlip', 'assets/audio/sfx/pageFlip.wav');
    this.load.image('downArrow', 'assets/titleScreen/downArrow.png');
    this.load.image('upArrow', 'assets/titleScreen/upArrow.png');
    this.load.image('rightArrow', 'assets/titleScreen/rightArrow.png');
    this.load.image('menuBg', 'assets/gameOverMenu.png');

    this.load.image('swordfish', 'assets/enemy/swordFish.png');
    this.load.image('plasticRing', 'assets/enemy/plasticRing.png');
    this.load.image('jellyfishSingle', 'assets/enemy/jellyfishSingle.png');

    this.load.image('goldLoop', 'assets/gold-ring/gold-ring.png');
    this.load.image('silverLoop', 'assets/silver-ring/silver-ring.png');
    this.load.image('inkVial', 'assets/ink-bottle/inkVial.png');
    this.load.image('oceanHeartOutlined', 'assets/oceanHeartOutlined.png');

    this.load.image('inkBottle', 'assets/ink-bottle/inkBottle1.png');
    this.load.image('inkBottleHalf', 'assets/ink-bottle/inkBottle3.png');
    this.load.image('inkGenerationBar', 'assets/inkGenerationBar/newInkBar5.png');
    this.load.image('plus', 'assets/plus.png');
    this.load.image('equal', 'assets/equal.png');
  
    this.load.image('zKeyIcon', 'assets/zBtnIcon.png');
    this.load.image('pauseIcon', 'assets/pauseIcon.png');
  }
  create() {
    let currentPage = 0;
    let keyXPos = 250;
    let keyYPos = 80;
    this.add.image(0, 0, 'menuBg').setOrigin(0, 0).setScale(7.7);
    let pages = []
    let upArrowImg;
    let controllerPage = this.add.container(0, 0, [
      upArrowImg = this.add.image(keyXPos, keyYPos, 'upArrow').setOrigin(0, 0).setScale(7.7),
      this.add.image(keyXPos, keyYPos+140, 'downArrow').setOrigin(0, 0).setScale(7.7),
      this.add.image(keyXPos, keyYPos+140*2, 'rightArrow').setOrigin(0, 0).setScale(7.7),
      this.add.text(keyXPos + upArrowImg.getBounds().width+50, keyYPos+20, 'Up Arrow to move up', { font:'bold 40px Open Sans', fontFamily: 'Open Sans, sans-serif', fontStyle: 'bold'}).setOrigin(0, 0).setDepth(3),
      this.add.text(keyXPos + upArrowImg.getBounds().width+50, keyYPos+140+20, 'Down Arrow to move down', { font:'bold 40px Open Sans', fontFamily: 'Open Sans, sans-serif', fontStyle: 'bold'}).setOrigin(0, 0).setDepth(3),
      this.add.text(keyXPos + upArrowImg.getBounds().width+50, keyYPos+140*2+20, 'Right Arrow to dash', { font:'bold 40px Open Sans', fontFamily: 'Open Sans, sans-serif', fontStyle: 'bold'}).setOrigin(0, 0).setDepth(3),
    ])
    pages.push(controllerPage);
    let enemyPage = this.add.container(0, 0, [
      this.add.text(keyXPos + upArrowImg.getBounds().width+50, keyYPos+20, 'Dodge enemies', { font:'bold 40px Open Sans', fontFamily: 'Open Sans, sans-serif', fontStyle: 'bold'}).setOrigin(0, 0).setDepth(3),
      this.add.image(keyXPos, keyYPos+140*2, 'swordfish').setOrigin(0.5, 0.5).setScale(4),
      this.add.image(keyXPos*2+50, keyYPos+140*2, 'plasticRing').setOrigin(0.5, 0.5).setScale(4),
      this.add.image(keyXPos*3+50, keyYPos+140*2, 'jellyfishSingle').setOrigin(0.5, 0.5).setScale(4),
    ])
    pages.push(enemyPage);

    let objectivePage = this.add.container(0, 0, [
      this.add.text(config.width/2, keyYPos+20, 'Go through loops for points', { font:'bold 40px Open Sans', fontFamily: 'Open Sans, sans-serif', fontStyle: 'bold'}).setOrigin(0.5, 0).setDepth(3),
      this.add.text(config.width/2, keyYPos+70, 'Green outline means collectable', { font:'bold 30px Open Sans', fontFamily: 'Open Sans, sans-serif', fontStyle: 'bold'}).setOrigin(0.5, 0).setDepth(3),
      this.add.image(keyXPos-40, keyYPos+140*2, 'inkVial').setOrigin(0.5, 0.5).setScale(5),
      this.add.image(keyXPos*2-80, keyYPos+140*2, 'goldLoop').setOrigin(0.5, 0.5).setScale(6),
      this.add.image(keyXPos*2+100, keyYPos+140*2, 'silverLoop').setOrigin(0.5, 0.5).setScale(6),
      this.add.image(keyXPos*3+50, keyYPos+140*2, 'oceanHeartOutlined').setOrigin(0.5, 0.5).setScale(4),
    ])
    pages.push(objectivePage);
    let dashPage = this.add.container(0, 0, [
      this.add.text(config.width/2, keyYPos+20, 'Dashing grants temporary invincibility', { font:'bold 40px Open Sans', fontFamily: 'Open Sans, sans-serif', fontStyle: 'bold'}).setOrigin(0.5, 0).setDepth(3),
      this.add.text(config.width/2, keyYPos+70, 'Each dash costs ink which regenerates slowly', { font:'bold 30px Open Sans', fontFamily: 'Open Sans, sans-serif', fontStyle: 'bold'}).setOrigin(0.5, 0).setDepth(3),
      this.add.image(keyXPos-80, keyYPos+140*2, 'inkBottleHalf').setOrigin(0.5, 0.5).setScale(2.6),
      this.add.image(keyXPos+90, keyYPos+140*2, 'plus').setOrigin(0.5, 0.5).setScale(8),
      this.add.image(keyXPos*3+100, keyYPos+140*2, 'inkBottle').setOrigin(0.5, 0.5).setScale(2.6),
      this.add.image(keyXPos*3-60, keyYPos+140*2, 'equal').setOrigin(0.5, 0.5).setScale(8),
      this.add.image(keyXPos*2+20, keyYPos+140*2, 'inkGenerationBar').setOrigin(0.5, 0.5).setScale(4),
    ])
    pages.push(dashPage);
    let goodLuckPage = this.add.container(0, 0, [
      this.add.text(config.width/2, keyYPos+20, 'GoodLuck! Continuing will begin the game', { font:'bold 40px Open Sans', fontFamily: 'Open Sans, sans-serif', fontStyle: 'bold'}).setOrigin(0.5, 0).setDepth(3),
      this.add.text(config.width/2, keyYPos+70, 'Feel free to press z if you ever want to pause', { font:'bold 30px Open Sans', fontFamily: 'Open Sans, sans-serif', fontStyle: 'bold'}).setOrigin(0.5, 0).setDepth(3),
      this.add.image(keyXPos+120, keyYPos+140*2, 'zKeyIcon').setOrigin(0.5, 0.5).setScale(4),
      this.add.image(keyXPos*2+130, keyYPos+140*2, 'pauseIcon').setOrigin(0.5, 0.5).setScale(4),
    ])
    pages.push(goodLuckPage);

    this.add.text(config.width/2, 530, 'Press "Z" to continue or Press "X" to return to the menu', { font:'bold 28px Open Sans', fontFamily: 'Open Sans, sans-serif', fontStyle: 'bold', fill: 'yellow'}).setOrigin(0.5, 0.5).setDepth(3);

    for (let i = 0; i < pages.length; i++) {
      pages[i].setVisible(false);
      if (i == currentPage) {
        pages[i].setVisible(true);
      }
    }

    playerInfo.zKeyTutorial = this.input.keyboard.on('keydown_Z', function () {
      currentPage++;
      this.sound.add('pageFlip').play();
      for (let i = 0; i < pages.length; i++) {
        pages[i].setVisible(false);
        if (i == currentPage) {
          pages[i].setVisible(true);
        }
      }
      if (currentPage == pages.length) {
        this.sound.add('restart').play();
        this.scene.stop('TutorialScene').launch('GameScene');
      }
    }, this);
    playerInfo.xKeyTutorial = this.input.keyboard.on('keydown_X', function () {
      this.sound.add('pageFlip').play();
      this.scene.stop('TutorialScene').launch('StartMenu');
    }, this);
  }
  update() {
  }
}