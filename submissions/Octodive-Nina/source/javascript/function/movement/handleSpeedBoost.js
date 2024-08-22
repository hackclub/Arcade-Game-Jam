import { gameInfo } from "../../data/gameInfo.js";
import { playerInfo } from "../../data/playerInfo.js";
import { updateInkBar } from "../UIUpdate/updateInkBar.js";
import { setinvincibility } from "../UIUpdate/setinvincibility.js";
function handleSpeedBoost(speedboost, time) {
  //spawn ink

  let inkParticleImg = gameInfo.gameRef.physics.add.sprite(80, 25+playerInfo.currLane*gameInfo.laneHeight, 'inkParticle').setOrigin(0, 0).setDepth(0).setScale(1.5);
  inkParticleImg.anims.play('inkSwirl', true);
  playerInfo.inkParticle.push(inkParticleImg);

  //inkParticle

  //other
    playerInfo.playerSpeed += speedboost;
    playerInfo.isBoosting = true;
    playerInfo.boostSpeed = speedboost,
    playerInfo.boostTimeEvent.push(gameInfo.gameRef.time.addEvent({
      delay: time,
      callback: function () {
        playerInfo.playerSpeed -= speedboost;
        playerInfo.isBoosting = false;
        for (let i = 0; i < playerInfo.boostTimeEvent.length; i++) {
          playerInfo.boostTimeEvent[i].remove(false);
        }
      },
      callbackScope: gameInfo.ref,
      loop: false
    }))

    gameInfo.gameRef.time.addEvent({
      delay: time+playerInfo.BoostExtraInvincibleTime,
      callback: function () {
        setinvincibility(false)
      },
      callbackScope: gameInfo.ref,
      loop: false
    })

    playerInfo.inkBarAmount -= 1;
    updateInkBar();
}

export {handleSpeedBoost}