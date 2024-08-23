const { printLines, quickPrint } = require("../../../../general");
const { openInput, handleMovement } = require("../../../../handle_input");
const { changeValue } = require("../../../../save_data");

async function imperialDreadnoughtUpperDeck() {
  if (
    getValue("imperialPort.imperialDreadnoughtHold", true).cutscenePlayed ==
    true
  ) {
    await printLines(
      "app/src/cutscenes/imperial_citadel/imperial_port/imperial_dreadnought_upper_deck/2.txt"
    );
    var currentMana = getValue("mana");
    var maxMana = getValue("maxMana");
    while (currentMana == maxMana) {
      quickPrint("What Words will you use to save yourself?");
      await openInput();
    }
    await printLines(
      "app/src/cutscenes/imperial_citadel/imperial_port/imperial_dreadnought_upper_deck/3.txt"
    );
    await requireAnswer(["any"], "unreachable");
    var maxHealth = getValue("maxHealth");
    var maxMana = getValue("maxMana");
    changeValue("currentHealth", maxHealth);
    changeValue("currentMana", maxMana);
    changeValue(
      "imperialPort.imperialDreadnoughtUpperDeck.cutscenePlayed",
      true,
      "locations"
    );
    changeValue("location", "unknownShore.rockyBeach");
    handleMovement("load");
  } else {
    await printLines(
      "app/src/cutscenes/imperial_citadel/imperial_port/imperial_dreadnought_upper_deck/1.txt"
    );
    changeValue(
      "imperialPort.imperialDreadnoughtUpperDeck.cutscenePlayed",
      true,
      "locations"
    );
  }
}

module.exports = { imperialDreadnoughtUpperDeck };
