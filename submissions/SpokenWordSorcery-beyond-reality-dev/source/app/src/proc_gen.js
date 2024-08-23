const items = require("./class_collections/item_catalog");
const enemies = require("./class_collections/enemy_menagerie");
const spells = require("./class_collections/spellbook");
const { NameGenerator } = require("../lib/markov_namegen/name_generator");
const { getRandomInt, printLines, requireAnswer } = require("./general");
const { getValue, calculateValue, playerData } = require("./save_data");
const {
  handleCombat,
  findEnemiesInCell,
  findPlayerInCell,
} = require("./combat");
const { handleMovement, closedInput } = require("./handle_input");

function generateName(type, quantity = 1) {
  if (type.split(" ").length > 1) {
    var type = type.split(" ");
    if (type[0] == "either") {
      var coinFlip = Math.random();
      if (coinFlip > 0.5) {
        var gender = "male";
      } else {
        gender = "female";
      }
      var type = type[1];
    } else {
      var gender = type[0];
      var type = type[1];
    }
  }
  const fs = require("fs");
  var data;
  if (type == "fullName") {
    if (quantity == 1) {
      var forename = generateName(`${gender} forename`);
      var surname = generateName("surname");
      var name = forename + " " + surname;
      return name;
    } else {
      data = [];
      for (let i = 0; i < quantity; i++) {
        var forename = generateName(`${gender} forename`);
        var surname = generateName("surname");
        var name = forename + " " + surname;
        data.push(name);
      }
      return data;
    }
  } else if (type == "forename") {
    if (gender == "male") {
      data = fs.readFileSync(
        "./app/lib/markov_namegen/word_lists/male_forenames.txt",
        "utf8"
      );
    } else if (gender == "female") {
      data = fs.readFileSync(
        "./app/lib/markov_namegen/word_lists/female_forenames.txt",
        "utf8"
      );
    }
  } else if (type == "surname") {
    data = fs.readFileSync(
      "./app/lib/markov_namegen/word_lists/surnames.txt",
      "utf8"
    );
  } else if (type == "town") {
    data = fs.readFileSync(
      "./app/lib/markov_namegen/word_lists/towns.txt",
      "utf8"
    );
  }
  var data = data.split("\n");
  var generator = new NameGenerator(data, 10, 0, false);
  var isNull = true;
  if (quantity == 1) {
    while (isNull) {
      var generatedName = generator.generateName(5, 11, "", "", "", "");
      if (generatedName != null) {
        isNull = false;
      }
    }
    generatedName = generatedName.replace("\r", "");
    return generatedName;
  }
  var names = [];
  for (let i = 0; i < quantity; i++) {
    isNull = true;
    while (isNull) {
      var generatedName = generator.generateName(5, 11, "", "", "", "");
      if (generatedName != null) {
        isNull = false;
      }
    }
    generatedName = generatedName.replace("\r", "");
    names.push(generatedName);
  }
  return names;
}

function generateShop(tier) {
  var name = generateName("either fullName");
  var items = [];
  var numItems = tier * getRandomInt(5) + 5;
  var currency = tier * getRandomInt(500) + 100;
  var itemTier = tier;
  var itemTypes = [
    "weapon",
    "weapon",
    "weapon",
    "weapon",
    "armor",
    "armor",
    "armor",
    "potion",
    "potion",
    "scroll",
  ];
  for (let i = 0; i < numItems; i++) {
    var itemType = itemTypes[getRandomInt(itemTypes.length)];
    var item = generateItem(itemType, itemTier);
    items.push(item);
  }
  var uniqueItems = [];
  for (let i = 0; i < items.length; i++) {
    var isUnique = true;
    for (let j = 0; j < uniqueItems.length; j++) {
      if (items[i].name == uniqueItems[j].name) {
        isUnique = false;
      }
    }
    if (isUnique) {
      uniqueItems.push(items[i]);
    }
  }
  items = uniqueItems;
  var ammo = generateAmmo(tier);
  for (let i = 0; i < ammo.length; i++) {
    items.push(ammo[i]);
  }
  var markup = 1.1 + (Math.random() * 4) / 10;
  return [name, items, currency, markup];
}

function generateItem(type, tier) {
  var item;
  if (type == "weapon") {
    item = generateWeapon(tier);
  } else if (type == "armor") {
    item = generateArmor(tier);
  } else if (type == "potion") {
    item = generatePotion(tier);
  } else if (type == "scroll") {
    item = generateScroll();
  }
  return item;
}

function generateWeapon(tier, firstName = "", lastName = "") {
  if (tier < 4) {
    var weaponTypes = items[`tier${tier}Weapons`];
    var weaponType = weaponTypes[getRandomInt(weaponTypes.length)];
    var weapon = new items[weaponType]();
  } else {
    coinFlip = Math.random();
    if (coinFlip > 0.5) {
      var weaponTypes = items[`tier3Weapons`];
      var weaponType = weaponTypes[getRandomInt(weaponTypes.length)];
      if (firstName == "" && lastName == "") {
        var generatedFirstName = generateName("either forename");
        var generatedLastName = generateName("surname");
        var generatedName = `${generatedFirstName} ${generatedLastName}`;
      } else {
        var generatedFirstName = firstName;
        var generatedLastName = lastName;
        var generatedName = `${generatedFirstName} ${generatedLastName}`;
      }
      var baseWeapon = new items[weaponType]();
      var basePrice = baseWeapon.value;
      var newPrice = boost * 1.5 * basePrice;
      if (
        baseWeapon.hasOwnProperty("rangedAttackValue") &&
        baseWeapon.hasOwnProperty("attackValue")
      ) {
        var baseAttack = baseWeapon.attackValue;
        var number = baseAttack.split("d")[0];
        var sides = baseAttack.split("d")[1];
        var boost = getRandomInt(tier) + 1;
        var newAttack = `${number + boost}d${sides}`;
        var rangedAttack = baseWeapon.rangedAttackValue;
        var number = rangedAttack.split("d")[0];
        var sides = rangedAttack.split("d")[1];
        var newRangedAttack = `${number + boost}d${sides}`;
        var weapon = {
          name: `${generatedFirstName}'s ${baseWeapon.name}`,
          description: `A ${baseWeapon.name} that once belonged to ${generatedName}.`,
          attackValue: newAttack,
          rangedAttackValue: newRangedAttack,
          minRange: baseWeapon.minRange,
          effectiveRange: baseWeapon.effectiveRange,
          maxRange: baseWeapon.maxRange,
          weight: baseWeapon.weight,
          value: newPrice,
          type: baseWeapon.type,
          quantity: 1,
        };
      } else if (baseWeapon.hasOwnProperty("rangedAttackValue")) {
        var rangedAttack = baseWeapon.rangedAttackValue;
        var number = rangedAttack.split("d")[0];
        var sides = rangedAttack.split("d")[1];
        var boost = getRandomInt(tier) + 1;
        var newRangedAttack = `${number + boost}d${sides}`;
        var weapon = {
          name: `${generatedFirstName}'s ${baseWeapon.name}`,
          description: `A ${baseWeapon.name} that once belonged to ${generatedName}.`,
          rangedAttackValue: newRangedAttack,
          minRange: baseWeapon.minRange,
          effectiveRange: baseWeapon.effectiveRange,
          maxRange: baseWeapon.maxRange,
          weight: baseWeapon.weight,
          value: newPrice,
          type: baseWeapon.type,
          quantity: 1,
        };
      } else {
        var attack = baseWeapon.attackValue;
        var number = attack.split("d")[0];
        var sides = attack.split("d")[1];
        var boost = getRandomInt(tier) + 1;
        var newAttack = `${number + boost}d${sides}`;
        var weapon = {
          name: `${generatedFirstName}'s ${baseWeapon.name}`,
          description: `A ${baseWeapon.name} that once belonged to ${generatedName}.`,
          attackValue: newAttack,
          weight: baseWeapon.weight,
          value: newPrice,
          type: baseWeapon.type,
          quantity: 1,
        };
      }
    } else {
      var weaponTypes = items[`tier3Weapons`];
      var weaponType = weaponTypes[getRandomInt(weaponTypes.length)];
      var weapon = new items[weaponType]();
    }
  }
  return weapon;
}

function generateArmor(tier, firstName = "", lastName = "") {
  if (tier < 4) {
    var armorTypes = items[`tier${tier}Armor`];
    var armorType = armorTypes[getRandomInt(armorTypes.length)];
    var armor = new items[armorType]();
  } else {
    coinFlip = Math.random();
    if (coinFlip > 0.5) {
      var armorTypes = items[`tier3Armor`];
      var armorType = armorTypes[getRandomInt(armorTypes.length)];
      if (firstName == "" && lastName == "") {
        var generatedFirstName = generateName("either forename");
        var generatedLastName = generateName("surname");
        var generatedName = `${generatedFirstName} ${generatedLastName}`;
      } else {
        var generatedFirstName = firstName;
        var generatedLastName = lastName;
        var generatedName = `${generatedFirstName} ${generatedLastName}`;
      }
      var boost = getRandomInt(tier) + 1;
      var baseArmor = new items[armorType]();
      var defenseValue = baseArmor.defenseValue + boost;
      var basePrice = baseArmor.value;
      var newPrice = boost * 1.5 * basePrice;
      var armor = {
        name: `${generatedFirstName}'s ${baseArmor.name}`,
        description: `A ${baseArmor.name} that once belonged to ${generatedName}.`,
        defenseValue: defenseValue,
        weight: baseArmor.weight,
        value: newPrice,
        type: baseArmor.type,
        quantity: 1,
      };
    } else {
      var armorTypes = items[`tier3Armor`];
      var armorType = armorTypes[getRandomInt(armorTypes.length)];
      var armor = new items[armorType]();
    }
  }
  return armor;
}

function generatePotion(tier) {
  if (tier < 4) {
    var potionTypes = items[`tier${tier}Potions`];
  } else {
    var potionTypes = items[`tier3Potions`];
  }
  var potionType = potionTypes[getRandomInt(potionTypes.length)];
  var potion = new items[potionType]();
  return potion;
}

function generateScroll() {
  var scrollTypes = spells.scrolls;
  var scrollType = scrollTypes[getRandomInt(scrollTypes.length)];
  var scrollName = `${scrollType} Scroll`;
  var scrollDescription = `A scroll that, when read, grants the reader the ability to cast the ${scrollType} spell.`;
  var scroll = {
    name: scrollName,
    description: scrollDescription,
    saleName: "Scroll",
    saleDescription: `A scroll that grants the ability to cast a spell. Of course, you cannot know what spell it contains until you read it.`,
    spell: scrollType,
    goldValue: 100,
    quantity: 1,
    type: "scroll",
  };
  return scroll;
}

function generateAmmo(tier) {
  var ammo = [];
  var standardAmmo = items[`tier1Ammo`];
  for (let i = 0; i < standardAmmo.length; i++) {
    var quantity = tier * (getRandomInt(25) + 1);
    var ammoComponent = new items[standardAmmo[i]](quantity);
    ammo.push(ammoComponent);
  }
  if (tier > 1 && tier < 4) {
    for (let i = 2; i <= tier; i++) {
      var ammoTypes = items[`tier${i}Ammo`];
      for (let j = 0; j < ammoTypes.length; j++) {
        quantity = tier * (getRandomInt(25) + 1);
        ammoComponent = new items[ammoTypes[j]](quantity);
        ammo.push(ammoComponent);
      }
    }
  }
  return ammo;
}

function generateRandomEncounter(tier, hostile = true) {
  if (tier == 0) {
    var locations = playerData.locations;
    var locationName = getValue("location");
    var primaryLocation = locationName.split(".")[0];
    var secondaryLocation = locationName.split(".")[1];
    var location = locations[primaryLocation][secondaryLocation];
    location.encountered = true;
    return;
  }
  if (hostile == "either") {
    var coinFlip = Math.random();
    if (coinFlip > 0.5) {
      var hostile = true;
    } else {
      var hostile = false;
    }
  }
  if (hostile) {
    var locations = playerData.locations;
    var locationName = getValue("location");
    var primaryLocation = locationName.split(".")[0];
    var secondaryLocation = locationName.split(".")[1];
    var location = locations[primaryLocation][secondaryLocation];
    if (location.hasOwnProperty("enemies")) {
      var enemies = location.enemies;
    } else {
      location.enemies = [];
      var enemies = location.enemies;
    }
    var numEnemies = tier * getRandomInt(5) + 1;
    var generatedEnemies = generateEnemy(tier, numEnemies);
    var faction = generatedEnemies[0];
    var generatedEnemies = generatedEnemies[1];
    enemies = enemies.concat(generatedEnemies);
    playerData.locations[primaryLocation][secondaryLocation].enemies = enemies;
    handleEncounter(faction, tier);
  } else {
    var encounterTypes = ["shop"];
    var encounterType = encounterTypes[getRandomInt(encounterTypes.length)];
    if (encounterType == "shop") {
      var shop = generateShop(tier);
      var locations = playerData.locations;
      var locationName = getValue("location");
      var primaryLocation = locationName.split(".")[0];
      var secondaryLocation = locationName.split(".")[1];
      var location = locations[primaryLocation][secondaryLocation];
      location.vendor = shop[0];
      location.shopItems = shop[1];
      location.currency = shop[2];
      location.markup = shop[3];
      location.description = `You have encountered a traveling cart run by ${shop[0]}.`;
      playerData.locations[primaryLocation][secondaryLocation] = location;
      handleMovement("load");
    }
  }
  location.encountered = true;
}

function generateEnemy(tier, quantity = 1) {
  var enemyList = [];
  var enemyFactions = enemies["factions"];
  var faction = enemyFactions[getRandomInt(enemyFactions.length)];
  for (let i = 0; i < quantity; i++) {
    if (tier < 4) {
      var enemyTypes = enemies[`tier${tier}${faction}Enemies`];
      var enemyType = enemyTypes[getRandomInt(enemyTypes.length)];
      var enemyName = faction;
      var enemyPosition = generateEnemyPosition(enemyList);
      var enemy = new enemies[enemyType](enemyName, enemyPosition);
      enemyList.push(enemy);
    } else {
      var coinFlip = Math.random();
      if (coinFlip > 0.5) {
        var enemyTypes = enemies[`tier3${faction}Enemies`];
        var enemyType = enemyTypes[getRandomInt(enemyTypes.length)];
        var generatedFirstName = generateName("either forename");
        var generatedLastName = generateName("surname");
        var generatedName = `${generatedFirstName} ${generatedLastName}`;
        var baseEnemy = new enemies[enemyType]("tempName", [0, 0]);
        coinFlip = Math.random();
        if (coinFlip > 0.5) {
          var weapon = generateWeapon(
            tier,
            generatedFirstName,
            generatedLastName
          );
        } else {
          var weapon = baseEnemy.items[0];
        }
        if (coinFlip > 0.5) {
          var armor = generateArmor(
            tier,
            generatedFirstName,
            generatedLastName
          );
          var armorValue = armor.armorValue;
        } else {
          if (baseEnemy.items.length > 1) {
            var armor = baseEnemy.items[1];
            var armorValue = armor.armorValue;
          } else {
            var armor = null;
            var armorValue = 0;
          }
        }
        if (baseEnemy.hasOwnProperty("range")) {
          var items = [weapon];
          if (armor != null) {
            items.push(armor);
          }
          var baseWeaponName = baseEnemy.items[0].name;
          var attackDescription = `${generatedName} fires their ${baseWeaponName} at you!`;
          var health = baseEnemy.health + 25 * tier;
          var enemy = {
            name: generatedName,
            position: generateEnemyPosition(enemyList),
            attackDescription: attackDescription,
            health: health,
            armor: armorValue,
            attack: weapon.attackValue,
            range: baseEnemy.range,
            speed: baseEnemy.speed + tier,
            gold: baseEnemy.gold + 10 * tier,
            xp: baseEnemy.xp + 10 * tier,
            items: items,
          };
        } else {
          var items = [weapon];
          if (armor != null) {
            items.push(armor);
          }
          var baseWeaponName = baseEnemy.items[0].name;
          var attackDescription = `${generatedName} charges at you with their ${baseWeaponName}!`;
          var health = baseEnemy.health + 25 * tier;
          var enemy = {
            name: generatedName,
            position: generateEnemyPosition(enemyList),
            attackDescription: attackDescription,
            health: health,
            armor: armorValue,
            attack: weapon.attackValue,
            speed: baseEnemy.speed + tier,
            gold: baseEnemy.gold + 10 * tier,
            xp: baseEnemy.xp + 10 * tier,
            items: items,
          };
        }
      } else {
        var enemyTypes = enemies[`tier3${faction}Enemies`];
        var enemyType = enemyTypes[getRandomInt(enemyTypes.length)];
        var enemyName = faction;
        var enemyPosition = generateEnemyPosition(enemyList);
        var enemy = new enemies[enemyType](enemyName, enemyPosition);
      }
      enemyList.push(enemy);
    }
  }
  if (enemyList.length > 1) {
    for (let i = 0; i < enemyList.length; i++) {
      enemyList[i].name = `${enemyList[i].name} ${i + 1}`;
    }
  }
  return [faction, enemyList];
}

function generateEnemyPosition(enemies) {
  var locations = playerData.locations;
  var locationName = getValue("location");
  var primaryLocation = locationName.split(".")[0];
  var secondaryLocation = locationName.split(".")[1];
  var location = locations[primaryLocation][secondaryLocation];
  var width = location.width;
  width = Math.floor(width);
  var horizontalTiles = width / 5;
  var height = location.height;
  height = Math.floor(height);
  var verticalTiles = height / 5;
  var x = getRandomInt(horizontalTiles) + 1;
  var y = getRandomInt(verticalTiles) + 1;
  var matchingPlayer = findPlayerInCell([x, y]);
  var matchingEnemy = findEnemiesInCell([x, y], enemies);
  while (matchingPlayer || matchingEnemy) {
    x = getRandomInt(horizontalTiles) + 1;
    y = getRandomInt(verticalTiles) + 1;
    matchingPlayer = findPlayerInCell([x, y]);
    matchingEnemy = findEnemiesInCell([x, y], enemies);
  }
  return [x, y];
}

async function handleEncounter(faction, tier) {
  if (faction == "Bandit") {
    var extortion = tier * getRandomInt(100) + 100;
    await printLines("app/src/class_collections/encounters/bandit/1.txt", {
      extortion: extortion,
    });
    var response = await closedInput([
      "1",
      "pay",
      "pay the bandits",
      "2",
      "refuse",
      "refuse to pay",
      "fight",
      "fight the bandits",
    ]);
    if (response == "1" || response == "pay" || response == "pay the bandits") {
      var gold = getValue("gold");
      if (gold < extortion) {
        await printLines("app/src/class_collections/encounters/bandit/2.txt");
        await requireAnswer(["any"], "unreachable");
        handleCombat();
      } else {
        await printLines("app/src/class_collections/encounters/bandit/3.txt", {
          extortion: extortion,
        });
        calculateValue("gold", "subtract", extortion);
        var location = getValue("location");
        var primaryLocation = location.split(".")[0];
        var secondaryLocation = location.split(".")[1];
        var locations = playerData.locations;
        var location = locations[primaryLocation][secondaryLocation];
        location.enemies = [];
      }
    }
  } else if (faction == "Rebel") {
    var rebelName = generateName("either fullName");
    var cellName = generateName("town") + " Militia";
    var extortion = tier * getRandomInt(50) + 50;
    await printLines("app/src/class_collections/encounters/rebel/1.txt", {
      rebelName: rebelName,
      cellName: cellName,
    });
    var response = await closedInput(
      [
        "1",
        "comply",
        "comply with their demands",
        "comply with the rebels",
        "2",
        "refuse",
        "refuse to comply",
        "fight",
        "fight the rebels",
      ],
      "How do you respond?"
    );
    if (
      response == "1" ||
      response == "comply" ||
      response == "comply with their demands" ||
      response == "comply with the rebels"
    ) {
      var inventory = playerData.inventory;
      var hasRing = false;
      for (let i = 0; i < inventory.length; i++) {
        if (inventory[i].name == "Imperial Signet Ring") {
          hasRing = true;
        }
      }
      if (hasRing == true) {
        var rebelName2 = generateName("either forename");
        await printLines("app/src/class_collections/encounters/rebel/2.txt", {
          rebelName2: rebelName2,
          rebelName: rebelName,
          cellName: cellName,
        });
        await requireAnswer(["any"], "unreachable");
        handleCombat();
      } else {
        var rebelName2 = generateName("either forename");
        await printLines("app/src/class_collections/encounters/rebel/3.txt", {
          extortion: extortion,
          rebelName2: rebelName2,
        });
        response = await closedInput(
          [
            "1",
            "pay",
            "pay the rebels",
            "2",
            "refuse",
            "refuse to pay",
            "fight",
            "fight the rebels",
          ],
          "How do you respond?"
        );
        if (
          response == "1" ||
          response == "pay" ||
          response == "pay the rebels"
        ) {
          var gold = getValue("gold");
          if (gold < extortion) {
            await printLines(
              "app/src/class_collections/encounters/rebel/4.txt"
            );
            await requireAnswer(["any"], "unreachable");
            handleCombat();
          } else {
            await printLines(
              "app/src/class_collections/encounters/rebel/5.txt",
              {
                rebelName: rebelName,
                extortion: extortion,
              }
            );
            calculateValue("gold", "subtract", extortion);
            var location = getValue("location");
            var primaryLocation = location.split(".")[0];
            var secondaryLocation = location.split(".")[1];
            var locations = playerData.locations;
            var location = locations[primaryLocation][secondaryLocation];
            location.enemies = [];
          }
        } else {
          await printLines("app/src/class_collections/encounters/rebel/6.txt", {
            rebelName: rebelName,
            extortion: extortion,
          });
          await requireAnswer(["any"], "unreachable");
          handleCombat();
        }
      }
    } else {
      await printLines("app/src/class_collections/encounters/rebel/7.txt");
      await requireAnswer(["any"], "unreachable");
      handleCombat();
    }
  } else if (faction == "Loyalist") {
  }
}

module.exports = { generateName, generateShop, generateRandomEncounter };
