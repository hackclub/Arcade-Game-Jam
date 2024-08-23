import {playerInfo} from "../../data/playerInfo.js";
import {gameInfo} from "../../data/gameInfo.js";

function setinvincibility (state, cause) {
  let invincibleIndicatorTime;
  playerInfo.isInvincible = state;
  if (state == true) {
    playerInfo.invincibilityTimeEvent.forEach(invincibilityEvent => {
      //console.log(invincibilityEvent)
      //gameInfo.gameRef.time.removeEvent(invincibilityEvent)
      invincibilityEvent.destroy();
    })
    if (cause == undefined || cause == 'boost') {
      invincibleIndicatorTime = playerInfo.boostDuration+playerInfo.BoostExtraInvincibleTime,
      playerInfo.player.setTint(0xddddff);
    } else if (cause == 'hurt') {
      invincibleIndicatorTime = playerInfo.afterHitInvincibleTime,
      playerInfo.player.setTint(0xff8888);
    }

    let invincibilityEvent = gameInfo.gameRef.time.addEvent({
      delay: invincibleIndicatorTime,
      callback: function () {
        playerInfo.player.setTint(0xffffff);
      },
      callbackScope: gameInfo.gameRef,
      loop: false
    })
    if (state == true) {
      playerInfo.invincibilityTimeEvent.push(invincibilityEvent)
    }
  }
}

export {setinvincibility}