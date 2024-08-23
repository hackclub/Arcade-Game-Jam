module.exports = {
  allowInput,
  blockInput,
  closedInput,
  openInput,
  inputLoop,
  handleMovement,
};
const {
  addEntity,
  getValue,
  changeValue,
  calculateValue,
  updateUI,
  updateEquipment,
} = require("./save_data");
const { toTitleCase, quickPrint, printLines } = require("./general");
const { handleCombat, handleCombatMovement } = require("./combat");
const enemies = require("./class_collections/enemy_menagerie");
const spells = require("./class_collections/spellbook");
const cutscenes = require("./cutscenes");
const { generateRandomEncounter } = require("./proc_gen");

function allowInput() {
  document.getElementById("input-bar").style.backgroundColor = "#ffffff";
  document.getElementById("input-bar").setAttribute("contenteditable", "true");
}

function blockInput() {
  document.getElementById("input-bar").style.backgroundColor = "#d1d1d1";
  document.getElementById("input-bar").setAttribute("contenteditable", "false");
}

async function closedInput() {
  return new Promise(function (resolve) {
    const input = document.getElementById("input-bar");
    function handleKeyPress(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        const text = input.innerText;
        document.getElementById("main-content").innerHTML +=
          "<span style='color: blue;'><p> " + text + "</p></span>";
        document.getElementById("main-content").scrollTop =
          document.getElementById("main-content").scrollHeight;
        input.innerText = "";
        input.removeEventListener("keypress", handleKeyPress);
        resolve(text);
      }
    }
    input.addEventListener("keypress", handleKeyPress);
  });
}

async function openInput(combatOverride = false) {
  return new Promise(function (resolve) {
    const input = document.getElementById("input-bar");
    async function handleKeyPress(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        var text = input.innerText;
        document.getElementById("main-content").innerHTML +=
          "<span style='color: blue;'><p> " + text + "</p></span>";
        document.getElementById("main-content").scrollTop =
          document.getElementById("main-content").scrollHeight;
        input.innerText = "";
        input.removeEventListener("keypress", handleKeyPress);
        text = text.toLowerCase();
        text = text.replace(/[^\w\s\']|_/g, "").replace(/\s+/g, " ");
        if (text.substring(0, 2) == "i ") {
          text = text.substring(2);
        }
        var clauses = text.split(" and ");
        var hasTurned = false;
        var hasMoved = false;
        var hasEquipped = false;
        var hasUnequipped = false;
        var mainHandUsed = false;
        var offHandUsed = false;
        var hasCasted = false;
        var hasUsed = false;
        for (let i = 0; i < clauses.length; i++) {
          if (
            clauses[i].substring(0, 4) == "help" ||
            clauses[i].substring(0, 4) == "info" ||
            clauses[i].substring(0, 12) == "instructions"
          ) {
            printLines("app/src/help.txt");
          } else if (clauses[i].substring(0, 5) == "debug") {
            var choice = await closedInput();
            if (choice == "teleport") {
              var location = await closedInput();
              try {
                changeValue("location", location);
                handleMovement("load");
              } catch (error) {
                console.log(error);
                quickPrint("Invalid location.");
              }
            }
          } else if (
            clauses[i].substring(0, 3) == "end" ||
            clauses[i].substring(0, 8) == "end turn" ||
            clauses[i].substring(0, 6) == "finish" ||
            clauses[i].substring(0, 11) == "finish turn"
          ) {
            if (getValue("isCombat") != true) {
              quickPrint("You are not in combat.");
            }
            text = ["finish"];
          } else if (clauses[i].substring(0, 9) == "remember ") {
            var memory = clauses[i].substring(9);
            addEntity(memory, "memories");
          } else if (
            clauses[i].substring(0, 5) == "face " ||
            clauses[i].substring(0, 5) == "turn " ||
            clauses[i].substring(0, 5) == "look "
          ) {
            if (hasTurned == true) {
              quickPrint("You have already turned this turn.");
              continue;
            }
            hasTurned = true;
            var direction = getValue("direction");
            if (clauses[i].substring(5, 13) == "halfway ") {
              if (clauses[i].substring(13, 20) == "to the ") {
                var change = clauses[i].substring(20);
              } else {
                change = clauses[i].substring(13);
              }
              var halfTurn = true;
            } else if (clauses[i].substring(5, 14) == "slightly ") {
              if (clauses[i].substring(14, 21) == "to the ") {
                change = clauses[i].substring(21);
              } else {
                change = clauses[i].substring(14);
              }
              halfTurn = true;
            } else {
              if (clauses[i].substring(5, 12) == "to the ") {
                change = clauses[i].substring(12);
              } else {
                change = clauses[i].substring(5);
              }
              halfTurn = false;
            }
            handleTurn(direction, change, halfTurn);
          } else if (clauses[i].substring(0, 3) == "go ") {
            if (hasMoved == true) {
              quickPrint("You have already moved this turn.");
              continue;
            }
            if (getValue("isCombat") == true) {
              if (clauses[i].substring(3, 10) == "to the ") {
                var result = parseCombatMovements(clauses[i], 10);
                if (result == false) {
                  quickPrint("Invalid movement.");
                  continue;
                } else {
                  var direction = result[0];
                  var distance = result[1];
                  handleCombatMovement(direction, distance);
                }
              } else {
                var result = parseCombatMovements(clauses[i], 3);
                if (result == false) {
                  quickPrint("Invalid movement.");
                  continue;
                } else {
                  var direction = result[0];
                  var distance = result[1];
                  handleCombatMovement(direction, distance);
                }
              }
            } else {
              if (clauses[i].substring(3, 10) == "to the ") {
                direction = clauses[i].substring(10);
              } else {
                direction = clauses[i].substring(3);
              }
              handleMovement(direction);
            }
          } else if (clauses[i].substring(0, 4) == "run ") {
            if (hasMoved == true) {
              quickPrint("You have already moved this turn.");
              continue;
            }
            if (getValue("isCombat") == true) {
              if (clauses[i].substring(4, 11) == "to the ") {
                var result = parseCombatMovements(clauses[i], 11);
                if (result == false) {
                  quickPrint("Invalid movement.");
                  continue;
                } else {
                  var direction = result[0];
                  var distance = result[1];
                  handleCombatMovement(direction, distance);
                }
              } else {
                var result = parseCombatMovements(clauses[i], 4);
                if (result == false) {
                  quickPrint("Invalid movement.");
                  continue;
                } else {
                  var direction = result[0];
                  var distance = result[1];
                  handleCombatMovement(direction, distance);
                }
              }
            } else {
              if (clauses[i].substring(4, 11) == "to the ") {
                direction = clauses[i].substring(11);
              } else {
                direction = clauses[i].substring(4);
              }
              handleMovement(direction);
            }
          } else if (
            clauses[i].substring(0, 5) == "exit " ||
            clauses[i].substring(0, 5) == "move " ||
            clauses[i].substring(0, 5) == "walk "
          ) {
            if (hasMoved == true) {
              quickPrint("You have already moved this turn.");
              continue;
            }
            if (getValue("isCombat") == true) {
              if (clauses[i].substring(5, 12) == "to the ") {
                var result = parseCombatMovements(clauses[i], 12);
                if (result == false) {
                  quickPrint("Invalid movement.");
                  continue;
                } else {
                  var direction = result[0];
                  var distance = result[1];
                  handleCombatMovement(direction, distance);
                }
              } else {
                var result = parseCombatMovements(clauses[i], 5);
                if (result == false) {
                  quickPrint("Invalid movement.");
                  continue;
                } else {
                  var direction = result[0];
                  var distance = result[1];
                  handleCombatMovement(direction, distance);
                }
              }
            } else {
              if (clauses[i].substring(5, 12) == "to the ") {
                direction = clauses[i].substring(12);
              } else {
                direction = clauses[i].substring(5);
              }
              handleMovement(direction);
            }
          } else if (
            clauses[i].substring(0, 5) == "grab " ||
            clauses[i].substring(0, 5) == "take " ||
            clauses[i].substring(0, 5) == "lift "
          ) {
            if (clauses[i].substring(5, 7) == "a ") {
              var item = clauses[i].substring(7);
            } else if (clauses[i].substring(5, 8) == "an ") {
              item = clauses[i].substring(8);
            } else if (clauses[i].substring(5, 9) == "the ") {
              item = clauses[i].substring(9);
            } else {
              item = clauses[i].substring(5);
            }
            handlePickup(item);
          } else if (
            clauses[i].substring(0, 8) == "pick up " ||
            clauses[i].substring(0, 8) == "lift up " ||
            clauses[i].substring(0, 8) == "acquire " ||
            clauses[i].substring(0, 8) == "obtain "
          ) {
            if (clauses[i].substring(8, 10) == "a ") {
              var item = clauses[i].substring(10);
            } else if (clauses[i].substring(8, 11) == "an ") {
              item = clauses[i].substring(11);
            } else if (clauses[i].substring(8, 12) == "the ") {
              item = clauses[i].substring(12);
            } else {
              item = clauses[i].substring(8);
            }
            handlePickup(item);
          } else if (
            clauses[i].substring(0, 5) == "drop " ||
            clauses[i].substring(0, 5) == "lose "
          ) {
            if (clauses[i].substring(5, 7) == "a ") {
              item = clauses[i].substring(7);
            } else if (clauses[i].substring(5, 8) == "an ") {
              item = clauses[i].substring(8);
            } else if (clauses[i].substring(5, 9) == "the ") {
              item = clauses[i].substring(9);
            } else {
              item = clauses[i].substring(5);
            }
            handleDrop(item);
          } else if (clauses[i].substring(0, 6) == "leave ") {
            if (clauses[i].substring(6, 8) == "a ") {
              item = clauses[i].substring(8);
            } else if (clauses[i].substring(6, 9) == "an ") {
              item = clauses[i].substring(9);
            } else if (clauses[i].substring(6, 10) == "the ") {
              item = clauses[i].substring(10);
            } else {
              item = clauses[i].substring(6);
            }
            handleDrop(item);
          } else if (clauses[i].substring(0, 8) == "discard ") {
            if (clauses[i].substring(7, 9) == "a ") {
              item = clauses[i].substring(9);
            } else if (clauses[i].substring(7, 10) == "an ") {
              item = clauses[i].substring(10);
            } else if (clauses[i].substring(7, 11) == "the ") {
              item = clauses[i].substring(11);
            } else {
              item = clauses[i].substring(7);
            }
            handleDrop(item);
          } else if (clauses[i].substring(0, 6) == "equip ") {
            if (hasEquipped == true) {
              quickPrint("You have already equipped this turn.");
              continue;
            }
            hasEquipped = true;
            if (clauses[i].substring(6, 8) == "a ") {
              item = clauses[i].substring(8);
            } else if (clauses[i].substring(6, 9) == "an ") {
              item = clauses[i].substring(9);
            } else if (clauses[i].substring(6, 10) == "the ") {
              item = clauses[i].substring(10);
            } else {
              item = clauses[i].substring(6);
            }
            handleEquip(item);
          } else if (clauses[i].substring(0, 7) == "put on ") {
            if (hasEquipped == true) {
              quickPrint("You have already equipped this turn.");
              continue;
            }
            hasEquipped = true;
            if (clauses[i].substring(7, 9) == "a ") {
              item = clauses[i].substring(9);
            } else if (clauses[i].substring(7, 10) == "an ") {
              item = clauses[i].substring(10);
            } else if (clauses[i].substring(7, 11) == "the ") {
              item = clauses[i].substring(11);
            } else {
              item = clauses[i].substring(7);
            }
            handleEquip(item);
          } else if (clauses[i].substring(0, 8) == "unequip ") {
            if (hasUnequipped == true) {
              quickPrint("You have already unequipped this turn.");
              continue;
            }
            hasUnequipped = true;
            if (clauses[i].substring(8, 10) == "a ") {
              item = clauses[i].substring(10);
            } else if (clauses[i].substring(8, 11) == "an ") {
              item = clauses[i].substring(11);
            } else if (clauses[i].substring(8, 12) == "the ") {
              item = clauses[i].substring(12);
            } else {
              item = clauses[i].substring(8);
            }
            handleUnequip(item);
          } else if (clauses[i].substring(0, 9) == "take off ") {
            if (hasUnequipped == true) {
              quickPrint("You have already unequipped this turn.");
              continue;
            }
            hasUnequipped = true;
            if (clauses[i].substring(9, 11) == "a ") {
              item = clauses[i].substring(11);
            } else if (clauses[i].substring(9, 12) == "an ") {
              item = clauses[i].substring(12);
            } else if (clauses[i].substring(9, 13) == "the ") {
              item = clauses[i].substring(13);
            } else {
              item = clauses[i].substring(9);
            }
            handleUnequip(item);
          } else if (
            clauses[i].substring(0, 3) == "use " ||
            clauses[i].substring(0, 3) == "eat "
          ) {
            if (hasUsed == true) {
              quickPrint("You have already used an item this turn.");
              continue;
            }
            hasUsed = true;
            if (clauses[i].substring(3, 5) == "a ") {
              item = clauses[i].substring(5);
            } else if (clauses[i].substring(3, 6) == "an ") {
              item = clauses[i].substring(6);
            } else if (clauses[i].substring(3, 7) == "the ") {
              item = clauses[i].substring(7);
            } else {
              item = clauses[i].substring(3);
            }
            handleUse(item);
          } else if (clauses[i].substring(0, 5) == "read ") {
            if (hasUsed == true) {
              quickPrint("You have already used an item this turn.");
              continue;
            }
            hasUsed = true;
            if (clauses[i].substring(5, 7) == "a ") {
              item = clauses[i].substring(7);
            } else if (clauses[i].substring(5, 8) == "an ") {
              item = clauses[i].substring(8);
            } else if (clauses[i].substring(5, 9) == "the ") {
              item = clauses[i].substring(9);
            } else {
              item = clauses[i].substring(5);
            }
            handleUse(item);
          } else if (clauses[i].substring(0, 6) == "drink ") {
            if (hasUsed == true) {
              quickPrint("You have already used an item this turn.");
              continue;
            }
            hasUsed = true;
            if (clauses[i].substring(6, 8) == "a ") {
              item = clauses[i].substring(8);
            } else if (clauses[i].substring(6, 9) == "an ") {
              item = clauses[i].substring(9);
            } else if (clauses[i].substring(6, 10) == "the ") {
              item = clauses[i].substring(10);
            } else {
              item = clauses[i].substring(6);
            }
            handleUse(item);
          } else if (clauses[i].substring(0, 7) == "ingest ") {
            if (hasUsed == true) {
              quickPrint("You have already used an item this turn.");
              continue;
            }
            hasUsed = true;
            if (clauses[i].substring(7, 9) == "a ") {
              item = clauses[i].substring(9);
            } else if (clauses[i].substring(7, 10) == "an ") {
              item = clauses[i].substring(10);
            } else if (clauses[i].substring(7, 11) == "the ") {
              item = clauses[i].substring(11);
            } else {
              item = clauses[i].substring(7);
            }
            handleUse(item);
          } else if (clauses[i].substring(0, 8) == "consume ") {
            if (hasUsed == true) {
              quickPrint("You have already used an item this turn.");
              continue;
            }
            if (clauses[i].substring(8, 10) == "a ") {
              item = clauses[i].substring(10);
            } else if (clauses[i].substring(8, 11) == "an ") {
              item = clauses[i].substring(11);
            } else if (clauses[i].substring(8, 12) == "the ") {
              item = clauses[i].substring(12);
            } else {
              item = clauses[i].substring(8);
            }
            handleUse(item);
          } else if (
            clauses[i].substring(0, 4) == "hit " ||
            clauses[i].substring(0, 4) == "cut " ||
            clauses[i].substring(0, 4) == "jab "
          ) {
            if (getValue("isCombat") == false) {
              quickPrint("You are not in combat.");
            }
            if (clauses[i].substring(2, 4) == "a ") {
              weapon = clauses[i].substring(4);
            } else if (clauses[i].substring(2, 5) == "an ") {
              weapon = clauses[i].substring(5);
            } else if (clauses[i].substring(2, 6) == "the ") {
              weapon = clauses[i].substring(6);
            } else if (clauses[i].substring(2, 7) == "with ") {
              weapon = clauses[i].substring(7);
            } else if (clauses[i].substring(2, 8) == "with a ") {
              weapon = clauses[i].substring(8);
            } else if (clauses[i].substring(2, 9) == "with an ") {
              weapon = clauses[i].substring(9);
            } else if (clauses[i].substring(2, 10) == "with the ") {
              weapon = clauses[i].substring(10);
            } else {
              weapon = clauses[i].substring(2);
            }
            response = combatParse(weapon, "melee", mainHandUsed, offHandUsed);
            mainHandUsed = response[0];
            offHandUsed = response[1];
            text = [response[2], response[3], response[4]];
          } else if (clauses[i].substring(0, 5) == "stab ") {
            if (getValue("isCombat") == false) {
              quickPrint("You are not in combat.");
            }
            if (clauses[i].substring(5, 7) == "a ") {
              weapon = clauses[i].substring(7);
            } else if (clauses[i].substring(5, 8) == "an ") {
              weapon = clauses[i].substring(8);
            } else if (clauses[i].substring(5, 9) == "the ") {
              weapon = clauses[i].substring(9);
            } else if (clauses[i].substring(5, 10) == "with ") {
              weapon = clauses[i].substring(10);
            } else if (clauses[i].substring(5, 12) == "with a ") {
              weapon = clauses[i].substring(12);
            } else if (clauses[i].substring(5, 13) == "with an ") {
              weapon = clauses[i].substring(13);
            } else if (clauses[i].substring(5, 14) == "with the ") {
              weapon = clauses[i].substring(14);
            } else {
              weapon = clauses[i].substring(5);
            }
            response = combatParse(weapon, "melee", mainHandUsed, offHandUsed);
            mainHandUsed = response[0];
            offHandUsed = response[1];
            text = [response[2], response[3], response[4]];
          } else if (
            clauses[i].substring(0, 6) == "fight " ||
            clauses[i].substring(0, 6) == "slash " ||
            clauses[i].substring(0, 6) == "swing "
          ) {
            if (getValue("isCombat") == false) {
              quickPrint("You are not in combat.");
            }
            if (clauses[i].substring(6, 8) == "a ") {
              weapon = clauses[i].substring(8);
            } else if (clauses[i].substring(6, 9) == "an ") {
              weapon = clauses[i].substring(9);
            } else if (clauses[i].substring(6, 10) == "the ") {
              weapon = clauses[i].substring(10);
            } else if (clauses[i].substring(6, 11) == "with ") {
              weapon = clauses[i].substring(11);
            } else if (clauses[i].substring(6, 13) == "with a ") {
              weapon = clauses[i].substring(13);
            } else if (clauses[i].substring(6, 14) == "with an ") {
              weapon = clauses[i].substring(14);
            } else if (clauses[i].substring(6, 15) == "with the ") {
              weapon = clauses[i].substring(15);
            } else {
              weapon = clauses[i].substring(6);
            }
            response = combatParse(weapon, "melee", mainHandUsed, offHandUsed);
            mainHandUsed = response[0];
            offHandUsed = response[1];
            text = [response[2], response[3], response[4]];
          } else if (
            clauses[i].substring(0, 7) == "attack " ||
            clauses[i].substring(0, 7) == "strike " ||
            clauses[i].substring(0, 7) == "thrust "
          ) {
            if (getValue("isCombat") == false) {
              quickPrint("You are not in combat.");
            }
            if (clauses[i].substring(7, 9) == "a ") {
              weapon = clauses[i].substring(9);
            } else if (clauses[i].substring(7, 10) == "an ") {
              weapon = clauses[i].substring(10);
            } else if (clauses[i].substring(7, 11) == "the ") {
              weapon = clauses[i].substring(11);
            } else if (clauses[i].substring(7, 12) == "with ") {
              weapon = clauses[i].substring(12);
            } else if (clauses[i].substring(7, 14) == "with a ") {
              weapon = clauses[i].substring(14);
            } else if (clauses[i].substring(7, 15) == "with an ") {
              weapon = clauses[i].substring(15);
            } else if (clauses[i].substring(7, 16) == "with the ") {
              weapon = clauses[i].substring(16);
            } else {
              weapon = clauses[i].substring(7);
            }
            response = combatParse(weapon, "melee", mainHandUsed, offHandUsed);
            mainHandUsed = response[0];
            offHandUsed = response[1];
            text = [response[2], response[3], response[4]];
          } else if (clauses[i].substring(0, 4) == "aim ") {
            if (getValue("isCombat") == false) {
              quickPrint("You are not in combat.");
            }
            if (clauses[i].substring(4, 6) == "a ") {
              weapon = clauses[i].substring(6);
            } else if (clauses[i].substring(4, 7) == "an ") {
              weapon = clauses[i].substring(7);
            } else if (clauses[i].substring(4, 8) == "the ") {
              weapon = clauses[i].substring(8);
            } else if (clauses[i].substring(4, 9) == "with ") {
              weapon = clauses[i].substring(9);
            } else {
              var weapon = clauses[i].substring(4);
            }
            var response = combatParse(
              weapon,
              "ranged",
              mainHandUsed,
              offHandUsed
            );
            mainHandUsed = response[0];
            offHandUsed = response[1];
            text = [response[2], response[3], response[4]];
          } else if (clauses[i].substring(0, 5) == "fire ") {
            if (getValue("isCombat") == false) {
              quickPrint("You are not in combat.");
            }
            if (clauses[i].substring(5, 7) == "a ") {
              weapon = clauses[i].substring(7);
            } else if (clauses[i].substring(5, 8) == "an ") {
              weapon = clauses[i].substring(8);
            } else if (clauses[i].substring(5, 9) == "the ") {
              weapon = clauses[i].substring(9);
            } else if (clauses[i].substring(5, 10) == "with ") {
              weapon = clauses[i].substring(10);
            } else {
              weapon = clauses[i].substring(5);
            }
            response = combatParse(weapon, "ranged", mainHandUsed, offHandUsed);
            mainHandUsed = response[0];
            offHandUsed = response[1];
            text = [response[2], response[3], response[4]];
          } else if (
            clauses[i].substring(0, 4) == "shoot" ||
            clauses[i].substring(0, 4) == "snipe" ||
            clauses[i].substring(0, 4) == "throw"
          ) {
            if (getValue("isCombat") == false) {
              quickPrint("You are not in combat.");
            }
            if (clauses[i].substring(4, 6) == "a ") {
              weapon = clauses[i].substring(6);
            } else if (clauses[i].substring(4, 7) == "an ") {
              weapon = clauses[i].substring(7);
            } else if (clauses[i].substring(4, 8) == "the ") {
              weapon = clauses[i].substring(8);
            } else if (clauses[i].substring(4, 9) == "with ") {
              weapon = clauses[i].substring(9);
            } else {
              weapon = clauses[i].substring(4);
            }
            response = combatParse(weapon, "ranged", mainHandUsed, offHandUsed);
            mainHandUsed = response[0];
            offHandUsed = response[1];
            text = [response[2], response[3], response[4]];
          } else if (clauses[i].substring(0, 5) == "launch") {
            if (getValue("isCombat") == false) {
              quickPrint("You are not in combat.");
            }
            if (clauses[i].substring(5, 7) == "a ") {
              weapon = clauses[i].substring(7);
            } else if (clauses[i].substring(5, 8) == "an ") {
              weapon = clauses[i].substring(8);
            } else if (clauses[i].substring(5, 9) == "the ") {
              weapon = clauses[i].substring(9);
            } else if (clauses[i].substring(5, 10) == "with ") {
              weapon = clauses[i].substring(10);
            } else {
              weapon = clauses[i].substring(5);
            }
            response = combatParse(weapon, "ranged", mainHandUsed, offHandUsed);
            mainHandUsed = response[0];
            offHandUsed = response[1];
            text = [response[2], response[3], response[4]];
          } else if (clauses[i].substring(0, 4) == "say ") {
            if (getValue("isCombat") == false && combatOverride == false) {
              quickPrint("You are not in combat.");
            } else if (hasCasted == true) {
              quickPrint("You have already cast a spell this turn.");
            } else if (hasCasted == false) {
              hasCasted = true;
              var words = clauses[i].substring(4);
              var spellInput = handleSpell(words);
              var spellPower = spellInput[0];
              var spellDirection = spellInput[1];
              var effect = spellInput[2];
              var range = spellInput[3];
              text = ["spell", spellPower, spellDirection, effect, range];
            }
          } else if (
            clauses[i].substring(0, 5) == "yell " ||
            clauses[i].substring(0, 5) == "cast "
          ) {
            if (getValue("isCombat") == false && combatOverride == false) {
              quickPrint("You are not in combat.");
            } else if (hasCasted == true) {
              quickPrint("You have already cast a spell this turn.");
            } else if (hasCasted == false) {
              hasCasted = true;
              var words = clauses[i].substring(5);
              var spellInput = handleSpell(words);
              var spellPower = spellInput[0];
              var spellDirection = spellInput[1];
              var effect = spellInput[2];
              var range = spellInput[3];
              text = ["spell", spellPower, spellDirection, effect, range];
            }
          } else if (
            clauses[i].substring(0, 6) == "chant " ||
            clauses[i].substring(0, 6) == "shout " ||
            clauses[i].substring(0, 6) == "speak " ||
            clauses[i].substring(0, 6) == "utter "
          ) {
            if (getValue("isCombat") == false && combatOverride == false) {
              quickPrint("You are not in combat.");
            } else if (hasCasted == true) {
              quickPrint("You have already cast a spell this turn.");
            } else if (hasCasted == false) {
              hasCasted = true;
              var words = clauses[i].substring(6);
              var spellInput = handleSpell(words);
              var spellPower = spellInput[0];
              var spellDirection = spellInput[1];
              var effect = spellInput[2];
              var range = spellInput[3];
              text = ["spell", spellPower, spellDirection, effect, range];
            }
          } else if (clauses[i].substring(0, 7) == "mutter ") {
            if (getValue("isCombat") == false && combatOverride == false) {
              quickPrint("You are not in combat.");
            } else if (hasCasted == true) {
              quickPrint("You have already cast a spell this turn.");
            } else if (hasCasted == false) {
              hasCasted = true;
              var words = clauses[i].substring(7);
              var spellInput = handleSpell(words);
              var spellPower = spellInput[0];
              var spellDirection = spellInput[1];
              var effect = spellInput[2];
              var range = spellInput[3];
              text = ["spell", spellPower, spellDirection, effect, range];
            }
          } else if (clauses[i].substring(0, 8) == "whisper ") {
            if (getValue("isCombat") == false && combatOverride == false) {
              quickPrint("You are not in combat.");
            } else if (hasCasted == true) {
              quickPrint("You have already cast a spell this turn.");
            } else if (hasCasted == false) {
              hasCasted = true;
              var words = clauses[i].substring(8);
              var spellInput = handleSpell(words);
              var spellPower = spellInput[0];
              var spellDirection = spellInput[1];
              var effect = spellInput[2];
              var range = spellInput[3];
              text = ["spell", spellPower, spellDirection, effect, range];
            }
          } else if (clauses[i].substring(0, 4) == "rest ") {
            if (getValue("isCombat") == true) {
              quickPrint("You cannot rest during combat.");
              continue;
            }
            handleRest();
          } else if (clauses[i].substring(0, 5) == "sleep") {
            if (getValue("isCombat") == true) {
              quickPrint("You cannot sleep during combat.");
              continue;
            }
            handleRest();
          }
        }
        resolve(text);
      }
    }
    input.addEventListener("keypress", handleKeyPress);
  });
}

async function inputLoop() {
  while (true) {
    await openInput();
  }
}

function handleTurn(direction, change, halfway) {
  if (halfway == true) {
    switch (change) {
      case "left":
        if (direction == "north") {
          changeValue("direction", "northwest");
        } else if (direction == "northeast") {
          changeValue("direction", "north");
        } else if (direction == "east") {
          changeValue("direction", "northeast");
        } else if (direction == "southeast") {
          changeValue("direction", "east");
        } else if (direction == "south") {
          changeValue("direction", "southeast");
        } else if (direction == "southwest") {
          changeValue("direction", "south");
        } else if (direction == "west") {
          changeValue("direction", "southwest");
        } else if (direction == "northwest") {
          changeValue("direction", "west");
        }
        break;
      case "right":
        if (direction == "north") {
          changeValue("direction", "northeast");
        } else if (direction == "northeast") {
          changeValue("direction", "east");
        } else if (direction == "east") {
          changeValue("direction", "southeast");
        } else if (direction == "southeast") {
          changeValue("direction", "south");
        } else if (direction == "south") {
          changeValue("direction", "southwest");
        } else if (direction == "southwest") {
          changeValue("direction", "west");
        } else if (direction == "west") {
          changeValue("direction", "northwest");
        } else if (direction == "northwest") {
          changeValue("direction", "north");
        }
        break;
      default:
        break;
    }
  } else {
    switch (change) {
      case "left":
        if (direction == "north") {
          changeValue("direction", "west");
        } else if (direction == "northeast") {
          changeValue("direction", "northwest");
        } else if (direction == "east") {
          changeValue("direction", "north");
        } else if (direction == "southeast") {
          changeValue("direction", "northeast");
        } else if (direction == "south") {
          changeValue("direction", "east");
        } else if (direction == "southwest") {
          changeValue("direction", "southeast");
        } else if (direction == "west") {
          changeValue("direction", "south");
        } else if (direction == "northwest") {
          changeValue("direction", "southwest");
        }
        break;
      case "right":
        if (direction == "north") {
          changeValue("direction", "east");
        } else if (direction == "northeast") {
          changeValue("direction", "southeast");
        } else if (direction == "east") {
          changeValue("direction", "south");
        } else if (direction == "southeast") {
          changeValue("direction", "southwest");
        } else if (direction == "south") {
          changeValue("direction", "west");
        } else if (direction == "southwest") {
          changeValue("direction", "northwest");
        } else if (direction == "west") {
          changeValue("direction", "north");
        } else if (direction == "northwest") {
          changeValue("direction", "northeast");
        }
        break;
      default:
        break;
    }
  }
  quickPrint("You are now facing " + getValue("direction") + ".");
}

function parseCombatMovements(clause, firstSubstring) {
  var result = parseCombatMovement(
    clause,
    "forward",
    firstSubstring,
    firstSubstring + 7
  );
  if (result != false) {
    return result;
  }
  result = parseCombatMovement(
    clause,
    "forwards",
    firstSubstring,
    firstSubstring + 8
  );
  if (result != false) {
    return result;
  }
  result = parseCombatMovement(
    clause,
    "back",
    firstSubstring,
    firstSubstring + 4
  );
  if (result != false) {
    return result;
  }
  result = parseCombatMovement(
    clause,
    "backward",
    firstSubstring,
    firstSubstring + 7
  );
  if (result != false) {
    return result;
  }
  result = parseCombatMovement(
    clause,
    "backwards",
    firstSubstring,
    firstSubstring + 9
  );
  if (result != false) {
    return result;
  }
  result = parseCombatMovement(
    clause,
    "left",
    firstSubstring,
    firstSubstring + 4
  );
  if (result != false) {
    return result;
  }
  result = parseCombatMovement(
    clause,
    "right",
    firstSubstring,
    firstSubstring + 5
  );
  if (result != false) {
    return result;
  }
  result = parseCombatMovement(
    clause,
    "left forward",
    firstSubstring,
    firstSubstring + 13
  );
  if (result != false) {
    return result;
  }
  result = parseCombatMovement(
    clause,
    "left forwards",
    firstSubstring,
    firstSubstring + 14
  );
  if (result != false) {
    return result;
  }
  result = parseCombatMovement(
    clause,
    "left back",
    firstSubstring,
    firstSubstring + 10
  );
  if (result != false) {
    return result;
  }
  result = parseCombatMovement(
    clause,
    "left backward",
    firstSubstring,
    firstSubstring + 13
  );
  if (result != false) {
    return result;
  }
  result = parseCombatMovement(
    clause,
    "left backwards",
    firstSubstring,
    firstSubstring + 15
  );
  if (result != false) {
    return result;
  }
  result = parseCombatMovement(
    clause,
    "right forward",
    firstSubstring,
    firstSubstring + 14
  );
  if (result != false) {
    return result;
  }
  result = parseCombatMovement(
    clause,
    "right forwards",
    firstSubstring,
    firstSubstring + 15
  );
  if (result != false) {
    return result;
  }
  result = parseCombatMovement(
    clause,
    "right back",
    firstSubstring,
    firstSubstring + 11
  );
  if (result != false) {
    return result;
  }
  result = parseCombatMovement(
    clause,
    "right backward",
    firstSubstring,
    firstSubstring + 14
  );
  if (result != false) {
    return result;
  }
  result = parseCombatMovement(
    clause,
    "right backwards",
    firstSubstring,
    firstSubstring + 16
  );
  if (result != false) {
    return result;
  }
  return false;
}

function parseCombatMovement(clause, direction, firstSubstring, lastSubstring) {
  if (clause.substring(firstSubstring, lastSubstring) == direction) {
    var distance = clause.substring(lastSubstring);
    if (distance.split(" ").length > 1) {
      distance = distance.split(" ")[1];
      distance = parseInt(distance);
    } else {
      distance = parseInt(distance);
    }
    if (isNaN(distance)) {
      return false;
    }
    return [direction, distance];
  } else {
    return false;
  }
}

function handleMovement(direction) {
  var currentLocation = getValue("location");
  currentLocation = eval(getValue(currentLocation, true));
  if (direction == "load") {
    changeValue(`${currentLocation.id}.isVisited`, true, "locations");
    quickPrint(currentLocation.description);
    if (currentLocation.hasOwnProperty("encounter")) {
      if (currentLocation.encountered == false) {
        eval(currentLocation.encounter);
      }
    } else if (currentLocation.hasOwnProperty("cutscene")) {
      if (currentLocation.cutscenePlayed == false) {
        var cutsceneName = currentLocation.cutscene;
        cutscenes[cutsceneName][cutsceneName]();
      }
    } else if (currentLocation.hasOwnProperty("enemies")) {
      handleCombat();
    } else if (currentLocation.hasOwnProperty("vendor")) {
      handleShop(currentLocation);
    }
    return;
  }
  try {
    var newLocation = currentLocation.exits[direction];
    newLocation = eval(getValue(newLocation, true));
    if (newLocation.hasOwnProperty("isLocked")) {
      if (newLocation.isLocked == true) {
        if (newLocation.hasOwnProperty("key")) {
          var inventory = getValue("inventory");
          var hasKey = false;
          for (let i = 0; i < inventory.length; i++) {
            if (inventory[i].name == newLocation.key) {
              hasKey = true;
              var primaryLocation = currentLocation.id.split(".")[0];
              var secondaryLocation = currentLocation.id.split(".")[1];
              newLocation.isLocked = false;
              var playerData = JSON.parse(localStorage.getItem("playerData"));
              var locations = playerData["locations"];
              locations[primaryLocation][secondaryLocation]["isLocked"] = false;
              localStorage.setItem("playerData", JSON.stringify(playerData));
              quickPrint(newLocation.unlockMessage);
              break;
            }
          }
          if (hasKey == false) {
            quickPrint(newLocation.lockedDescription);
            return;
          }
        } else {
          quickPrint(newLocation.lockedDescription);
          return;
        }
      }
    }
    changeValue("location", newLocation.id);
    changeValue("direction", direction);
    var locationWidth = newLocation.width;
    locationWidth = Math.floor(locationWidth);
    var horizontalTiles = locationWidth / 5;
    var horizontalMiddle = Math.floor(horizontalTiles / 2) + 1;
    var locationHeight = newLocation.height;
    locationHeight = Math.floor(locationHeight);
    var verticalTiles = locationHeight / 5;
    var verticalMiddle = Math.floor(verticalTiles / 2) + 1;
    switch (direction) {
      case "north":
        changeValue("position", [horizontalMiddle, verticalTiles]);
        break;
      case "northeast":
        changeValue("position", [horizontalTiles, verticalTiles]);
        break;
      case "east":
        changeValue("position", [1, verticalMiddle]);
        break;
      case "southeast":
        changeValue("position", [1, 1]);
        break;
      case "south":
        changeValue("position", [horizontalMiddle, 1]);
        break;
      case "southwest":
        changeValue("position", [horizontalTiles, 1]);
        break;
      case "west":
        changeValue("position", [horizontalTiles, verticalMiddle]);
        break;
      case "northwest":
        changeValue("position", [horizontalTiles, verticalTiles]);
        break;
      default:
        break;
    }
    quickPrint(newLocation.description);
    changeValue(`${newLocation.id}.isVisited`, true, "locations");
    if (newLocation.hasOwnProperty("encounter")) {
      if (newLocation.encountered == false) {
        eval(newLocation.encounter);
      }
    } else if (newLocation.hasOwnProperty("cutscene")) {
      if (newLocation.cutscenePlayed == false) {
        var cutsceneName = newLocation.cutscene;
        cutscenes[cutsceneName][cutsceneName]();
      }
    } else if (newLocation.hasOwnProperty("enemies")) {
      handleCombat();
    } else if (newLocation.hasOwnProperty("vendor")) {
      handleShop(newLocation);
    }
  } catch (error) {
    console.log(error);
    var newLocation = currentLocation.exits[direction];
    quickPrint("You cannot go that way.");
  }
}

async function handleShop(location) {
  var vendor = location.vendor;
  var inventory = location.shopItems;
  var currency = location.currency;
  var markup = location.markup;
  quickPrint(`${vendor}, the owner of the shop, greets you warmly.`);
  quickPrint('"Welcome to my shop! Please take a look around."');
  quickPrint("Would you like to:");
  quickPrint("1. Buy something");
  quickPrint("2. Sell something");
  quickPrint("3. Leave");
  var response = await closedInput(
    ["1", "buy something", "buy", "2", "sell something", "sell", "leave"],
    '"Would you like to buy or sell something?"'
  );
  if (response == "1" || response == "buy something" || response == "buy") {
    quickPrint('"Here is what I have for sale:"');
    for (let i = 0; i < inventory.length; i++) {
      var item = inventory[i];
      var itemPrice = Math.floor(item.goldValue * markup);
      if (item.hasOwnProperty("saleName")) {
        quickPrint(`
          ${i + 1}. ${item.saleName} | ${
          item.saleDescription
        } | ${itemPrice} gold | ${item.quantity} in stock
        `);
      } else {
        quickPrint(`
        ${i + 1}. ${item.name} | ${item.description} | ${itemPrice} gold | ${
          item.quantity
        } in stock
      `);
      }
    }
    quickPrint(`${inventory.length + 1}. Nothing`);
    var responses = [];
    for (let i = 0; i < inventory.length; i++) {
      responses.push((i + 1).toString());
    }
    responses.push(`${inventory.length + 1}`);
    responses.push("nothing");
    response = await closedInput(responses, '"What would you like to buy?"');
    if (response == `${inventory.length + 1}` || response == "nothing") {
      quickPrint(`"Thank you for your business," ${vendor} says cheerfully.`);
      handleShop(location);
      return;
    }
    response = parseInt(response);
    var item = inventory[response - 1];
    var price = Math.floor(item.goldValue * markup);
    var playerData = JSON.parse(localStorage.getItem("playerData"));
    var gold = playerData["gold"];
    if (gold < price) {
      if (item.hasOwnProperty("saleName")) {
        itemName = item.saleName.toLowerCase();
        if (item.saleName.charAt(0).match(/[aeiou]/i)) {
          quickPrint(`You do not have enough money to buy an ${itemName}.`);
        } else {
          quickPrint(`You do not have enough money to buy a ${itemName}.`);
        }
      } else {
        itemName = item.name.toLowerCase();
        if (item.name.charAt(0).match(/[aeiou]/i)) {
          quickPrint(`You do not have enough money to buy an ${itemName}.`);
        } else {
          quickPrint(`You do not have enough money to buy a ${itemName}.`);
        }
      }
    } else {
      calculateValue("gold", "subtract", price);
      addEntity(item, "inventory");
      if (item.quantity == 1) {
        location.shopItems.splice(response - 1, 1);
      } else {
        item.quantity = item.quantity - 1;
      }
      currency = currency + price;
      var locations = playerData["locations"];
      var primaryLocation = location.id.split(".")[0];
      var secondaryLocation = location.id.split(".")[1];
      locations[primaryLocation][secondaryLocation]["shopItems"] =
        location.shopItems;
      localStorage.setItem("playerData", JSON.stringify(playerData));
      var itemName = item.name.toLowerCase();
      if (item.name.charAt(0).match(/[aeiou]/i)) {
        quickPrint(`You bought an ${itemName}.`);
      } else {
        quickPrint(`You bought a ${itemName}.`);
      }
    }
    handleShop(location);
  } else if (
    response == "2" ||
    response == "sell something" ||
    response == "sell"
  ) {
    quickPrint("What would you like to sell?");
    var items = getValue("inventory");
    var response = await closedInput();
    if (
      response == "cancel" ||
      response == "exit" ||
      response == "leave" ||
      response == "nothing"
    ) {
      handleShop(location);
      return;
    }
    var item = response;
    if (item.charAt(item.length - 1) == "s") {
      item = item.substring(0, item.length - 1);
    }
    if (toTitleCase(item) == "Coin") {
      for (let i = 0; i < items.length; i++) {
        if (items[i].name == "Coin") {
          calculateValue("gold", "add", items[i].quantity);
          if (items[i].quantity == 1) {
            quickPrint(
              "You exchanged an older coin for a newly minted gold piece."
            );
          } else {
            quickPrint(
              `You exchanged ${items[i].quantity} older coins for newly minted gold pieces.`
            );
          }
          items.splice(i, 1);
          break;
        }
      }
      handleShop(location);
      return;
    }
    for (let i = 0; i < items.length; i++) {
      if (items[i].name == toTitleCase(item)) {
        var itemEntity = items[i];
        var price = itemEntity.goldValue;
        if (currency < price) {
          quickPrint(
            "I'm afraid I'm a little short on funds, but if you purchase something, I may be able to keep doing business with you."
          );
          break;
        }
        calculateValue("gold", "add", price);
        if (itemEntity.quantity == 1) {
          items.splice(i, 1);
        } else {
          itemEntity.quantity = itemEntity.quantity - 1;
        }
        currency = currency - price;
        var locations = playerData["locations"];
        var primaryLocation = location.id.split(".")[0];
        var secondaryLocation = location.id.split(".")[1];
        locations[primaryLocation][secondaryLocation]["shopItems"] =
          location.shopItems;
        playerData["inventory"] = items;
        localStorage.setItem("playerData", JSON.stringify(playerData));
        var itemName = itemEntity.name.toLowerCase();
        if (itemEntity.name.charAt(0).match(/[aeiou]/i)) {
          quickPrint(`You sold an ${itemName}.`);
        } else {
          quickPrint(`You sold a ${itemName}.`);
        }
        break;
      } else {
        var itemName = itemEntity.name.toLowerCase();
        if (item.charAt(0).match(/[aeiou]/i)) {
          quickPrint(`You do not have an ${itemName}.`);
        } else {
          quickPrint(`You do not have a ${itemName}.`);
        }
      }
    }
    if (items.length == 0) {
      quickPrint("You have nothing left to sell.");
    }
    handleShop(location);
  } else if (response == "3" || response == "leave") {
    quickPrint("Thank you for your business.");
  }
}

function handlePickup(item) {
  var currentLocation = getValue("location");
  currentLocation = eval(getValue(currentLocation, true));
  var items = currentLocation.items;
  if (item.charAt(item.length - 1) == "s") {
    item = item.substring(0, item.length - 1);
  }
  if (items.hasOwnProperty(item)) {
    var itemEntity = items[item];
    addEntity(itemEntity, "inventory");
    delete items[item];
    var playerData = JSON.parse(localStorage.getItem("playerData"));
    var locations = playerData["locations"];
    var primaryLocation = currentLocation.id.split(".")[0];
    var secondaryLocation = currentLocation.id.split(".")[1];
    locations[primaryLocation][secondaryLocation]["items"] = items;
    localStorage.setItem("playerData", JSON.stringify(playerData));
    var itemName = itemEntity.name;
    itemName = itemName.toLowerCase();
    if (itemEntity.quantity == 1) {
      quickPrint(`You picked up a ${itemName}.`);
    } else {
      quickPrint(`You picked up ${itemEntity.quantity} ${itemName}s.`);
    }
  } else {
    quickPrint(`There is no ${item} here.`);
  }
}

function handleDrop(item) {
  var items = getValue("inventory");
  if (item.charAt(item.length - 1) == "s") {
    item = item.substring(0, item.length - 1);
  }
  for (let i = 0; i < items.length; i++) {
    if (items[i].name == toTitleCase(item)) {
      var current = items[i].quantity;
      current = current - 1;
      changeValue("itemQuantity", current, i);
      var playerData = JSON.parse(localStorage.getItem("playerData"));
      var currentLocation = getValue("location");
      var locationItems = eval(getValue(currentLocation, true).items);
      locationItems[item] = items[i];
      var locations = playerData["locations"];
      var primaryLocation = currentLocation.split(".")[0];
      var secondaryLocation = currentLocation.split(".")[1];
      locations[primaryLocation][secondaryLocation]["items"] = locationItems;
      if (item.charAt(0).match(/[aeiou]/i)) {
        quickPrint(`You dropped an ${item}.`);
      } else {
        quickPrint(`You dropped a ${item}.`);
      }
      var equipment = getValue("equipment");
      var head = equipment["head"];
      if (head != null) {
        if (head.name == toTitleCase(item)) {
          handleUnequip(item);
        }
      }
      var chest = equipment["chest"];
      if (chest != null) {
        if (chest.name == toTitleCase(item)) {
          handleUnequip(item);
        }
      }
      var legs = equipment["legs"];
      if (legs != null) {
        if (legs.name == toTitleCase(item)) {
          handleUnequip(item);
        }
      }
      var feet = equipment["feet"];
      if (feet != null) {
        if (feet.name == toTitleCase(item)) {
          handleUnequip(item);
        }
      }
      var mainHand = equipment["mainHand"];
      if (mainHand != null) {
        if (mainHand.name == toTitleCase(item)) {
          handleUnequip(item);
        }
      }
      var offHand = equipment["offHand"];
      if (offHand != null) {
        if (offHand.name == toTitleCase(item)) {
          handleUnequip(item);
        }
      }
      var accessory = equipment["accessory"];
      if (accessory != null) {
        if (accessory.name == toTitleCase(item)) {
          handleUnequip(item);
        }
      }
      equipment = getValue("equipment");
      playerData["equipment"] = equipment;
      localStorage.setItem("playerData", JSON.stringify(playerData));
      updateUI();
      break;
    }
  }
}

function handleEquip(item) {
  var items = getValue("inventory");
  if (item.charAt(item.length - 1) == "s") {
    item = item.substring(0, item.length - 1);
  }
  var hasItem = false;
  for (let i = 0; i < items.length; i++) {
    if (items[i].name == toTitleCase(item)) {
      if (items[i].position != "none") {
        addEntity(items[i], "equipment");
        if (item.charAt(0).match(/[aeiou]/i)) {
          quickPrint(`You equipped an ${item}.`);
        } else {
          quickPrint(`You equipped a ${item}.`);
        }
        hasItem = true;
        break;
      } else {
        if (item.charAt(0).match(/[aeiou]/i)) {
          quickPrint(`You cannot equip an ${item}.`);
        } else {
          quickPrint(`You cannot equip a ${item}.`);
        }
        hasItem = true;
        break;
      }
    }
  }
  if (hasItem == false) {
    if (item.charAt(0).match(/[aeiou]/i)) {
      quickPrint(`You do not have an ${item}.`);
    } else {
      quickPrint(`You do not have a ${item}.`);
    }
  }
}

function handleUnequip(item) {
  var equipment = getValue("equipment");
  var playerData = JSON.parse(localStorage.getItem("playerData"));
  var unequipped = false;
  if (item.charAt(item.length - 1) == "s") {
    item = item.substring(0, item.length - 1);
  }
  if (equipment["head"] != null) {
    if (equipment["head"].name == toTitleCase(item)) {
      equipment["head"] = null;
      quickPrint(`You unequipped the ${item}.`);
      unequipped = true;
    }
  }
  if (equipment["chest"] != null) {
    if (equipment["chest"].name == toTitleCase(item)) {
      equipment["chest"] = null;
      quickPrint(`You unequipped the ${item}.`);
      unequipped = true;
    }
  }
  if (equipment["legs"] != null) {
    if (equipment["legs"].name == toTitleCase(item)) {
      equipment["legs"] = null;
      quickPrint(`You unequipped the ${item}.`);
      unequipped = true;
    }
  }
  if (equipment["feet"] != null) {
    if (equipment["feet"].name == toTitleCase(item)) {
      equipment["feet"] = null;
      quickPrint(`You unequipped the ${item}.`);
      unequipped = true;
    }
  }
  if (equipment["mainHand"] != null) {
    if (equipment["mainHand"].name == toTitleCase(item)) {
      equipment["mainHand"] = null;
      quickPrint(`You unequipped the ${item}.`);
      unequipped = true;
    }
  }
  if (equipment["offHand"] != null) {
    if (equipment["offHand"].name == toTitleCase(item)) {
      equipment["offHand"] = null;
      quickPrint(`You unequipped the ${item}.`);
      unequipped = true;
    }
  }
  if (equipment["accessory"] != null) {
    if (equipment["accessory"].name == toTitleCase(item)) {
      equipment["accessory"] = null;
      quickPrint(`You unequipped the ${item}.`);
      unequipped = true;
    }
  }
  if (unequipped == false) {
    if (item.charAt(0).match(/[aeiou]/i)) {
      quickPrint(`You do not have an ${item} equipped.`);
    } else {
      quickPrint(`You do not have a ${item} equipped.`);
    }
  }
  playerData["equipment"] = equipment;
  localStorage.setItem("playerData", JSON.stringify(playerData));
  updateEquipment();
}

function handleUse(item) {
  var items = getValue("inventory");
  if (item.charAt(item.length - 1) == "s") {
    item = item.substring(0, item.length - 1);
  }
  for (let i = 0; i < items.length; i++) {
    if (items[i].name == toTitleCase(item)) {
      if (items[i].type == "Scroll") {
        quickPrint("You read the scroll carefully, and it vanishes.");
        quickPrint(`You learned the spell ${items[i].spell}.`);
        var spell = eval("new spells." + items[i].spell + "()");
        addEntity(spell, "knownSpells");
        items.splice(i, 1);
        var playerData = JSON.parse(localStorage.getItem("playerData"));
        playerData["inventory"] = items;
        localStorage.setItem("playerData", JSON.stringify(playerData));
        break;
      } else if (items[i].type == "Consumable") {
        var itemEntity = items[i];
        var healthValue = itemEntity.healthValue;
        var manaValue = itemEntity.manaValue;
        calculateValue("currentHealth", "add", healthValue);
        if (getValue("currentHealth") > getValue("maxHealth")) {
          changeValue("currentHealth", getValue("maxHealth"));
        }
        calculateValue("currentMana", "add", manaValue);
        if (getValue("currentMana") > getValue("maxMana")) {
          changeValue("currentMana", getValue("maxMana"));
        }
        var current = items[i].quantity;
        current = current - 1;
        changeValue("itemQuantity", current, i);
        var playerData = JSON.parse(localStorage.getItem("playerData"));
        playerData["inventory"] = items;
        localStorage.setItem("playerData", JSON.stringify(playerData));
        if (item.charAt(0).match(/[aeiou]/i)) {
          quickPrint(`You used an ${item}.`);
        } else {
          quickPrint(`You used a ${item}.`);
        }
        break;
      } else {
        if (item.charAt(0).match(/[aeiou]/i)) {
          quickPrint(`You cannot use an ${item}.`);
        } else {
          quickPrint(`You cannot use a ${item}.`);
        }
      }
    } else {
      if (item.charAt(0).match(/[aeiou]/i)) {
        quickPrint(`You do not have an ${item}.`);
      } else {
        quickPrint(`You do not have a ${item}.`);
      }
    }
  }
}

function combatParse(weapon, type, mainHandUsed, offHandUsed) {
  var equipment = getValue("equipment");
  var mainHand = equipment["mainHand"];
  var offHand = equipment["offHand"];
  var weaponUsed = false;
  if (mainHand == null && offHand == null) {
    quickPrint("You do not have a weapon equipped.");
    return [mainHandUsed, offHandUsed, "weapon", "none", "none"];
  }
  if (mainHand != null) {
    var mainHandName = mainHand["name"].toLowerCase();
    if (weapon == mainHandName) {
      if (mainHandUsed == true) {
        quickPrint("You have already attacked with that weapon this turn.");
        return [mainHandUsed, offHandUsed, "weapon", "none", "none"];
      }
      mainHandUsed = true;
      weaponUsed = true;
      var position = "mainHand";
    }
  }
  if (offHand != null) {
    var offHandName = offHand["name"].toLowerCase();
    if (weapon == offHandName) {
      if (offHandUsed == true) {
        quickPrint("You have already attacked with that weapon this turn.");
        return [mainHandUsed, offHandUsed, "weapon", "none", "none"];
      }
      offHandUsed = true;
      weaponUsed = true;
      var position = "offHand";
    }
  }
  if (weaponUsed == false) {
    quickPrint("You do not have that weapon equipped.");
    var position = "none";
  }
  return [mainHandUsed, offHandUsed, "weapon", type, position];
}

function handleSpell(words) {
  words = words.split(" ");
  var phrase = "";
  var knownSpells = getValue("knownSpells");
  var spokenSpells = getValue("spokenSpells");
  if (words.length != 3) {
    phrase = "Nothing happens.";
  } else {
    try {
      var element = eval("new spells." + toTitleCase(words[0]) + "()");
    } catch (error) {
      var invalid = true;
    }
    try {
      var spell = eval("new spells." + toTitleCase(words[1]) + "()");
    } catch (error) {
      invalid = true;
    }
    try {
      var direction = eval("new spells." + toTitleCase(words[2]) + "()");
    } catch (error) {
      invalid = true;
    }
    if (
      invalid == true ||
      element["type"] != "Element" ||
      spell["type"] != "Spell" ||
      direction["type"] != "Direction"
    ) {
      phrase = "Nothing happens.";
    } else if (
      spell.manaCost >
      getValue("currentMana") + getValue("tempMana")
    ) {
      phrase = "You don't have enough mana to cast this spell.";
    } else {
      var matchKnown = false;
      var matchSpoken = false;
      for (let i = 0; i < words.length; i++) {
        for (let j = 0; j < knownSpells.length; j++) {
          var currentSpell = eval("new spells." + toTitleCase(words[i]) + "()");
          var spellName = knownSpells[j]["name"];
          if (spellName == currentSpell.name) {
            matchKnown = true;
            addEntity(currentSpell, "spokenSpells");
            break;
          }
        }
        for (let j = 0; j < spokenSpells.length; j++) {
          currentSpell = eval("new spells." + toTitleCase(words[i]) + "()");
          spellName = spokenSpells[j]["name"];
          if (spellName == currentSpell.name) {
            matchSpoken = true;
            break;
          }
        }
        if (matchKnown == false && matchSpoken == false) {
          phrase = "Nothing happens.";
          document.getElementById("main-content").innerHTML +=
            "<p>" + phrase + "</p>";
          document.getElementById("main-content").scrollTop =
            document.getElementById("main-content").scrollHeight;
          return [0, "none"];
        }
      }
      phrase = `${element.descriptor}${spell.descriptor}${direction.descriptor}`;
      var tempMana = getValue("tempMana");
      var manaCost = spell.manaCost;
      if (tempMana > 0) {
        var difference = manaCost - tempMana;
        if (difference > 0) {
          tempMana = 0;
          manaCost = difference;
        } else {
          tempMana = tempMana - manaCost;
          manaCost = 0;
        }
        changeValue("tempMana", tempMana);
      }
      calculateValue("currentMana", "subtract", manaCost);
      if (direction.name == "Away") {
        var spellDirection = getValue("direction");
      } else if (direction.name == "Left") {
        if (getValue("direction") == "north") {
          spellDirection = "west";
        } else if (getValue("direction") == "northeast") {
          spellDirection = "northwest";
        } else if (getValue("direction") == "east") {
          spellDirection = "north";
        } else if (getValue("direction") == "southeast") {
          spellDirection = "northeast";
        } else if (getValue("direction") == "south") {
          spellDirection = "east";
        } else if (getValue("direction") == "southwest") {
          spellDirection = "southeast";
        } else if (getValue("direction") == "west") {
          spellDirection = "south";
        } else if (getValue("direction") == "northwest") {
          spellDirection = "southwest";
        }
      } else if (direction.name == "Right") {
        if (getValue("direction") == "north") {
          spellDirection = "east";
        } else if (getValue("direction") == "northeast") {
          spellDirection = "southeast";
        } else if (getValue("direction") == "east") {
          spellDirection = "south";
        } else if (getValue("direction") == "southeast") {
          spellDirection = "southwest";
        } else if (getValue("direction") == "south") {
          spellDirection = "west";
        } else if (getValue("direction") == "southwest") {
          spellDirection = "northwest";
        } else if (getValue("direction") == "west") {
          spellDirection = "north";
        } else if (getValue("direction") == "northwest") {
          spellDirection = "northeast";
        }
      } else if (direction.name == "Behind") {
        if (getValue("direction") == "north") {
          spellDirection = "south";
        } else if (getValue("direction") == "northeast") {
          spellDirection = "southwest";
        } else if (getValue("direction") == "east") {
          spellDirection = "west";
        } else if (getValue("direction") == "southeast") {
          spellDirection = "northwest";
        } else if (getValue("direction") == "south") {
          spellDirection = "north";
        } else if (getValue("direction") == "southwest") {
          spellDirection = "northeast";
        } else if (getValue("direction") == "west") {
          spellDirection = "east";
        } else if (getValue("direction") == "northwest") {
          spellDirection = "northeast";
        }
      } else if (direction.name == "Within") {
        spellDirection = "within";
      }
    }
  }
  document.getElementById("main-content").innerHTML += "<p>" + phrase + "</p>";
  document.getElementById("main-content").scrollTop =
    document.getElementById("main-content").scrollHeight;
  return [spell.power, spellDirection, spell.effect, spell.range];
}

function handleRest() {
  var currentLocation = getValue("location");
  currentLocation = eval(getValue(currentLocation, true));
  if (currentLocation.hasOwnProperty("restArea")) {
    if (currentLocation.restArea == true) {
      var maxHealth = getValue("maxHealth");
      var maxMana = getValue("maxMana");
      changeValue("currentHealth", maxHealth);
      changeValue("currentMana", maxMana);
      quickPrint("You have fully rested.");
    } else {
      quickPrint("You cannot rest here.");
    }
  } else {
    quickPrint("You cannot rest here.");
  }
}
