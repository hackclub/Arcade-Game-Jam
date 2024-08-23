const { printLines, requireAnswer } = require("../../../../general");
const { getValue, changeValue } = require("../../../../save_data");

async function guardTowers() {
  if (
    getValue("imperialPalace.guardTowers", true).cutscenePlayed == false &&
    getValue("imperialPalace.guardTowers", true).isVisited == false
  ) {
    await printLines(
      "app/src/cutscenes/imperial_citadel/imperial_palace/guard_towers/1.txt"
    );
    var choice = await requireAnswer(["1", "2"], "What do you do?");
    if (choice == "1") {
      await printLines(
        "app/src/cutscenes/imperial_citadel/imperial_palace/guard_towers/2.txt"
      );
      addEntity("Imperial Writ of Entry", "inventory");
    } else if (choice == "2") {
      await printLines(
        "app/src/cutscenes/imperial_citadel/imperial_palace/guard_towers/3.txt"
      );
      await requireAnswer(["any"], "unreachable");
      await printLines(
        "app/src/cutscenes/imperial_citadel/imperial_palace/guard_towers/2.txt"
      );
      addEntity("Imperial Writ of Entry", "inventory");
    }
  } else if (
    getValue("imperialPalace.guardTowers", true).cutscenePlayed == false &&
    getValue("imperialPalace.guardTowers", true).isVisited == true
  ) {
    var inventory = getValue("inventory");
    for (var i = 0; i < inventory.length; i++) {
      if (inventory[i].name == "Emperor's Personal Effects") {
        await printLines(
          "app/src/cutscenes/imperial_citadel/imperial_palace/guard_towers/4.txt"
        );
        changeValue(
          "imperialPalace.guardTowers.cutscenePlayed",
          true,
          "locations"
        );
        changeValue("imperialPalace.guardTowers.isLocked", false, "locations");
      } else {
        await printLines(
          "app/src/cutscenes/imperial_citadel/imperial_palace/guard_towers/5.txt"
        );
      }
    }
  }
}

module.exports = { guardTowers };
