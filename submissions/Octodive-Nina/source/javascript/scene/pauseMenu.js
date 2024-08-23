import { gameInfo } from "../data/gameInfo.js";
import { playerInfo } from "../data/playerInfo.js";
import { config } from "../../script.js";

export default class PauseMenu extends Phaser.Scene {
  constructor() {
      super({ key: 'PauseMenu' });
  }
  preload() {
    this.load.audio('restart', 'assets/audio/sfx/restart.wav');
  }
  create() {
    if (gameInfo.pauseMenuLaunched==false) {
      let center = config.width/2;
      gameInfo.pauseMenu = this.add.container(0, 0);
      let pauseTint = this.add.graphics();
      pauseTint.fillStyle(0x000000, 0.5);
      pauseTint.fillRect(0, 0, config.width, config.height);

      this.scene.bringToTop();
      let pauseText = this.add.text(center, 250, 'Game is Paused', { font:'bold 80px Open Sans', fontFamily: 'Open Sans, sans-serif', fontStyle: 'bold'}).setOrigin(0.5, 0.5).setDepth(10);
      let resumeText = this.add.text(center, 350, 'Press "Z" to Resume', { font:'bold 40px Open Sans', fontFamily: 'Open Sans, sans-serif', fontStyle: 'bold'}).setOrigin(0.5, 0.5).setDepth(10);
      gameInfo.pauseMenuLaunched = true;
      gameInfo.pauseMenu.add([pauseTint, pauseText, resumeText]);
    } else {
      gameInfo.pauseMenu.setVisible(true);
    }
    playerInfo.zKeyPause = this.input.keyboard.on('keydown_Z', function () {
      //this.sound.add('pageFlip').play();
      if (gameInfo.isGamePaused==true) {
        gameInfo.isGamePaused = false;
        this.sound.add('restart').play();

        gameInfo.pauseMenu.setVisible(false);
        this.scene.resume("GameScene");
        this.scene.pause('PauseMenu');
      }
    }, this);

    /*playerInfo.xKeyExit = this.input.keyboard.on('keydown_X', function () {
      //this.sound.add('pageFlip').play();
      console.log('trigger')
      //this.scene.stop('StartMenu').launch('GameScene');
      gameInfo.pauseMenu.setVisible(false);
        
      this.scene.launch("StartMenu");
      this.scene.stop('GameScene');
    }, this);*/
  }

  update() {
  }
}