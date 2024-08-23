const { handleCombat } = require("../../../combat");
const { printLines, toTitleCase } = require("../../../general");
const { closedInput } = require("../../../handle_input");
const { generateName } = require("../../../proc_gen");
const { changeValue, getValue } = require("../../../save_data");

async function cityEntrance() {
  var inventory = getValue("inventory");
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].name == "Imperial Signet Ring") {
      var hasRing = true;
      break;
    } else {
      var hasRing = false;
    }
  }
  var name = getValue("player.name");
  var leaderName = generateName("male fullName");
  var location = getValue("location");
  var entrance = location.split(".")[1];
  entrance = entrance.split(/(?=[A-Z])/).join(" ");
  entrance = toTitleCase(entrance);
  if (hasRing) {
    await printLines("app/src/cutscenes/paragon_city/city_entrance/1.txt", {
      name: name,
      leaderName: leaderName,
      entrance: entrance,
    });
    var response = await closedInput(
      ["1", "you are mistaken", "2", "i am who you think i am"],
      "What do you say?"
    );
    if (response == "1" || response == "you are mistaken") {
      await printLines("app/src/cutscenes/paragon_city/city_entrance/3.txt", {
        name: name,
        leaderName: leaderName,
      });
    } else {
      await printLines("app/src/cutscenes/paragon_city/city_entrance/4.txt", {
        name: name,
        leaderName: leaderName,
      });
      changeValue("claimedThrone", true);
    }
  } else {
    await printLines("app/src/cutscenes/paragon_city/city_entrance/2.txt", {
      name: name,
      leaderName: leaderName,
      entrance: entrance,
    });
    handleCombat();
    if (
      getValue("location") != paragonCityTile.entrance_1 &&
      getValue("location") != paragonCityTile.entrance_2 &&
      getValue("location") != paragonCityTile.entrance_3 &&
      getValue("location") != paragonCityTile.entrance_4
    ) {
      return;
    }
  }
  changeValue("paragonCityTile.entrance_1.cutscenePlayed", true, "locations");
  changeValue("paragonCityTile.entrance_1.enemies", [], "locations");
  changeValue("paragonCityTile.entrance_2.cutscenePlayed", true, "locations");
  changeValue("paragonCityTile.entrance_2.enemies", [], "locations");
  changeValue("paragonCityTile.entrance_3.cutscenePlayed", true, "locations");
  changeValue("paragonCityTile.entrance_3.enemies", [], "locations");
  changeValue("paragonCityTile.entrance_4.cutscenePlayed", true, "locations");
  changeValue("paragonCityTile.entrance_4.enemies", [], "locations");
}

module.exports = {
  cityEntrance,
};
