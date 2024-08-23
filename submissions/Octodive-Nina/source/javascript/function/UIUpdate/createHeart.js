import { gameInfo } from "../../data/gameInfo.js";
import { playerInfo } from "../../data/playerInfo.js";
import { moveToCenterOfMenu } from "./moveToCenterOfMenu.js";
function createHeart(y) {
  let heart;
  heart = gameInfo.gameRef.add.image(0,0, 'heart').setScale(1.8).setOrigin(0, 0).setDepth(10);
  moveToCenterOfMenu(heart, y);
  playerInfo.heartEntity.push(heart);
}

export {createHeart}