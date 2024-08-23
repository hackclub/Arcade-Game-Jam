const { handleCombat } = require("../../../combat");
const { printLines, requireAnswer } = require("../../../general");
const { closedInput } = require("../../../handle_input");
const { getValue, changeValue } = require("../../../save_data");

async function imperialFortressGates() {
  var name = getValue("name");
  await printLines(
    "app/src/cutscenes/paragon_city/imperial_fortress_gates/1.txt",
    { name: name }
  );
  var response = await closedInput([
    "1",
    "speaking",
    "2",
    "reclaiming",
    "3",
    "none",
    "4",
    "killing",
  ]);
  if (response == "1" || response == "speaking") {
    var inventory = getValue("inventory");
    for (var i = 0; i < inventory.length; i++) {
      if (inventory[i].name == "Imperial Signet Ring") {
        var hasRing = true;
        break;
      } else {
        var hasRing = false;
      }
    }
    if (hasRing) {
      await printLines(
        "app/src/cutscenes/paragon_city/imperial_fortress_gates/2.txt",
        { name: name }
      );
    } else {
      await printLines(
        "app/src/cutscenes/paragon_city/imperial_fortress_gates/3.txt",
        { name: name }
      );
      await requireAnswer("any", "unreachable");
      handleCombat();
      if (getValue("location") != "paragonCity.imperialFortressGates") {
        return;
      }
    }
  } else if (response == "2" || response == "reclaiming") {
    var inventory = getValue("inventory");
    for (var i = 0; i < inventory.length; i++) {
      if (inventory[i].name == "Imperial Signet Ring") {
        var hasRing = true;
        break;
      } else {
        var hasRing = false;
      }
    }
    if (hasRing) {
      await printLines(
        "app/src/cutscenes/paragon_city/imperial_fortress_gates/4.txt",
        { name: name }
      );
    } else {
      await printLines(
        "app/src/cutscenes/paragon_city/imperial_fortress_gates/5.txt",
        { name: name }
      );
      await requireAnswer("any", "unreachable");
      handleCombat();
      if (getValue("location") != "paragonCity.imperialFortressGates") {
        return;
      }
    }
  } else if (response == "3" || response == "none") {
    var inventory = getValue("inventory");
    for (var i = 0; i < inventory.length; i++) {
      if (inventory[i].name == "Imperial Signet Ring") {
        var hasRing = true;
        break;
      } else {
        var hasRing = false;
      }
    }
    if (hasRing) {
      await printLines(
        "app/src/cutscenes/paragon_city/imperial_fortress_gates/6.txt"
      );
    } else {
      await printLines(
        "app/src/cutscenes/paragon_city/imperial_fortress_gates/7.txt"
      );
      await requireAnswer("any", "unreachable");
      handleCombat();
      if (getValue("location") != "paragonCity.imperialFortressGates") {
        return;
      }
    }
  } else if (response == "4" || response == "killing") {
    await printLines(
      "app/src/cutscenes/paragon_city/imperial_fortress_gates/8.txt"
    );
    await requireAnswer("any", "unreachable");
    handleCombat();
    if (getValue("location") != "paragonCity.imperialFortressGates") {
      return;
    }
  }
  changeValue(
    "paragonCity.imperialFortressGates.cutscenePlayed",
    true,
    "locations"
  );
}

module.exports = { imperialFortressGates }
