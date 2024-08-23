const { printLines } = require("../../../../general");
const { getValue, changeValue } = require("../../../../save_data");

async function barracksMeeting() {
  if (getValue("imperialAcademy.barracks", true).cutscenePlayed == false) {
    printLines(
      "app/src/cutscenes/imperial_citadel/imperial_academy/barracks_meeting/1.txt"
    );
    changeValue(
      "imperialAcademy.barracks.cutscenePlayed",
      true,
      "locations",
      "cutscenePlayed"
    );
  }
}

module.exports = { barracksMeeting };
