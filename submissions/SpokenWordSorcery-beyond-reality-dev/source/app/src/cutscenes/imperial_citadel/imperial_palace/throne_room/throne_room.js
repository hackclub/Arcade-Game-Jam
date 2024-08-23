const { printLines } = require("../../../../general");
const { changeValue } = require("../../../../save_data");

async function throneRoom() {
  await printLines(
    "app/src/cutscenes/imperial_citadel/imperial_palace/throne_room/1.txt"
  );
  changeValue("imperialPalace.throneRoom.cutscenePlayed", true, "locations");
}

module.exports = { throneRoom };
