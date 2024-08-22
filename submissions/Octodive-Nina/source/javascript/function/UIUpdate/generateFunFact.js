import { funFactList } from "../../data/funfact.js";
import { gameInfo } from "../../data/gameInfo.js";

function generateFunFact() {
  let randomFunFactNum = Math.floor(Math.random()*funFactList.length);
  gameInfo.funFactText.setText(funFactList[randomFunFactNum]);
}

export {generateFunFact}