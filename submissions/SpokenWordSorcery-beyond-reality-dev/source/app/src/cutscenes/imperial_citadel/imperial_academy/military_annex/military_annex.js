const { printLines, requireAnswer } = require("../../../../general");
const { getValue, changeValue } = require("../../../../save_data");
const { handleCombat } = require("../../../../combat");

async function militaryAnnex() {
  if (
    getValue("imperialAcademy.militaryAnnex", true).isVisited == true &&
    getValue("imperialAcademy.militaryAnnex", true).cutscenePlayed == false &&
    getValue("imperialAcademy.armory", true).isVisited == true
  ) {
    await printLines(
      "app/src/cutscenes/imperial_citadel/imperial_academy/military_annex/1.txt"
    );
    await requireAnswer(["any"], "unreachable");
    await handleCombat();
    if (getValue("location") == "imperialAcademy.militaryAnnex") {
      await printLines(
        "app/src/cutscenes/imperial_citadel/imperial_academy/military_annex/2.txt"
      );
      changeValue(
        "imperialAcademy.militaryAnnex.cutscenePlayed",
        true,
        "locations"
      );
    }
  }
}

module.exports = { militaryAnnex };
