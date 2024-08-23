import { updateInkBar } from "./updateInkBar.js";
import { playerInfo } from "../../data/playerInfo.js";

function changeInk (change) {
  playerInfo.inkBarAmount+=change;
  updateInkBar();
}

export {changeInk}