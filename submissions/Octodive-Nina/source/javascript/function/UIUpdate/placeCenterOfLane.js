import { gameInfo } from "../../data/gameInfo.js";
function placeCenterOfLane (entity, lane) {
  let entityBound = entity.getBounds();
  entity.setPosition(gameInfo.laneWidth, (lane*gameInfo.laneHeight)+(gameInfo.laneHeight/2)-(entityBound.height/2));
}
export {placeCenterOfLane}