const { printLines, requireAnswer } = require("../../../general");
const { changeValue } = require("../../../save_data");

async function makeshiftThroneRoom() {
  var name = getValue("name");
  await printLines(
    "app/src/cutscenes/paragon_city/makeshift_throne_room/1.txt",
    { name: name }
  );
  var response = await closedInput(["1", "acquiesce", "2", "refuse"]);
  if (response == "1" || response == "acquiesce") {
    await printLines(
      "app/src/cutscenes/paragon_city/makeshift_throne_room/2.txt",
      { name: name }
    );
  } else {
    await printLines(
      "app/src/cutscenes/paragon_city/makeshift_throne_room/3.txt"
    );
    await requireAnswer("any", "unreachable");
    handleCombat();
    if (getValue("location") != "paragonCity.makeshiftThroneRoom") {
      return;
    } else {
      await printLines(
        "app/src/cutscenes/paragon_city/makeshift_throne_room/4.txt"
      );
    }
  }
  changeValue(
    "paragonCity.makeshiftThroneRoom.cutscenePlayed",
    true,
    "locations"
  );
}

module.exports = { makeshiftThroneRoom };
