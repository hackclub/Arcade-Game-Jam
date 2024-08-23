const { printLines, requireAnswer } = require("../../../../general");
const { addEntity, changeValue } = require("../../../../save_data");
const { Dagger } = require("../../../../class_collections/item_catalog");
const {
  Fire,
  Water,
  Life,
} = require("../../../../class_collections/spellbook");

async function restOfAcademy() {
  printLines(
    "app/src/cutscenes/imperial_citadel/imperial_academy/rest_of_academy/1.txt"
  );
  await requireAnswer(
    ["yes", "y"],
    '"Really?" he asked incredulously. "Come on. Surely you want to know?"'
  );
  printLines(
    "app/src/cutscenes/imperial_citadel/imperial_academy/rest_of_academy/2.txt"
  );
  var dagger = new Dagger(
    1,
    "Imperial Dagger",
    "A dagger that once belonged to an Imperial Adept, before he sacrificed his life for your benefit"
  );
  var fire = new Fire();
  var water = new Water();
  var life = new Life();
  addEntity(dagger, "inventory");
  addEntity(fire, "knownSpells");
  addEntity(water, "knownSpells");
  addEntity(life, "knownSpells");
  changeValue("currentMana", getValue("maxMana"));
  changeValue("currentHealth", getValue("maxHealth"));
  changeValue("imperialAcademy.vault.isLocked", false, "locations");
}

module.exports = { restOfAcademy };
