const { handleCombat } = require("../../../../combat");
const { printLines } = require("../../../../general");
const {
  getValue,
  changeValue,
  calculateValue,
} = require("../../../../save_data");

async function marketStalls() {
  if (getValue("imperialMarket.marketStalls", true).cutscenePlayed == false) {
    await printLines(
      "app/src/cutscenes/imperial_citadel/imperial_market/market_stalls/1.txt"
    );
    await requireAnswer(["any"], "unreachable");
    await handleCombat();
    if (getValue("location") == "imperialMarket.marketStalls") {
      await printLines(
        "app/src/cutscenes/imperial_citadel/imperial_market/market_stalls/2.txt"
      );
      calculateValue("gold", "add", 100);
      changeValue(
        "imperialMarket.marketStalls.cutscenePlayed",
        true,
        "locations"
      );
    }
  }
}

module.exports = { marketStalls };
