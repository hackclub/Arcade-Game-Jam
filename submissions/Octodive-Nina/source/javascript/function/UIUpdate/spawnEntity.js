import { gameInfo } from "../../data/gameInfo.js";
import { entity } from "../../data/entity.js";
import { placeCenterOfLane } from "./placeCenterOfLane.js";
import { playerInfo } from "../../data/playerInfo.js";
function spawnEntity(name, lane) {
  if (lane == undefined) {
    lane = Math.floor(Math.random() * 4);
  }
  if (entity[name].scale == undefined) {
    entity[name].scale = 2.3;
  }
  let entityBody
  if (entity[name].indexVal == undefined) {
    entityBody = gameInfo.gameRef.physics.add.sprite(gameInfo.laneWidth, lane*gameInfo.laneHeight, name).setOrigin(0, 0).setDepth(0).setScale(entity[name].scale);
  } else {
    entityBody = gameInfo.gameRef.physics.add.sprite(gameInfo.laneWidth, lane*gameInfo.laneHeight, name).setOrigin(0, 0).setDepth(entity[name].indexVal).setScale(entity[name].scale);
  }
  if (entity[name].src) {
    entityBody.setTexture(entity[name].src[Math.floor(Math.random() * entity[name].src.length)]);
  }
  let entityInfo = {
    entityBody: entityBody,
    lane: lane,
    hasBeenHit: false,
    isMoving: false,
  }
  if (entity[name].backSrc) {
    entityInfo.backEntityBody = gameInfo.gameRef.physics.add.sprite(gameInfo.laneWidth-5, lane*gameInfo.laneHeight-5, entity[name].backSrc).setOrigin(0, 0).setDepth(1).setScale(entity[name].scale+0.2);
  }
  if (entity[name].animationInfo) {
    if (gameInfo.gameRef.anims.get(`idle${name}`)) {
    } else {
      playerInfo.test = gameInfo.gameRef.anims.create({
        key: `idle${name}`,
        frames: gameInfo.gameRef.anims.generateFrameNumbers(name, { start: entity[name].animationInfo.start, end: entity[name].animationInfo.end }),
        frameRate: entity[name].animationInfo.frameRate,
        repeat: -1
      });
    }
    entityInfo.entityBody.anims.play(`idle${name}`, true);
  }
  
  entity[name].ref.push(entityInfo);
  placeCenterOfLane(entityBody, lane)
}

export {spawnEntity}