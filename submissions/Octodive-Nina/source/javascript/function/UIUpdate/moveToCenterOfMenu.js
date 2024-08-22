import { gameInfo } from "../../data/gameInfo.js";
function moveToCenterOfMenu(entity, y) {
  entity.setPosition(gameInfo.sidebarMenuBg.getBounds().x+(gameInfo.sidebarMenuBg.getBounds().width/2)-(entity.getBounds().width/2), y);
}
export {moveToCenterOfMenu}