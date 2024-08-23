import { playerInfo } from "../../data/playerInfo.js";
import { categories, entity } from "../../data/entity.js";
import { gameInfo } from "../../data/gameInfo.js";
import { setinvincibility } from "./setinvincibility.js";
function handleGameRestart() {
  playerInfo.isGameOver = false;
  for (let i = 0; i < playerInfo.boostTimeEvent; i++) {
    playerInfo.boostTimeEvent[i].destroy();
  }
  gameInfo.gameRef.sound.add('restart').play();
  gameInfo.bgMusic.play();
  playerInfo.boostTimeEvent = [];
  playerInfo.score = 0;
  playerInfo.distanceTraveled = 0;
  playerInfo.inkParticle = [];
  playerInfo.distanceTraveledRounded = 0;
  playerInfo.life = 3;
  playerInfo.inkGenCounter = 0;
  playerInfo.prevDistanceTraveledRounded = 0;
  playerInfo.heartEntity = [];
  playerInfo.currLane = 0;
  setinvincibility(true);
  playerInfo.hasGameRestarted = true;
  playerInfo.finishedLaneSwitching = true;
  playerInfo.playerSpeed = playerInfo.ogPlayerSpeed;
  playerInfo.isBoosting = false;
  playerInfo.isDownDown = false;
  playerInfo.isUpDown = false;
  playerInfo.inkBarAmount = 4,
  playerInfo.playerSpeed -= playerInfo.speedboost;
  categories.forEach(category => {
    category.prevDistanceTraveledRounded = 0;
  });
  Object.keys(entity).forEach(singleEntity => {
    entity[singleEntity].ref=[];
  })
  this.scene.stop('GameOver').launch('GameScene');
}

export {handleGameRestart}