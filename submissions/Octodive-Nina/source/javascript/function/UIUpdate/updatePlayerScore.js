import { playerInfo } from "../../data/playerInfo.js";
import { moveToCenterOfMenu } from "../UIUpdate/moveToCenterOfMenu.js";

function updatePlayerScore (change) {
  playerInfo.score += change;
  playerInfo.scoreText.setText(`${playerInfo.score}`);
  moveToCenterOfMenu(playerInfo.scoreText,15)
}

export {updatePlayerScore}