const { handleCombat } = require("../../../../combat");
const { printLines, requireAnswer } = require("../../../../general");
const { handleMovement } = require("../../../../handle_input");
const { getValue, changeValue } = require("../../../../save_data");

async function mainGate() {
  if (getValue("imperialMarket.mainGate", true).cutscenePlayed == false) {
    await printLines(
      "app/src/cutscenes/imperial_citadel/imperial_market/main_gate/1.txt"
    );
    var choice = await requireAnswer(
      ["yes", "y", "no", "n"],
      '"What was that?" the rebel asks. "Do you want to leave or not?"'
    );
    if (choice == "yes" || choice == "y") {
      await printLines(
        "app/src/cutscenes/imperial_citadel/imperial_market/main_gate/2.txt"
      );
      await requireAnswer(["any"], "unreachable");
      await printLines(
        "app/src/cutscenes/imperial_citadel/imperial_market/main_gate/3.txt"
      );
      choice = await requireAnswer(
        ["yes", "y", "no", "n"],
        '"Will you pay the toll or not?"'
      );
      if (choice == "yes" || choice == "y") {
        var gold = getValue("gold");
        if (gold >= 100) {
          await printLines(
            "app/src/cutscenes/imperial_citadel/imperial_market/main_gate/4.txt"
          );
          changeValue("gold", gold - 100);
          changeValue(
            "imperialMarket.mainGate.cutscenePlayed",
            true,
            "locations"
          );
          changeValue(
            "imperialMarket.mainGate.description",
            "The main gates of the Imperial Citadel are large iron gates that are wide open, with several rebels lounging in front of each tower. There is a path to the north leading to the Citadel Walls, and a path to the south leading outside of the Imperial Citadel.",
            "locations"
          );
          handleMovement("load");
        } else {
          await printLines(
            "app/src/cutscenes/imperial_citadel/imperial_market/main_gate/5.txt"
          );
          choice = await requireAnswer(["1", "2"], "What do you do?");
          if (choice == "1") {
            handleMovement("north");
          } else if (choice == "2") {
            await printLines(
              "app/src/cutscenes/imperial_citadel/imperial_market/main_gate/6.txt"
            );
            await requireAnswer(["any"], "unreachable");
            await handleCombat();
            if (getValue("location") == "imperialMarket.mainGate") {
              await printLines(
                "app/src/cutscenes/imperial_citadel/imperial_market/main_gate/7.txt"
              );
              changeValue(
                "imperialMarket.mainGate.cutscenePlayed",
                true,
                "locations"
              );
              changeValue(
                "imperialMarket.mainGate.description",
                "The main gates of the Imperial Citadel are large iron gates that are wide open, with several rebels lying dead in front of each tower. There is a path to the north leading to the Citadel Walls, and a path to the south leading outside of the Imperial Citadel.",
                "locations"
              );
              handleMovement("load");
            }
          }
        }
      } else if (choice == "no" || choice == "n") {
        await printLines(
          "app/src/cutscenes/imperial_citadel/imperial_market/main_gate/5.txt"
        );
        choice = await requireAnswer(["1", "2"], "What do you do?");
        if (choice == "1") {
          handleMovement("north");
        } else if (choice == "2") {
          await printLines(
            "app/src/cutscenes/imperial_citadel/imperial_market/main_gate/6.txt"
          );
          await requireAnswer(["any"], "unreachable");
          await handleCombat();
          if (getValue("location") == "imperialMarket.mainGate") {
            await printLines(
              "app/src/cutscenes/imperial_citadel/imperial_market/main_gate/7.txt"
            );
            changeValue(
              "imperialMarket.mainGate.cutscenePlayed",
              true,
              "locations"
            );
            changeValue(
              "imperialMarket.mainGate.description",
              "The main gates of the Imperial Citadel are large iron gates that are wide open, with several rebels lying dead in front of each tower. There is a path to the north leading to the Citadel Walls, and a path to the south leading outside of the Imperial Citadel.",
              "locations"
            );
            handleMovement("load");
          }
        }
      }
    } else if (choice == "no" || choice == "n") {
      await printLines(
        "app/src/cutscenes/imperial_citadel/imperial_market/main_gate/8.txt"
      );
      handleMovement("north");
    }
  }
}

module.exports = { mainGate };
