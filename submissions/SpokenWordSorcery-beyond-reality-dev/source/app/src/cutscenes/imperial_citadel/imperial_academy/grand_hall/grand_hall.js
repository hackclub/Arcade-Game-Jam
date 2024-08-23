const { printLines, requireAnswer } = require("../../../../general");
const { getValue, changeValue } = require("../../../../save_data");
const { handleMovement } = require("../../../../handle_input");

async function grandHallEncounter() {
  if (
    getValue("imperialAcademy.armory", true).isVisited == false ||
    getValue("imperialAcademy.militaryAnnex", true).isVisited == false
  ) {
    if (getValue("imperialAcademy.barracks", true).isVisited == false) {
      printLines(
        "app/src/cutscenes/imperial_citadel/imperial_academy/grand_hall/1.txt"
      );
      return;
    } else {
      printLines(
        "app/src/cutscenes/imperial_citadel/imperial_academy/grand_hall/2.txt"
      );
    }
    await requireAnswer(
      ["yes", "y"],
      '"I want the truth," he said. "Is this everyone?"'
    );
    printLines(
      "app/src/cutscenes/imperial_citadel/imperial_academy/grand_hall/3.txt"
    );
    await requireAnswer(
      ["yes", "y"],
      '"I am afraid you do not have much of a choice," he scolded. "So I will ask again, are you ready?'
    );
    printLines(
      "app/src/cutscenes/imperial_citadel/imperial_academy/grand_hall/4.txt"
    );
    await requireAnswer(
      ["no", "n"],
      "You try to speak, but the words catch in your throat. Your oath requires you to answer honestly."
    );
    printLines(
      "app/src/cutscenes/imperial_citadel/imperial_academy/grand_hall/5.txt"
    );
    await requireAnswer(["yes", "y"], '"Is that clear?"');
    printLines(
      "app/src/cutscenes/imperial_citadel/imperial_academy/grand_hall/6.txt"
    );
    changeValue("imperialAcademy.longPassage.isLocked", false, "locations");
  } else if (
    getValue("imperialAcademy.militaryAnnex", true).cutscenePlayed == true
  ) {
    printLines(
      "app/src/cutscenes/imperial_citadel/imperial_academy/grand_hall/7.txt"
    );
    await requireAnswer(["any"], "unreachable");
    printLines(
      "app/src/cutscenes/imperial_citadel/imperial_academy/grand_hall/8.txt"
    );
    changeValue("imperialAcademy.longPassage.isLocked", true, "locations");
    changeValue("imperialAcademy.shortHallway_02.isLocked", true, "locations");
    changeValue("imperialAcademy.hallGates.isLocked", false, "locations");
    changeValue(
      "imperialAcademy.longPassage.lockedDescription",
      "The door to the long passage has collapsed, blocking the way.",
      "locations"
    );
    changeValue(
      "imperialAcademy.shortHallway_02.lockedDescription",
      "The door to the short hallway has collapsed, blocking the way.",
      "locations"
    );
    changeValue(
      "imperialAcademy.grandHall.description",
      "The grand hall, once impressive, is now desolate. Nothing of value remains, with even the soldiers' weapons and armor having been stripped from their bodies. By whom, you cannot say.",
      "locations"
    );
    handleMovement("load");
    changeValue("imperialAcademy.grandHall.cutscenePlayed", true, "locations");
  }
}

module.exports = { grandHallEncounter };
