const { printLines } = require("../../../../general");
const { handleMovement } = require("../../../../handle_input");
const { changeValue } = require("../../../../save_data");

async function imperialTreasuryVault() {
  await printLines(
    "app/src/cutscenes/imperial_citadel/imperial_market/imperial_treasury_vault/1.txt"
  );
  changeValue(
    "imperialMarket.imperialTreasuryVault.cutscenePlayed",
    true,
    "locations"
  );
  changeValue(
    "imperialMarket.imperialTreasuryVault.description",
    "The breached room is a small room with a now-revealed secret door to the north leading to a hidden tunnel, and a door to the south leading to a short hallway.",
    "locations"
  );
  changeValue(
    "imperialMarket.imperialTreasuryVault.exits",
    {
      north: "imperialMarket.hiddenTunnel",
      south: "imperialMarket.smallRoom_09",
    },
    "locations"
  );
  handleMovement("load");
}

module.exports = { imperialTreasuryVault };
