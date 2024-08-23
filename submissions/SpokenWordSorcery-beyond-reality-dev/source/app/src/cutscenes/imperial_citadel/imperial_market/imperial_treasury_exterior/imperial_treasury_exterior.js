const { handleCombat } = require("../../../../combat");
const { printLines } = require("../../../../general");
const { getValue, changeValue } = require("../../../../save_data");

async function imperialTreasuryExterior() {
  if (
    getValue("imperialMarket.imperialTreasuryExterior", true).cutscenePlayed ==
    false
  ) {
    await printLines(
      "app/src/cutscenes/imperial_citadel/imperial_market/imperial_treasury_exterior/1.txt"
    );
    await requireAnswer(["any"], "unreachable");
    await handleCombat();
    if (getValue("location") == "imperialMarket.imperialTreasuryExterior") {
      await printLines(
        "app/src/cutscenes/imperial_citadel/imperial_market/imperial_treasury_exterior/2.txt"
      );
      var choice = await requireAnswer(
        ["yes", "y", "no", "n"],
        "Do you tell him that the Grandmaster sent you to keep the Codex safe from the rebels?"
      );
      if (choice == "yes" || choice == "y") {
        await printLines(
          "app/src/cutscenes/imperial_citadel/imperial_market/imperial_treasury_exterior/3.txt"
        );
      } else if (choice == "no" || choice == "n") {
        await printLines(
          "app/src/cutscenes/imperial_citadel/imperial_market/imperial_treasury_exterior/4.txt"
        );
      }
      changeValue(
        "imperialMarket.imperialTreasuryExterior.cutscenePlayed",
        true,
        "locations"
      );
    }
  }
}

module.exports = { imperialTreasuryExterior };
