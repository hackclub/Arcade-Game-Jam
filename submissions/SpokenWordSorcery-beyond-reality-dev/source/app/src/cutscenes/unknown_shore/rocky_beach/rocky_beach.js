const { printLines } = require("../../../general");
const { closedInput } = require("../../../handle_input");
const { generateName } = require("../../../proc_gen");
const { changeValue, removeEntity } = require("../../../save_data");

var peasantName = generateName("male fullName");
var villageName = generateName("town") + " Village";

async function rockyBeach() {
  await printLines("app/src/cutscenes/unknown_shore/rocky_beach/1.txt");
  var response = await closedInput([
    "1",
    "approach",
    "approach the figure",
    "2",
    "ignore",
    "ignore the figure",
  ]);
  if (
    response == "1" ||
    response == "approach" ||
    response == "approach the figure"
  ) {
    await printLines("app/src/cutscenes/unknown_shore/rocky_beach/2.txt", {
      peasantName: peasantName,
    });
  } else {
    await printLines("app/src/cutscenes/unknown_shore/rocky_beach/3.txt", {
      peasantName: peasantName,
    });
  }
  await closedInput(["yes", "y", "no", "n"], '"You get it, right?');
  if (response == "yes" || response == "y") {
    await printLines("app/src/cutscenes/unknown_shore/rocky_beach/4.txt", {
      peasantName: peasantName,
    });
  } else {
    await printLines("app/src/cutscenes/unknown_shore/rocky_beach/5.txt", {
      peasantName: peasantName,
    });
  }
  await closedInput(
    [
      "1",
      "yes",
      "yes, i serve the emperor",
      "2",
      "no",
      "no, i am just a traveler",
      "3",
      "what",
      "what do you mean",
      "what do you mean by loyalist",
    ],
    "How do you respond?"
  );
  if (
    response == "1" ||
    response == "yes" ||
    response == "yes, i serve the emperor"
  ) {
    await printLines("app/src/cutscenes/unknown_shore/rocky_beach/6.txt", {
      peasantName: peasantName,
      villageName: villageName,
    });
  } else if (
    response == "2" ||
    response == "no" ||
    response == "no, i am just a traveler"
  ) {
    await printLines("app/src/cutscenes/unknown_shore/rocky_beach/7.txt", {
      peasantName: peasantName,
    });
  } else {
    await printLines("app/src/cutscenes/unknown_shore/rocky_beach/8.txt", {
      peasantName: peasantName,
    });
  }
  await closedInput(
    [
      "1",
      "keep",
      "keep it",
      "keep the ring",
      "2",
      "leave",
      "leave it",
      "leave the ring",
    ],
    "What will you do with the ring?"
  );
  if (
    response == "1" ||
    response == "keep" ||
    response == "keep it" ||
    response == "keep the ring"
  ) {
    await printLines("app/src/cutscenes/unknown_shore/rocky_beach/9.txt");
  } else {
    await printLines("app/src/cutscenes/unknown_shore/rocky_beach/10.txt");
    removeEntity("Imperial Signet Ring", "inventory");
  }
  changeValue("prologueCompleted", true);
  changeValue("unknownShore.rockyBeach.cutscenePlayed", true, "locations");
}

module.exports = { rockyBeach };
