const { printLines } = require("../../../../general");
const { addEntity } = require("../../../../save_data");
const items = require("../../../../class_collections/item_catalog");

async function hiddenTunnel() {
  await printLines(
    "app/src/cutscenes/imperial_citadel/imperial_market/hidden_tunnel/1.txt"
  );
  var emperorsEffects = new items.Miscellaneous(
    "Emperor's Personal Effects",
    "A collection of personal items belonging to the Emperor",
    0,
    1,
    1
  );
  addEntity(emperorsEffects, "inventory");
}

module.exports = { hiddenTunnel };
