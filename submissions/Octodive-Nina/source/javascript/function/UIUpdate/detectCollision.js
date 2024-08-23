import { playerInfo } from "../data/playerInfo.js";

function detectCollision(entity) {
  let entityBound = entity.getBounds();
  if (playerInfo.currLane == entity.lane && entity.hasBeenHit == false && playerInfo.playerBound.x+playerInfo.playerSpeed > entity.x && playerInfo.playerBound.x+playerInfo.playerSpeed<entityBound.x+entityBound.width) {
    playerInfo.life--;
    entity.hasBeenHit = true;
  }
}

export {detectCollision}