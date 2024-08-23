const { printLines, requireAnswer } = require("../../../../general");
const { changeValue } = require("../../../../save_data");

async function palaceEntrance() {
  await printLines(
    "app/src/cutscenes/imperial_citadel/imperial_palace/palace_entrance/1.txt"
  );
  var response = await requireAnswer(
    ["yes", "y", "no", "n"],
    "Do you hand over the items?"
  );
  if (response == "yes" || response == "y") {
    await printLines(
      "app/src/cutscenes/imperial_citadel/imperial_palace/palace_entrance/2.txt"
    );
  } else {
    await printLines(
      "app/src/cutscenes/imperial_citadel/imperial_palace/palace_entrance/3.txt"
    );
  }
  changeValue(
    "imperialPalace.palaceEntrance.cutscenePlayed",
    true,
    "locations"
  );
}

module.exports = { palaceEntrance };
