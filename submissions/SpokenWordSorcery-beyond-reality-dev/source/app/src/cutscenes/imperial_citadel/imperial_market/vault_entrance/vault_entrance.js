const { printLines, requireAnswer } = require("../../../../general");
const { handleMovement } = require("../../../../handle_input");
const { getValue, changeValue } = require("../../../../save_data");

async function vaultEntrance() {
  if (getValue("imperialMarket.vaultEntrance", true).cutscenePlayed == false) {
    await printLines(
      "app/src/cutscenes/imperial_citadel/imperial_market/vault_entrance/1.txt"
    );
    await requireAnswer(["yes", "y"], `Aren't you the one who was sent?`);
    await printLines(
      "app/src/cutscenes/imperial_citadel/imperial_market/vault_entrance/2.txt"
    );
    var response = await requireAnswer(
      ["yes", "y", "no", "n"],
      `Are you sure?`
    );
    if (response == "yes" || response == "y") {
      await printLines(
        "app/src/cutscenes/imperial_citadel/imperial_market/vault_entrance/3.txt"
      );
      changeValue(
        "imperialMarket.vaultEntrance.cutscenePlayed",
        true,
        "locations"
      );
    } else {
      await printLines(
        "app/src/cutscenes/imperial_citadel/imperial_market/vault_entrance/4.txt"
      );
      handleMovement("south");
    }
  }
}

module.exports = { vaultEntrance };
