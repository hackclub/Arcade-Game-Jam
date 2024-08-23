const {
  printLines,
  requireAnswer,
  quickPrint,
} = require("../../../../general");
const { getValue, changeValue } = require("../../../../save_data");

async function survivorsCamp() {
  printLines(
    "app/src/cutscenes/imperial_citadel/imperial_academy/survivors_camp/1.txt"
  );
  var name = getValue("name");
  await requireAnswer(
    name,
    "I don't know that name. If you are truly a survivor, and you wish to remain so, you will answer my question honestly."
  );
  quickPrint(`"Ah, Acolyte ${name}."`);
  printLines(
    "app/src/cutscenes/imperial_citadel/imperial_academy/survivors_camp/2.txt"
  );
  var response = await requireAnswer(
    ["yes", "y", "no", "n"],
    "Do you tell them about the Codex?"
  );
  if (response == "yes" || response == "y") {
    printLines(
      "app/src/cutscenes/imperial_citadel/imperial_academy/survivors_camp/3.txt"
    );
  } else if (response == "no" || response == "n") {
    printLines(
      "app/src/cutscenes/imperial_citadel/imperial_academy/survivors_camp/4.txt"
    );
  }
  changeValue(
    "imperialAcademy.survivorsCamp.cutscenePlayed",
    true,
    "locations"
  );
}

module.exports = { survivorsCamp };
