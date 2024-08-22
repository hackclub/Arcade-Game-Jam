import { playerInfo } from "../../data/playerInfo.js";

function updateInkBar () {
  if (playerInfo.inkBarAmount == 4) {
    playerInfo.inkBar.setTexture('inkBottle5');
  } else if (playerInfo.inkBarAmount == 3) {
    playerInfo.inkBar.setTexture('inkBottle4');
  } else if (playerInfo.inkBarAmount == 2) {
    playerInfo.inkBar.setTexture('inkBottle3');
  } else if (playerInfo.inkBarAmount == 1) {
    playerInfo.inkBar.setTexture('inkBottle2');
  } else if (playerInfo.inkBarAmount == 0) {
    playerInfo.inkBar.setTexture('inkBottle1');
  }
}

export {updateInkBar}