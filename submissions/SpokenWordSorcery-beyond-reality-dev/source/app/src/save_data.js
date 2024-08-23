module.exports = {
  initializeData,
  saveGame,
  loadGame,
  deleteGame,
  updateSaveGames,
  updateUI,
  updateEquipment,
  addEntity,
  removeEntity,
  getValue,
  changeValue,
  calculateValue,
  levelScaling,
  playerData,
};

var playerData;

const { quickPrint, getRandomInt, addDice } = require("./general");
const { inputLoop, handleMovement } = require("./handle_input");
const locationsObjects = require("./class_collections/locations");
const {
  imperialAcademy,
  imperialMarket,
  imperialNexus,
  imperialPalace,
  imperialPort,
  unknownShore,
} = require("./class_collections/locations");
const { generateMap, mapGrid } = require("./map_gen");

function initializeData(saveFile) {
  playerData = {
    saveFile: saveFile,
    name: "",
    level: 1,
    experiencePoints: 0,
    insanity: 0,
    maxHealth: 50,
    currentHealth: 50,
    tempHealth: 0,
    maxMana: 50,
    currentMana: 50,
    tempMana: 0,
    attack: 0,
    armor: 0,
    tempArmor: 0,
    speed: 10,
    gold: 0,
    encumbrance: 0,
    direction: "north",
    position: [0, 0],
    movementPoints: 0,
    location: "imperialAcademy.trainingRoom",
    isCombat: false,
    prologueCompleted: false,
    claimedThrone: false,
    gameSpeed: 1000,
  };
  var inventory = [];
  var equipment = {
    head: null,
    chest: null,
    legs: null,
    feet: null,
    mainHand: null,
    offHand: null,
    accessory: null,
  };
  var knownSpells = [];
  var spokenSpells = [];
  var memories = [];
  var locations = {};
  var keys = Object.keys(locationsObjects);
  for (let i = 0; i < keys.length; i++) {
    locations[keys[i]] = eval("locationsObjects." + keys[i]);
  }
  var mapGenerated = false;
  var map = mapGrid;
  while (mapGenerated == false) {
    var generatedMap = generateMap(map);
    if (generatedMap != false) {
      mapGenerated = true;
    }
  }
  var mapDisplayArray = generatedMap[1];
  var generatedMap = generatedMap[0];
  for (let i = 0; i < generatedMap.length; i++) {
    for (let j = 0; j < generatedMap[i].length; j++) {
      try {
        var keys = Object.keys(generatedMap[i][j]);
        for (let k = 0; k < keys.length; k++) {
          var secondaryKeys = Object.keys(generatedMap[i][j][keys[k]]);
          for (let l = 0; l < secondaryKeys.length; l++) {
            id = generatedMap[i][j][keys[k]][secondaryKeys[0]].id.split(".")[0];
            locations[id] = generatedMap[i][j][keys[k]];
          }
        }
      } catch (error) {
        console.log(error);
        continue;
      }
    }
  }
  playerData["inventory"] = inventory;
  playerData["equipment"] = equipment;
  playerData["knownSpells"] = knownSpells;
  playerData["spokenSpells"] = spokenSpells;
  playerData["memories"] = memories;
  playerData["locations"] = locations;
  playerData["map"] = mapDisplayArray;
  playerData["mapGrid"] = generatedMap;
  localStorage.setItem("playerData", JSON.stringify(playerData));
  updateUI();
}

function saveGame(saveFile) {
  var currentLocation = getValue("location");
  currentLocation = eval(getValue(currentLocation, true));
  if (currentLocation.hasOwnProperty("isCombat")) {
    if (currentLocation["isCombat"] == true) {
      window.alert("You cannot save the game during combat.");
      setTimeout(function () {
        document.getElementById("input-bar").focus();
      }, 1);
      return false;
    }
  } else if (currentLocation.hasOwnProperty("cutscenePlayed")) {
    if (currentLocation["cutscenePlayed"] == false) {
      window.alert("You must complete the cutscene before saving the game.");
      setTimeout(function () {
        document.getElementById("input-bar").focus();
      }, 1);
      return false;
    }
  }
  var save = JSON.stringify(playerData);
  localStorage.setItem(saveFile, save);
  return true;
}

async function loadGame(saveFile) {
  var save = localStorage.getItem(saveFile);
  playerData = JSON.parse(save);
  localStorage.setItem("playerData", JSON.stringify(playerData));
  updateUI();
  handleMovement("load");
  await inputLoop();
}

function deleteGame(saveFile) {
  localStorage.removeItem(saveFile);
}

function updateSaveGames() {
  var saveGames = [];
  for (let i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    if (key.includes("save_")) {
      var save = JSON.parse(localStorage.getItem(key));
      saveGames.push(save);
    }
  }
  document.getElementById("save-games").innerHTML = "";
  for (let i = 0; i < saveGames.length; i++) {
    var saveFile = saveGames[i]["saveFile"];
    var saveFileNumber = saveFile.split("_")[1];
    var name = saveGames[i]["name"];
    var level = saveGames[i]["level"];
    var gold = saveGames[i]["gold"];
    var location = saveGames[i]["location"];
    location = eval(location);
    location = location["name"];
    if (location.split("/").length > 1) {
      location = location.split("/")[0] + " " + location.split("/")[1];
    }
    document.getElementById(
      "save-games"
    ).innerHTML += `<option value="${saveFile}">Save: ${[
      saveFileNumber,
    ]} | ${name} | Level: ${level} | Gold: ${gold} | Location: ${location}</option>`;
  }
  sortNumericalList("save-games");
}

function sortNumericalList(list) {
  var list, i, switching, b, shouldSwitch;
  list = document.getElementById(list);
  switching = true;
  while (switching) {
    switching = false;
    b = list.getElementsByTagName("OPTION");
    for (i = 0; i < b.length - 1; i++) {
      shouldSwitch = false;
      if (
        Number(b[i].innerHTML.split(" ")[1]) >
        Number(b[i + 1].innerHTML.split(" ")[1])
      ) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
    }
  }
}

function updateUI() {
  updateTitleBar();
  updateSpellbook("knownSpells");
  updateSpellbook("spokenSpells");
  updateSpellbook("memories");
  updateInventory();
  updateEquipment();
}

function updateTitleBar() {
  var name = getValue("name");
  var tempHealth = getValue("tempHealth");
  var currentHealth = getValue("currentHealth");
  var maxHealth = getValue("maxHealth");
  var level = getValue("level");
  var xp = getValue("experiencePoints");
  var targetXp = level * 100;
  var xpPercentage = (xp / targetXp) * 100;
  xpPercentage = Math.floor(xpPercentage);
  if (xp >= 1000) {
    xp = xp / 1000;
    xp = xp.toFixed(1);
    targetXp = targetXp / 1000;
    targetXp = targetXp.toFixed(1);
    targetXp = targetXp + "k";
  }
  var tempMana = getValue("tempMana");
  var currentMana = getValue("currentMana");
  var maxMana = getValue("maxMana");
  document.getElementById("name-text").innerHTML = `Name: ${name}`;
  document.getElementById("health-bar").value = currentHealth;
  document.getElementById("health-bar").max = maxHealth;
  if (tempHealth > 0) {
    document.getElementById(
      "health-text"
    ).innerHTML = `Health: ${currentHealth}/${maxHealth} + ${tempHealth} Temp HP`;
  } else {
    document.getElementById(
      "health-text"
    ).innerHTML = `Health: ${currentHealth}/${maxHealth}`;
  }
  document.getElementById(
    "level-text"
  ).innerHTML = `Level: ${level} (${xp}/${targetXp} XP | ${xpPercentage}%)`;
  document.getElementById("mana-bar").value = currentMana;
  document.getElementById("mana-bar").max = maxMana;
  var tempMana = getValue("tempMana");
  if (tempMana > 0) {
    document.getElementById(
      "mana-text"
    ).innerHTML = `Mana: ${currentMana}/${maxMana} + ${tempMana} Temp Mana`;
  } else {
    document.getElementById(
      "mana-text"
    ).innerHTML = `Mana: ${currentMana}/${maxMana}`;
  }
}

function updateSpellbook(target) {
  var spells = getValue(target);
  if (target == "knownSpells" || target == "spokenSpells") {
    if (target == "knownSpells") {
      targetElement = "known-spells";
    } else if (target == "spokenSpells") {
      targetElement = "spoken-spells";
    }
    for (let i = 0; i < spells.length; i++) {
      var spellName = spells[i]["name"];
      var spellDescription = spells[i]["description"];
      var spellType = spells[i]["type"];
      if (spellType == "Element" || spellType == "Direction") {
        if (document.getElementById(spellName)) {
          document.getElementById(spellName).remove();
        }
        document.getElementById(
          targetElement
        ).innerHTML += `<option id="${spellName}">${spellName} | ${spellType} | ${spellDescription}</option>`;
      } else if (spellType == "Spell") {
        var spellPower = spells[i]["power"];
        var spellRange = spells[i]["range"];
        var spellManaCost = spells[i]["manaCost"];
        var spellEffect = spells[i]["effect"];
        switch (spellEffect) {
          case "damage":
            spellEffect = "Damage";
            break;
          case "healthIncrease":
            spellEffect = "Healing";
            break;
          case "tempHealth":
            spellEffect = "Temporary Health";
            break;
          case "manaIncrease":
            spellEffect = "Mana Increase";
            break;
          case "tempMana":
            spellEffect = "Temporary Mana";
            break;
          case "tempArmor":
            spellEffect = "Temporary Armor";
            break;
          case "speedIncrease":
            spellEffect = "Speed Increase";
            break;
          case "rangeIncrease":
            spellEffect = "Range Increase";
            break;
          case "attackIncrease":
            spellEffect = "Attack Increase";
            break;
        }
        if (document.getElementById(spellName)) {
          document.getElementById(spellName).remove();
        }
        if (spells[i]["isSupport"] == true) {
          document.getElementById(
            targetElement
          ).innerHTML += `<option id="${spellName}">${spellName} | ${spellType} | ${spellDescription} | Atk↑: ${spellAttackIncrease} | HP↑: ${spellHealthIncrease} | Def↑: ${spellArmorIncrease} | Spd↑: ${spellSpeedIncrease} | Rng↑: ${spellRangeIncrease}</option>`;
        } else {
          document.getElementById(
            targetElement
          ).innerHTML += `<option id="${spellName}">${spellName} | ${spellType} | ${spellDescription} | Power: ${spellPower} ${spellEffect} | Range: ${spellRange} | Mana Cost: ${spellManaCost}</option>`;
        }
      }
    }
  } else if (target == "memories") {
    for (let i = 0; i < spells.length; i++) {
      var memory = spells[i];
      if (!document.getElementById(memory)) {
        document.getElementById(
          "memories"
        ).innerHTML += `<option id="${memory}">${memory}</option>`;
      }
    }
  }
  sortList("known-spells");
  sortList("spoken-spells");
  sortList("memories");
}

function sortList(list) {
  var list, i, switching, b, shouldSwitch;
  list = document.getElementById(list);
  switching = true;
  while (switching) {
    switching = false;
    b = list.getElementsByTagName("OPTION");
    for (i = 0; i < b.length - 1; i++) {
      shouldSwitch = false;
      if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
    }
  }
}

function updateInventory() {
  var gold = getValue("gold");
  var encumbrance = 0;
  var items = getValue("inventory");
  document.getElementById("weapons").innerHTML = "";
  document.getElementById("armor").innerHTML = "";
  document.getElementById("consumables").innerHTML = "";
  document.getElementById("miscellaneous").innerHTML = "";
  for (let i = 0; i < items.length; i++) {
    var itemName = items[i]["name"];
    var itemDescription = items[i]["description"];
    var itemGoldValue = items[i]["goldValue"];
    var itemWeight = items[i]["weight"];
    var itemQuantity = items[i]["quantity"];
    if (itemQuantity <= 0) {
      items.splice(i, 1);
      continue;
    }
    if (items[i]["type"] == "Weapon") {
      if (items[i].hasOwnProperty("minRange")) {
        var itemMinRange = items[i]["minRange"];
        var itemEffectiveRange = items[i]["effectiveRange"];
        var itemMaxRange = items[i]["maxRange"];
        var itemRangedAttackValue = items[i]["rangedAttackValue"];
        if (items[i].hasOwnProperty("attackValue")) {
          document.getElementById(
            "weapons"
          ).innerHTML += `<option id="${itemName}">${itemName} | ${itemDescription} | Atk: ${itemAttackValue} | Rng Atk: ${itemRangedAttackValue} | Rng: ${itemMinRange}/${itemEffectiveRange}/${itemMaxRange} ft. | Wgt: ${itemWeight} | ${itemGoldValue} Gold | x${itemQuantity}</option>`;
        } else {
          document.getElementById(
            "weapons"
          ).innerHTML += `<option id="${itemName}">${itemName} | ${itemDescription} | Rng Atk: ${itemRangedAttackValue} | Rng: ${itemMinRange}/${itemEffectiveRange}/${itemMaxRange} ft. | Wgt: ${itemWeight} | ${itemGoldValue} Gold | x${itemQuantity}</option>`;
        }
      } else {
        var itemAttackValue = items[i]["attackValue"];
        document.getElementById(
          "weapons"
        ).innerHTML += `<option id="${itemName}">${itemName} | ${itemDescription} | Atk: ${itemAttackValue} | Wgt: ${itemWeight} | ${itemGoldValue} Gold | x${itemQuantity}</option>`;
      }
    } else if (items[i]["type"] == "Armor") {
      var itemArmorValue = items[i]["armorValue"];
      document.getElementById(
        "armor"
      ).innerHTML += `<option id="${itemName}">${itemName} | ${itemDescription} | Def: ${itemArmorValue} | Wgt: ${itemWeight} | ${itemGoldValue} Gold | x${itemQuantity}</option>`;
    } else if (items[i]["type"] == "Consumable") {
      var itemHealthValue = items[i]["healthValue"];
      var itemManaValue = items[i]["manaValue"];
      var itemSpeedValue = items[i]["speedValue"];
      document.getElementById(
        "consumables"
      ).innerHTML += `<option id="${itemName}">${itemName} | ${itemDescription} | HP↑: ${itemHealthValue} | Mana↑: ${itemManaValue} | Spd↑: ${itemSpeedValue} | Wgt: ${itemWeight} | ${itemGoldValue} Gold | x${itemQuantity}</option>`;
    } else if (items[i]["type"] == "Miscellaneous") {
      document.getElementById(
        "miscellaneous"
      ).innerHTML += `<option id="${itemName}">${itemName} | ${itemDescription} | Wgt: ${itemWeight} | ${itemGoldValue} Gold | x${itemQuantity}</option>`;
    }
    encumbrance = encumbrance + itemWeight * itemQuantity;
  }
  playerData["encumbrance"] = encumbrance;
  document.getElementById(
    "gold-counter"
  ).innerHTML = `Gold: ${gold} | Encumbrance: ${encumbrance} lbs`;
  sortList("weapons");
  sortList("armor");
  sortList("consumables");
  sortList("miscellaneous");
}

function updateEquipment() {
  var equipment = getValue("equipment");
  var armorValue = 0;
  var attackValue = 0;
  if (equipment["head"] != null) {
    var itemName = equipment["head"]["name"];
    var itemDescription = equipment["head"]["description"];
    var itemArmorValue = equipment["head"]["armorValue"];
    var itemWeight = equipment["head"]["weight"];
    document.getElementById(
      "head"
    ).innerHTML = `<option id="${itemName}">${itemName} | ${itemDescription} | Def: ${itemArmorValue} | Wgt: ${itemWeight}</option>`;
    armorValue = armorValue + itemArmorValue;
  } else {
    document.getElementById("head").innerHTML = "";
  }
  if (equipment["chest"] != null) {
    itemName = equipment["chest"]["name"];
    itemDescription = equipment["chest"]["description"];
    itemArmorValue = equipment["chest"]["armorValue"];
    itemWeight = equipment["chest"]["weight"];
    document.getElementById(
      "chest"
    ).innerHTML = `<option id="${itemName}">${itemName} | ${itemDescription} | Def: ${itemArmorValue} | Wgt: ${itemWeight}</option>`;
    armorValue = armorValue + itemArmorValue;
  } else {
    document.getElementById("chest").innerHTML = "";
  }
  if (equipment["legs"] != null) {
    itemName = equipment["legs"]["name"];
    itemDescription = equipment["legs"]["description"];
    itemArmorValue = equipment["legs"]["armorValue"];
    itemWeight = equipment["legs"]["weight"];
    document.getElementById(
      "legs"
    ).innerHTML = `<option id="${itemName}">${itemName} | ${itemDescription} | Def: ${itemArmorValue} | Wgt: ${itemWeight}</option>`;
    armorValue = armorValue + itemArmorValue;
  } else {
    document.getElementById("legs").innerHTML = "";
  }
  if (equipment["feet"] != null) {
    itemName = equipment["feet"]["name"];
    itemDescription = equipment["feet"]["description"];
    itemArmorValue = equipment["feet"]["armorValue"];
    itemWeight = equipment["feet"]["weight"];
    document.getElementById(
      "feet"
    ).innerHTML = `<option id="${itemName}">${itemName} | ${itemDescription} | Def: ${itemArmorValue} | Wgt: ${itemWeight}</option>`;
    armorValue = armorValue + itemArmorValue;
  } else {
    document.getElementById("feet").innerHTML = "";
  }
  if (equipment["mainHand"] != null) {
    itemName = equipment["mainHand"]["name"];
    itemDescription = equipment["mainHand"]["description"];
    itemWeight = equipment["mainHand"]["weight"];
    if (equipment["mainHand"].hasOwnProperty("minRange")) {
      var itemMinRange = equipment["mainHand"]["minRange"];
      var itemEffectiveRange = equipment["mainHand"]["effectiveRange"];
      var itemMaxRange = equipment["mainHand"]["maxRange"];
      var itemRangedAttackValue = equipment["mainHand"]["rangedAttackValue"];
      if (equipment["mainHand"].hasOwnProperty("attackValue")) {
        var itemAttackValue = equipment["mainHand"]["attackValue"];
        document.getElementById(
          "mainHand"
        ).innerHTML = `<option id="${itemName}">${itemName} | ${itemDescription} | Atk: ${itemAttackValue} | Rng Atk: ${itemRangedAttackValue} | Rng: ${itemMinRange}/${itemEffectiveRange}/${itemMaxRange} ft. | Wgt: ${itemWeight}</option>`;
        attackValue = addDice(attackValue, itemAttackValue);
      } else {
        document.getElementById(
          "mainHand"
        ).innerHTML = `<option id="${itemName}">${itemName} | ${itemDescription} | Rng Atk: ${itemRangedAttackValue} | Rng: ${itemMinRange}/${itemEffectiveRange}/${itemMaxRange} ft. | Wgt: ${itemWeight}</option>`;
        attackValue = addDice(attackValue, itemRangedAttackValue);
      }
    } else if (equipment["mainHand"]["attackValue"] != 0) {
      var itemAttackValue = equipment["mainHand"]["attackValue"];
      document.getElementById(
        "mainHand"
      ).innerHTML = `<option id="${itemName}">${itemName} | ${itemDescription} | Atk: ${itemAttackValue} | Wgt: ${itemWeight}</option>`;
      attackValue = addDice(attackValue, itemAttackValue);
    } else if (equipment["mainHand"]["armorValue"] != 0) {
      var itemArmorValue = equipment["mainHand"]["armorValue"];
      document.getElementById(
        "mainHand"
      ).innerHTML = `<option id="${itemName}">${itemName} | ${itemDescription} | Def: ${itemArmorValue} | Wgt: ${itemWeight}</option>`;
      armorValue = armorValue + itemArmorValue;
    }
  } else {
    document.getElementById("mainHand").innerHTML = "";
  }
  if (equipment["offHand"] != null) {
    itemName = equipment["offHand"]["name"];
    itemDescription = equipment["offHand"]["description"];
    itemWeight = equipment["offHand"]["weight"];
    if (equipment["offHand"].hasOwnProperty("minRange")) {
      var itemMinRange = equipment["offHand"]["minRange"];
      var itemEffectiveRange = equipment["offHand"]["effectiveRange"];
      var itemMaxRange = equipment["offHand"]["maxRange"];
      var itemRangedAttackValue = equipment["offHand"]["rangedAttackValue"];
      if (equipment["offHand"].hasOwnProperty("attackValue")) {
        var itemAttackValue = equipment["offHand"]["attackValue"];
        document.getElementById(
          "offHand"
        ).innerHTML = `<option id="${itemName}">${itemName} | ${itemDescription} | Atk: ${itemAttackValue} | Rng Atk: ${itemRangedAttackValue} | Rng: ${itemMinRange}/${itemEffectiveRange}/${itemMaxRange} ft. | Wgt: ${itemWeight}</option>`;
        attackValue = addDice(attackValue, itemAttackValue);
        offHandAttackValue = itemAttackValue;
      } else {
        document.getElementById(
          "offHand"
        ).innerHTML = `<option id="${itemName}">${itemName} | ${itemDescription} | Rng Atk: ${itemRangedAttackValue} | Rng: ${itemMinRange}/${itemEffectiveRange}/${itemMaxRange} ft. | Wgt: ${itemWeight}</option>`;
        attackValue = addDice(attackValue, itemRangedAttackValue);
        offHandAttackValue = itemRangedAttackValue;
      }
    } else if (equipment["offHand"]["rangedAttackValue"] != 0) {
      itemAttackValue = equipment["offHand"]["rangedAttackValue"];
      itemRangeValue = equipment["offHand"]["rangeValue"];
      document.getElementById(
        "offHand"
      ).innerHTML = `<option id="${itemName}">${itemName} | ${itemDescription} | Atk: ${itemAttackValue} | Rng: ${itemRangeValue} | Wgt: ${itemWeight}</option>`;
      attackValue = addDice(attackValue, itemAttackValue);
      offHandAttackValue = itemAttackValue;
    } else if (equipment["offHand"]["armorValue"] != 0) {
      itemArmorValue = equipment["offHand"]["armorValue"];
      document.getElementById(
        "offHand"
      ).innerHTML = `<option id="${itemName}">${itemName} | ${itemDescription} | Def: ${itemArmorValue} | Wgt: ${itemWeight}</option>`;
      armorValue = armorValue + itemArmorValue;
    }
  } else {
    document.getElementById("offHand").innerHTML = "";
  }
  if (equipment["accessory"] != null) {
    itemName = equipment["accessory"]["name"];
    itemDescription = equipment["accessory"]["description"];
    itemWeight = equipment["accessory"]["weight"];
    if (equipment["accessory"]["manaValue"] != 0) {
      var itemManaValue = equipment["accessory"]["manaValue"];
      document.getElementById(
        "accessory"
      ).innerHTML = `<option id="${itemName}">${itemName} | ${itemDescription} | Mana↑: ${itemManaValue} | Wgt: ${itemWeight}</option>`;
    } else if (equipment["accessory"]["speedValue"] != 0) {
      var itemSpeedValue = equipment["accessory"]["speedValue"];
      document.getElementById(
        "accessory"
      ).innerHTML = `<option id="${itemName}">${itemName} | ${itemDescription} | Spd↑: ${itemSpeedValue} | Wgt: ${itemWeight}</option>`;
    } else {
      document.getElementById(
        "accessory"
      ).innerHTML = `<option id="${itemName}">${itemName} | ${itemDescription} | Wgt: ${itemWeight}</option>`;
    }
  } else {
    document.getElementById("accessory").innerHTML = "";
  }
  playerData["attack"] = attackValue;
  playerData["armor"] = armorValue;
  var tempArmor = getValue("tempArmor");
  var speed = getValue("speed");
  if (tempArmor > 0) {
    document.getElementById(
      "stats-display"
    ).innerHTML = `Defense: ${armorValue} + ${tempArmor} Temp Armor | Attack: ${attackValue} | Speed: ${getValue(
      speed
    )}`;
  } else {
    document.getElementById(
      "stats-display"
    ).innerHTML = `Defense: ${armorValue} | Attack: ${attackValue} | Speed: ${speed}`;
  }
}

function addEntity(entity, target) {
  var matchKnown = false;
  if (target == "spokenSpells") {
    for (let i = 0; i < playerData["knownSpells"].length; i++) {
      if (playerData["knownSpells"][i]["name"] == entity["name"]) {
        var matchKnown = true;
        var index = i;
        break;
      }
    }
    if (matchKnown == true) {
      playerData["knownSpells"].splice(index, 1);
    }
    playerData["spokenSpells"].push(entity);
  } else if (target == "knownSpells") {
    for (let i = 0; i < playerData["knownSpells"].length; i++) {
      if (playerData["knownSpells"][i]["name"] == entity["name"]) {
        var matchKnown = true;
        var index = i;
        break;
      }
    }
    if (matchKnown == false) {
      playerData["knownSpells"].push(entity);
    }
  } else if (target == "inventory") {
    var hits = 0;
    for (let i = 0; i < playerData["inventory"].length; i++) {
      if (playerData["inventory"][i]["name"] == entity["name"]) {
        playerData["inventory"][i]["quantity"] =
          playerData["inventory"][i]["quantity"] + entity["quantity"];
        hits = hits + 1;
      }
    }
    if (hits == 0) {
      playerData["inventory"].push(entity);
    }
  } else if (target == "equipment") {
    var position = entity["position"];
    if (position == "bothHands") {
      playerData["equipment"]["offHand"] = null;
      playerData["equipment"]["mainHand"] = entity;
    } else if (position == "eitherHand") {
      if (
        playerData["equipment"]["mainHand"] == null &&
        playerData["equipment"]["offHand"] == null
      ) {
        playerData["equipment"]["mainHand"] = entity;
      } else if (playerData["equipment"]["mainHand"] == null) {
        playerData["equipment"]["mainHand"] = entity;
      } else if (playerData["equipment"]["offHand"]) {
        playerData["equipment"]["offhand"] = entity;
      } else {
        playerData["equipment"]["mainHand"] = entity;
      }
    }
  } else {
    playerData[target].push(entity);
  }
  updateUI();
}

function removeEntity(entity, target) {
  var hits = 0;
  for (let i = 0; i < playerData[target].length; i++) {
    if (playerData[target][i]["name"] == entity) {
      if (hits == 0) {
        playerData[target].splice(i, 1);
      }
      hits = hits + 1;
    }
  }
  if (target == "inventory" && hits == 1) {
    for (let i = 0; i < playerData["equipment"].length; i++) {
      if (playerData["equipment"][i]["name"] == entity) {
        playerData["equipment"].splice(i, 1);
      }
    }
  }
  updateUI();
}

function getValue(target, locations = false) {
  if (locations) {
    var locations = playerData["locations"];
    var primaryTarget = target.split(".")[0];
    var secondaryTarget = target.split(".")[1];
    var value = locations[primaryTarget][secondaryTarget];
    return value;
  }
  var value = playerData[target];
  return value;
}

function changeValue(target, newValue, i = 0) {
  if (target == "itemQuantity") {
    playerData["inventory"][i]["quantity"] = newValue;
  } else if (i == "locations") {
    var primaryLocation = target.split(".")[0];
    var secondaryLocation = target.split(".")[1];
    var primaryTarget = target.split(".")[2];
    playerData["locations"][primaryLocation][secondaryLocation][primaryTarget] =
      newValue;
  } else if (target == "experiencePoints") {
    playerData[target] = newValue;
    levelChecker();
    return;
  } else {
    playerData[target] = newValue;
  }
  updateUI();
}

function calculateValue(target, operation, amount) {
  var value = getValue(target);
  if (operation == "add") {
    value = value + amount;
  } else if (operation == "subtract") {
    value = value - amount;
  } else if (operation == "multiply") {
    value = value * amount;
  } else if (operation == "divide") {
    value = value / amount;
  }
  changeValue(target, value);
}

function levelChecker() {
  var level = getValue("level");
  var experiencePoints = getValue("experiencePoints");
  if (experiencePoints >= level * 100) {
    var difference = experiencePoints - level * 100;
    changeValue("experiencePoints", difference);
    var newLevel = level + 1;
    changeValue("level", newLevel);
    levelUp();
  }
}

function levelUp() {
  var previousHealth = getValue("maxHealth");
  var previousMana = getValue("maxMana");
  var previousSpeed = getValue("speed");
  var diceRoll = getRandomInt(10) + 10;
  calculateValue("maxHealth", "add", diceRoll);
  var maxHealth = getValue("maxHealth");
  changeValue("currentHealth", maxHealth);
  diceRoll = getRandomInt(5) + 5;
  calculateValue("maxMana", "add", diceRoll);
  var maxMana = getValue("maxMana");
  changeValue("currentMana", maxMana);
  calculateValue("speed", "add", 1);
  var speed = getValue("speed");
  quickPrint(
    `You have leveled up! Your maximum health has increased from ${previousHealth} to ${maxHealth}, your maximum mana has increased from ${previousMana} to ${maxMana}, and your speed has increased from ${previousSpeed} to ${speed}!`
  );
  updateUI();
}

function levelScaling(dice, type = "null") {
  var level = getValue("level");
  var dice = dice.split("d");
  var scale = Math.floor(level / 10);
  if (type == "bothHands") {
    scale = scale * 2;
    var scaledDice = Number(dice[0]) + scale;
    dice = `${scaledDice}d${dice[1]}`;
    return dice;
  } else {
    scaledDice = Number(dice[0]) + scale;
    dice = `${scaledDice}d${dice[1]}`;
    return dice;
  }
}
