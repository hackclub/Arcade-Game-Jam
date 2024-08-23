import { playerInfo } from "../../data/playerInfo.js";
import { background } from "../../data/background.js";
import {entity} from "../../data/entity.js";
import {gameInfo} from "../../data/gameInfo.js";
import { addRandomLandDecor } from "../UIUpdate/addRandomLandDecor.js";
let firstLoop = true;

function handleMovingForward() {
  playerInfo.octoHitBoxBound = playerInfo.octoHitBox.getBounds();
  if (background.oceanBg.x-playerInfo.playerSpeed <= -background.oceanBgBound.width) {
    background.oceanBgBound.x = background.oceanBgBound2.x-playerInfo.playerSpeed+background.oceanBgBound2.width;
  } else {
    background.oceanBgBound.x-=playerInfo.playerSpeed/2;
  }
  background.oceanBg.setPosition([background.oceanBgBound.x], [0])
  if (background.oceanBg2.x-playerInfo.playerSpeed <= -background.oceanBgBound2.width) {
    if (firstLoop) {
    background.oceanBgBound2.x = background.oceanBgBound2.width-playerInfo.playerSpeed;
    } else {
    background.oceanBgBound2.x = background.oceanBgBound.x-playerInfo.playerSpeed+background.oceanBgBound.width;
    }
  } else {
    background.oceanBgBound2.x-=playerInfo.playerSpeed/2;
  }
  background.oceanBg2.setPosition([background.oceanBgBound2.x], [0]);

  if (background.sandGround.x-playerInfo.playerSpeed*gameInfo.landMovebackSpeed <= -background.sandGroundBound.width) {
    background.sandGround.x = background.sandGround2.x-playerInfo.playerSpeed*gameInfo.landMovebackSpeed+background.sandGround2Bound.width;
  } else {
    background.sandGround.x-=playerInfo.playerSpeed*gameInfo.landMovebackSpeed;
  }
  if (background.sandGround2.x-playerInfo.playerSpeed <= -background.sandGround2Bound.width) {
    addRandomLandDecor();
    background.groundDecor.x = background.sandGround.x-playerInfo.playerSpeed*gameInfo.landMovebackSpeed+background.sandGroundBound.width;
    background.sandGround2.x = background.sandGround.x-playerInfo.playerSpeed*gameInfo.landMovebackSpeed+background.sandGroundBound.width;
  } else {
    background.groundDecor.x-=playerInfo.playerSpeed*gameInfo.landMovebackSpeed;
    background.sandGround2.x-=playerInfo.playerSpeed*gameInfo.landMovebackSpeed;
  }

  //move everything in entity back
  Object.keys(entity).forEach(singleEntity => {
    entity[singleEntity].moveFunction();
  })
  firstLoop=false;
}

export {handleMovingForward}