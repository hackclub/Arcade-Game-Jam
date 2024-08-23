import { playerInfo } from "../../data/playerInfo.js";
import { gameInfo } from "../../data/gameInfo.js";
import { updatePlayerScore } from "../UIUpdate/updatePlayerScore.js";
import { setinvincibility } from "./setinvincibility.js";
function changeLife (change) {
  if (change < 0) {
    playerInfo.life+=change;
    gameInfo.gameRef.sound.add('hurt').play();
    setinvincibility(true, 'hurt');
    gameInfo.gameRef.time.addEvent({
      delay: playerInfo.afterHitInvincibleTime,
      callback: function () {
        setinvincibility(false)
      },
      callbackScope: this,
      loop: false
    })
    if (playerInfo.heartEntity[playerInfo.life]) {
      playerInfo.heartEntity[playerInfo.life].setTexture('heartEmpty');
    }
  } else if (change > 0) {
    if (playerInfo.life < 3) {
      playerInfo.life+=change;
      if (playerInfo.heartEntity[playerInfo.life-1]) {
        playerInfo.heartEntity[playerInfo.life-1].setTexture('heart');
      }
    } else {
      updatePlayerScore(15);
    }

  }
  if (playerInfo.life <= 0) {
    gameInfo.gameRef.sound.add('death').play();
    gameInfo.gameRef.scene.stop('GameScene').launch('GameOver');
    playerInfo.isGameOver = true;
    gameInfo.bgMusic.stop();
  }
}
export {changeLife}