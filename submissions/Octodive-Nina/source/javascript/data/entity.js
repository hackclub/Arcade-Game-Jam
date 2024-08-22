import { gameInfo } from "./gameInfo.js";
import { playerInfo } from "./playerInfo.js";
import { config } from "../../script.js";
import { changeLife } from "../function/UIUpdate/changeLife.js";
import { placeCenterOfLane } from "../function/UIUpdate/placeCenterOfLane.js";
import { updatePlayerScore } from "../function/UIUpdate/updatePlayerScore.js";
import { moveEntityBack } from "../function/movement/moveEntityBack.js";
import { changeInk } from "../function/UIUpdate/changeInk.js";
import { spawnEntity } from "../function/UIUpdate/spawnEntity.js";
//categories: drift, bullet, trash, power, goodies
let entity = {
  silverLoops : {
    ref: [],
    category: 'silverRing',
    isPowerup: true,
    speed: 0,
    indexVal: 4,
    spawnDistanceRate: 1,
    prevDistanceTraveledRounded: 0,
    src: ['silverLoopFront'],
    backSrc: 'silverLoopBack',
    audioSound: 'silverLoopPickup',
    scale: 4.7,
    spawnFunction: () => {
      spawnEntity('silverLoops');
    },
    activateFunctionality: function () {
      updatePlayerScore(1);
    },
    moveFunction: () => {
      moveEntityBack(entity.silverLoops);
    }
  },
  goldLoops : {
    ref: [],
    isPowerup: true,
    speed: 0,
    indexVal: 4,
    src: ['goldLoopFront'],
    backSrc: 'goldLoopBack',
    scale: 4.7,
    spawnDistanceRate: 10,
    audioSound: 'goldLoopPickup',
    prevDistanceTraveledRounded: 0,
    goldLoopSpawnInterval: 3000,
    spawnFunction: () => {
      spawnEntity('goldLoops');
    },
    moveFunction: () => {
      moveEntityBack(entity.goldLoops);
    },
    activateFunctionality: function () {
      updatePlayerScore(10);
    },
  },
  pufferfish : {
    ref: [],
    category:'drift',
    speed: 0.3,
    multiLane: 1,
    spawnDistanceRate: 8,
    prevDistanceTraveledRounded: 0,
    spawnFunction: () => {
      let lane = Math.floor(Math.random() * 3);
      let pufferfish = gameInfo.gameRef.physics.add.sprite(gameInfo.laneWidth, lane*gameInfo.laneHeight, 'pufferfish').setOrigin(0, 0).setDepth(0).setScale(3.9);
      let pufferfishInfo = {
        pufferfish: pufferfish,
        lane: lane,
        hasBeenHit: false,
      }
      entity.pufferfish.ref.push(pufferfishInfo);
    },
    moveFunction : () => {
      entity.pufferfish.ref.forEach(pufferfish => {
        let pufferfishBounds = pufferfish.pufferfish.getBounds();
        pufferfishBounds.x -= playerInfo.playerSpeed-entity.pufferfish.speed;
    
        pufferfish.pufferfish.setPosition(pufferfishBounds.x, pufferfishBounds.y);
        if (playerInfo.isInvincible == false && playerInfo.finishedLaneSwitching == true && (playerInfo.currLane == pufferfish.lane || playerInfo.currLane == pufferfish.lane+1) && pufferfish.hasBeenHit == false && playerInfo.octoDangerHitBoxBound.x+(playerInfo.playerSpeed)+playerInfo.octoDangerHitBoxBound.width >= pufferfishBounds.x && playerInfo.octoDangerHitBoxBound.x+(playerInfo.playerSpeed-0.3) <=pufferfishBounds.x+pufferfishBounds.width) {
          if (playerInfo.finishedLaneSwitching && pufferfish.hasBeenHit == false) {
            changeLife(-1)
            pufferfish.hasBeenHit = true;
          }
        }
      })
    }
  },
  swordfish: {
    ref: [],
    category:'bullet',
    speed: -20,
    scale: 3.9,
    spawnDistanceRate: 5,
    src: ['swordfish', 'swordFishAqua'],
    prevDistanceTraveledRounded: 0,
    warningTime: 1000,
    activateFunctionality: function () {
      changeLife(-1)
    },
    spawnFunction: () => {
      let lane = Math.floor(Math.random() * 4);
      let dangerSign = gameInfo.gameRef.add.image(config.width-200, 30+(lane*gameInfo.laneHeight), 'dangerSign').setScale(3).setOrigin(0, 0);
      gameInfo.gameRef.time.addEvent({
        delay: entity.swordfish.warningTime,
        callback: function () {
          dangerSign.destroy();
          spawnEntity('swordfish', lane);
        },
        callbackScope: this,
        loop: false
      })
    },
    moveFunction: () => {
      moveEntityBack(entity.swordfish)
    }
  },
  trash: {
    ref: [],
    category:'trash',
    speed: 0,
    indexVal: 5,
    src: ['plasticBag', 'bottle', 'plasticRing', 'cigarette', 'crushedCan'],
    spawnDistanceRate: 10,
    prevDistanceTraveledRounded: 0,
    //audioSound: 'audio',
    activateFunctionality: function () {
      changeLife(-1)

    },
    spawnFunction: () => {
      spawnEntity('trash')

    },
    moveFunction: () => {
      moveEntityBack(entity.trash)
    }
  },
  heart: {
    ref: [],
    category:'heart',
    isPowerup: true,
    speed: 0,
    src:['heartOutlined'],
    isDestroyedAfterGrab: true,
    spawnDistanceRate: 30,
    prevDistanceTraveledRounded: 0,
    audioSound: 'heal',
    activateFunctionality: function () {
      changeLife(1)
    },
    spawnFunction: () => {
      spawnEntity('heart')
    },
    moveFunction: () => {
      moveEntityBack(entity.heart)
    }
  },
  inkVial: {
    ref: [],
    speed: 0,
    category: 'ink',
    isPowerup: true,
    isDestroyedAfterGrab: true,
    spawnDistanceRate: 6,
    prevDistanceTraveledRounded: 0,
    audioSound: 'itemPickup',
    activateFunctionality: function () {
      changeInk(1);
    },
    spawnFunction: () => {
      spawnEntity('inkVial')
    },
    moveFunction: () => {
      moveEntityBack(entity.inkVial)
    }
  },
  clownfish: {
    ref: [],
    speed: -1,
    category:'bullet',
    scale: 3,
    spawnDistanceRate: 15,
    src: ['clownfish', 'clownfishClown'],
    prevDistanceTraveledRounded: 0,
    warningTime: 250,
    activateFunctionality: function () {
      changeLife(-1)
    },
    spawnFunction: () => {
      spawnEntity('clownfish')
    },
    moveFunction: () => {
      moveEntityBack(entity.clownfish)
    },
  },
  jellyfish: {
    ref: [],
    speed: 4,
    category:'drift',
    scale: 3,
    spawnDistanceRate: 15,
    prevDistanceTraveledRounded: 0,
    warningTime: 250,
    animationInfo: {
      start: 0,
      end: 6,
      frameRate: 6,
    },
    activateFunctionality: function () {
      changeLife(-1)
    },
    spawnFunction: () => {
      spawnEntity('jellyfish')
    },
    moveFunction: () => {
      moveEntityBack(entity.jellyfish)
    },
  },
}

let categories = [{
  type: 'bullet',
  listOfEntity: [],
  frequency: 6,
  prevDistanceTraveledRounded: 0,
},
{
  type: 'drift',
  listOfEntity: [],
  frequency: 8,
  prevDistanceTraveledRounded: 0,
},
{
  type: 'trash',
  listOfEntity: [],
  frequency: 4,
  prevDistanceTraveledRounded: 0,
},
{
  type: 'silverRing',
  listOfEntity: [],
  frequency: 2,
  prevDistanceTraveledRounded: 0,
},
{
  type: 'heart',
  listOfEntity: [],
  frequency: 35,
  prevDistanceTraveledRounded: 0,
},
{
  type: 'ink',
  listOfEntity: [],
  frequency: 15,
  prevDistanceTraveledRounded: 0,
},
]

export {entity, categories}
