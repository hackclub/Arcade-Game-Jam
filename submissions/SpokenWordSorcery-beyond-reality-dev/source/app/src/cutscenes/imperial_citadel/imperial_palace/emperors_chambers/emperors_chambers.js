const { printLines } = require("../../../../general");
const items = require("../../../../class_collections/item_catalog");
const { addEntity } = require("../../../../save_data");

async function emperorsChambers() {
  await printLines(
    "app/src/cutscenes/imperial_citadel/imperial_palace/emperors_chambers/1.txt"
  );
  var response = await requireAnswer(["yes", "y", "no", "n"], '"Will you accept this ring?"');
  if (response == "yes" || response == "y") {
    await printLines(
      "app/src/cutscenes/imperial_citadel/imperial_palace/emperors_chambers/2.txt"
    );
    var imperialSignet = new items.Accessory(
      "Imperial Signet Ring",
      "A ring bearing the seal of the Emperor, and a symbol of your loyalty",
      0,
      1,
      1
    );
    addEntity(imperialSignet, "inventory");
  } else {
    await printLines(
      "app/src/cutscenes/imperial_citadel/imperial_palace/emperors_chambers/3.txt"
    );
    addEntity(imperialSignet, "inventory");
  }
}

module.exports = { emperorsChambers };