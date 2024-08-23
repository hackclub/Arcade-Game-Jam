import { playerInfo } from "../../data/playerInfo.js"

function updateInkGenCircle() {
  playerInfo.inkGenCircle.setTexture(`inkGenCircle${playerInfo.inkGenCounter}`);
}

export {updateInkGenCircle}