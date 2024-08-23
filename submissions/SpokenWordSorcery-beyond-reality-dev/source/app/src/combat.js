const {
  getValue,
  changeValue,
  calculateValue,
  updateUI,
  levelScaling,
  playerData,
} = require("./save_data");
const { quickPrint, diceRoll, getRandomInt } = require("./general");
const { openInput } = require("./handle_input");
const {
  imperialAcademy,
  imperialMarket,
  imperialNexus,
  imperialPalace,
  imperialPort,
  unknownShore,
} = require("./class_collections/locations/index");

async function handleCombat() {
  changeValue("isCombat", true);
  var currentLocation = getValue("location");
  currentLocation = eval(getValue(currentLocation, true));
  var enemies = currentLocation.enemies;
  var enemiesDefeated = false;
  while (getValue("currentHealth") > 0 && enemiesDefeated == false) {
    var playerSpeed = getValue("speed");
    var turnPlayed = false;
    for (let i = 0; i < enemies.length; i++) {
      var enemy = eval(enemies[i]);
      var enemySpeed = enemy.speed;
      if (playerSpeed >= enemySpeed && turnPlayed == false) {
        var enemies = await handlePlayerTurn(enemies, enemies.length);
        turnPlayed = true;
        if (enemies.length > 0) {
          enemies = await handleEnemyTurn(enemy, enemies, i);
        }
      } else {
        enemies = await handleEnemyTurn(enemy, enemies, i);
      }
    }
    if (turnPlayed == false) {
      enemies = await handlePlayerTurn(enemy, enemies.length);
      turnPlayed = true;
    }
    if (enemies.length == 0) {
      enemiesDefeated = true;
    } else {
      for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].isObstacle == false) {
          enemiesDefeated = false;
          break;
        } else {
          enemiesDefeated = true;
        }
      }
    }
    var locations = playerData["locations"];
    var location = getValue("location");
    var primaryLocation = location.split(".")[0];
    var secondaryLocation = location.split(".")[1];
    locations[primaryLocation][secondaryLocation]["enemies"] = enemies;
  }
  playerHealth = getValue("currentHealth");
  if (playerHealth <= 0) {
    quickPrint("You have been defeated, loading last save.");
    var save = JSON.parse(localStorage.getItem("save"));
    localStorage.setItem("playerData", JSON.stringify(save));
    updateUI();
  }
  changeValue("tempHealth", 0);
  changeValue("tempMana", 0);
  changeValue("tempArmor", 0);
  changeValue("isCombat", false);
}

async function handlePlayerTurn(enemies, length) {
  changeValue("movementPoints", 4);
  quickPrint(`There are ${length} enemies remaining:`);
  for (let i = 0; i < length; i++) {
    var enemy = enemies[i];
    var enemyPosition = enemy.position;
    var playerPosition = getValue("position");
    var relationship = calculateRelationship(enemyPosition, playerPosition);
    var enemyDirection = relationship[0];
    var enemyDistance = relationship[1];
    if (enemy.isObstacle == false) {
      quickPrint(
        `${i + 1}. ${enemy.name}, a ${enemy.baseType}, has ${
          enemy.health
        } health and is standing ${enemyDistance} feet away to the ${enemyDirection}.`
      );
    }
  }
  quickPrint(
    `You are facing ${getValue(
      "direction"
    )}. What would you like to do? You may equip and unequip up to one time, change the direction you are facing one time, use each of your weapons once, and cast a spell once. When you are finished, type "finish." If you need help, type "help" for a list of commands.`
  );
  var turnEnded = false;
  while (turnEnded == false) {
    var choiceInput = await openInput();
    var choice = choiceInput[0];
    if (choiceInput[0] == "finish") {
      turnEnded = true;
      return enemies;
    } else if (choiceInput[1] == "0" && choiceInput[2] == "none") {
      continue;
    } else if (choiceInput[1] == "none") {
      continue;
    }
    if (choice == "weapon") {
      for (let i = 0; i < enemies.length; i++) {
        var matched = false;
        var matchingEnemies = [];
        enemy = enemies[i];
        enemy.hitLastTurn = false;
        var enemyPosition = enemy.position;
        enemyDirection = calculateRelationship(
          enemy.position,
          playerPosition
        )[0];
        enemyDistance = calculateRelationship(
          enemy.position,
          playerPosition
        )[1];
        if (enemyDirection == getValue("direction")) {
          matched = true;
          matchingEnemies.push((enemy, enemyDistance));
        }
        if (matched == true && i == enemies.length - 1) {
          var enemy = matchingEnemies[0];
          for (let i = 0; i < matchingEnemies.length; i++) {
            if (matchingEnemies[i][1] < enemy[1]) {
              enemy = matchingEnemies[i];
            }
          }
          break;
        } else if (matched == false && i == enemies.length - 1) {
          enemy = null;
        }
      }
      if (enemy != null) {
        var weaponType = choiceInput[1];
        var hand = choiceInput[2];
        var equipment = getValue("equipment");
        var weapon = equipment[hand];
        if (weaponType == "melee") {
          var playerAttack = weapon.attackValue;
          var playerRange = 7.5;
          if (enemyDistance <= playerRange) {
            distance = "inRange";
          } else if (enemyDistance < playerRange) {
            distance = "outOfRange";
          }
        } else if (weaponType == "ranged") {
          try {
            var ammoCheck = checkAmmo(weapon, enemies);
          } catch (error) {
            quickPrint("You do not have any ammunition for that weapon.");
            continue;
          }
          enemies = ammoCheck[0];
          if (ammoCheck[1] == false) {
            continue;
          }
          playerAttack = weapon.rangedAttackValue;
          var minRange = weapon.minRange;
          var effectiveRange = weapon.effectiveRange;
          var maxRange = weapon.maxRange;
          if (enemyDistance < minRange) {
            distance = "tooClose";
          } else if (enemyDistance > maxRange) {
            distance = "outOfRange";
          } else if (enemyDistance <= effectiveRange) {
            distance = "inRange";
          } else if (enemyDistance > effectiveRange) {
            distance = "barelyInRange";
          }
        }
        try {
          playerAttack = levelScaling(playerAttack);
        } catch (error) {
          quickPrint("You do not have a weapon equipped.");
          continue;
        }
        if (distance == "outOfRange") {
          quickPrint("The enemy is out of range.");
          continue;
        } else if (distance == "tooClose") {
          quickPrint("You are too close to the enemy, move back to attack.");
          continue;
        } else if (distance == "barelyInRange") {
          quickPrint(
            "The enemy is barely in range, the attack's power will be reduced."
          );
          var reducedRange = true;
        } else if (distance == "inRange") {
          quickPrint("The enemy is range.");
        }
        quickPrint(`You roll ${playerAttack}.`);
        var rolledDice = diceRoll(playerAttack);
        var rolls = rolledDice[0];
        for (let i = 0; i < rolls.length; i++) {
          quickPrint(`You rolled a ${rolls[i]}.`);
        }
        if (reducedRange == true) {
          playerAttack = Math.floor(rolledDice[1] / 2);
          quickPrint(`The attack's power is reduced to ${reducedPower}.`);
        } else {
          playerAttack = rolledDice[1];
        }
        var enemyDefense = getRandomInt(enemy.armor);
        var enemyDamage = Math.max(playerAttack - enemyDefense, 0);
        enemy.health = Math.max(enemy.health - enemyDamage, 0);
        if (enemyDefense > 0) {
          quickPrint(
            `${enemy.name} resisted your attack, reducing the damage by ${enemyDefense}.`
          );
        }
        quickPrint(`You dealt ${enemyDamage} damage to ${enemy.name}.`);
        enemy.hitLastTurn = true;
        var location = getValue("location");
        var primaryLocation = location.split(".")[0];
        var secondaryLocation = location.split(".")[1];
        var locations = playerData["locations"];
        locations[primaryLocation][secondaryLocation]["enemies"] = enemies;
        if (enemy.health <= 0) {
          quickPrint(`You have defeated ${enemy.name}.`);
          quickPrint(
            `You gained ${enemy.xp} experience points, and the enemy dropped ${enemy.gold} gold pieces.`
          );
          calculateValue("experiencePoints", "add", enemy.xp);
          calculateValue("gold", "add", enemy.gold);
          for (var i = 0; i < enemy.items.length; i++) {
            var item = enemy.items[i];
            var itemName = item.name;
            itemName = itemName.toLowerCase();
            if (itemName.charAt(0).match(/[aeiou]/i)) {
              quickPrint(`${enemy.name} dropped an ${itemName}.`);
            } else {
              quickPrint(`${enemy.name} dropped a ${itemName}.`);
            }
            locations[primaryLocation][secondaryLocation]["items"][itemName] =
              item;
          }
          var index = enemies.indexOf(enemy);
          enemies.splice(index, 1);
          locations[primaryLocation][secondaryLocation]["enemies"] = enemies;
          playerData["gold"] = getValue("gold");
          playerData["experiencePoints"] = getValue("experiencePoints");
        }
      } else {
        quickPrint("There is no enemy in that direction.");
      }
    } else if (choice == "spell") {
      var spellPower = choiceInput[1];
      var spellEffect = choiceInput[3];
      var spellRange = choiceInput[4];
      spellPower = levelScaling(spellPower);
      quickPrint(`You roll ${spellPower}.`);
      var rolledDice = diceRoll(spellPower);
      var rolls = rolledDice[0];
      for (let i = 0; i < rolls.length; i++) {
        quickPrint(`You rolled a ${rolls[i]}.`);
      }
      spellPower = rolledDice[1];
      var spellDirection = choiceInput[2];
      for (let i = 0; i < enemies.length; i++) {
        var matched = false;
        var matchingEnemies = [];
        enemy = enemies[i];
        enemy.hitLastTurn = false;
        var enemyPosition = enemy.position;
        enemyDirection = calculateRelationship(
          enemy.position,
          playerPosition
        )[0];
        enemyDistance = calculateRelationship(
          enemy.position,
          playerPosition
        )[1];
        if (enemyDirection == spellDirection) {
          matched = true;
          matchingEnemies.push((enemy, enemyDistance));
        }
        if (matched == true && i == enemies.length) {
          var enemy = matchingEnemies[0];
          for (let i = 0; i < matchingEnemies.length; i++) {
            if (matchingEnemies[i][1] < enemy[1]) {
              enemy = matchingEnemies[i];
            }
          }
          break;
        } else if (matched == false && i == enemies.length) {
          enemy = null;
        }
      }
      if (enemy != null) {
        if (enemyDistance <= spellRange) {
          distance = "inRange";
          quickPrint("The enemy is in range.");
        } else if (enemyDistance > spellRange) {
          distance = "outOfRange";
          quickPrint("The enemy is out of range.");
          continue;
        }
        if (spellEffect == "damage") {
          playerRange = spellRange;
          enemyDefense = getRandomInt(enemy.armor);
          enemyDamage = Math.max(spellPower - enemyDefense, 0);
          enemy.health = Math.max(enemy.health - enemyDamage, 0);
          if (enemyDefense > 0) {
            quickPrint(
              `${enemy.name} resisted your attack, reducing the damage by ${enemyDefense}.`
            );
          }
          quickPrint(`You dealt ${enemyDamage} damage to ${enemy.name}.`);
          enemy.hitLastTurn = true;
          var location = getValue("location");
          var primaryLocation = location.split(".")[0];
          var secondaryLocation = location.split(".")[1];
          var locations = playerData["locations"];
          locations[primaryLocation][secondaryLocation]["enemies"] = enemies;
          if (enemy.health <= 0) {
            quickPrint(`You have defeated ${enemy.name}.`);
            quickPrint(
              `You gained ${enemy.xp} experience points, and the enemy dropped ${enemy.gold} gold pieces.`
            );
            calculateValue("experiencePoints", "add", enemy.xp);
            calculateValue("gold", "add", enemy.gold);
            for (var i = 0; i < enemy.items.length; i++) {
              var item = enemy.items[i];
              var itemName = item.name;
              var itemName = itemName.toLowerCase();
              if (itemName.charAt(0).match(/[aeiou]/i)) {
                quickPrint(`${enemy.name} dropped an ${itemName}.`);
              } else {
                quickPrint(`${enemy.name} dropped a ${itemName}.`);
              }
              locations[primaryLocation][secondaryLocation]["items"][itemName] =
                item;
            }
            var index = enemies.indexOf(enemy);
            enemies.splice(index, 1);
            playerData["gold"] = getValue("gold");
            playerData["experiencePoints"] = getValue("experiencePoints");
            locations[primaryLocation][secondaryLocation]["enemies"] = enemies;
          }
        }
      } else if (spellEffect == "healthIncrease") {
        if (spellDirection != "Within") {
          quickPrint("You cannot heal an enemy.");
          continue;
        }
        var healthIncrease = spellPower;
        if (
          getValue("currentHealth") + healthIncrease >
          getValue("maxHealth")
        ) {
          healthIncrease = getValue("maxHealth") - getValue("currentHealth");
        }
        calculateValue("currentHealth", "add", healthIncrease);
        quickPrint(`You healed yourself for ${healthIncrease} health.`);
      } else if (spellEffect == "tempHealth") {
        if (spellDirection != "Within") {
          quickPrint("You cannot grant temporary health to an enemy.");
          continue;
        }
        changeValue("tempHealth", spellPower);
        quickPrint(`You gained ${spellPower} temporary health.`);
      } else if (spellEffect == "manaIncrease") {
        if (spellDirection != "Within") {
          quickPrint("You cannot grant mana to an enemy.");
          continue;
        }
        var manaIncrease = spellPower;
        if (getValue("currentMana") + manaIncrease > getValue("maxMana")) {
          manaIncrease = getValue("maxMana") - getValue("currentMana");
        }
        calculateValue("currentMana", "add", manaIncrease);
        quickPrint(`You gained ${manaIncrease} mana.`);
      } else if (spellEffect == "tempMana") {
        if (spellDirection != "Within") {
          quickPrint("You cannot grant temporary mana to an enemy.");
          continue;
        }
        changeValue("tempMana", spellPower);
        quickPrint(`You gained ${spellPower} temporary mana.`);
      } else if (spellEffect == "tempArmor") {
        if (spellDirection != "Within") {
          quickPrint("You cannot grant temporary armor to an enemy.");
          continue;
        }
        changeValue("tempArmor", spellPower);
        quickPrint(`You gained ${spellPower} temporary armor.`);
      } else {
        quickPrint("There is no enemy in that direction.");
      }
    }
    continue;
  }
  return enemies;
}

function calculateRelationship(enemyPosition, playerPosition) {
  var enemyX = enemyPosition[0];
  var enemyY = enemyPosition[1];
  var playerX = playerPosition[0];
  var playerY = playerPosition[1];
  var xDistance = Math.abs(enemyX - playerX);
  xDistance = xDistance * 5;
  var yDistance = Math.abs(enemyY - playerY);
  yDistance = yDistance * 5;
  var totalDistance = Math.sqrt(xDistance ** 2 + yDistance ** 2);
  totalDistance = Math.floor(totalDistance);
  if (enemyX == playerX && enemyY == playerY) {
    return ["within", totalDistance];
  } else if (enemyX == playerX && enemyY < playerY) {
    return ["north", totalDistance];
  } else if (enemyX > playerX && enemyY < playerY) {
    return ["northeast", totalDistance];
  } else if (enemyX > playerX && enemyY == playerY) {
    return ["east", totalDistance];
  } else if (enemyX > playerX && enemyY > playerY) {
    return ["southeast", totalDistance];
  } else if (enemyX == playerX && enemyY > playerY) {
    return ["south", totalDistance];
  } else if (enemyX < playerX && enemyY > playerY) {
    return ["southwest", totalDistance];
  } else if (enemyX < playerX && enemyY == playerY) {
    return ["west", totalDistance];
  } else if (enemyX < playerX && enemyY < playerY) {
    return ["northwest", totalDistance];
  }
}

function checkAmmo(position, enemies) {
  var used = false;
  var inventory = getValue("inventory");
  for (let i = 0; i < inventory.length; i++) {
    if (inventory[i].name == position.ammunition) {
      var current = inventory[i].quantity;
      current = current - 1;
      changeValue("itemQuantity", current, i);
      playerData["inventory"] = inventory;
      used = true;
      updateUI();
      return [enemies, used];
    }
  }
  if (used == false) {
    if (position.ammunition.charAt(0).match(/[aeiou]/i)) {
      var ammo = position.ammunition.toLowerCase();
      var weapon = position.name.toLowerCase();
      quickPrint(
        `You do not have an ${ammo} and therefore cannot attack with your ${weapon}.`
      );
    } else {
      quickPrint(
        `You do not have a ${ammo} and therefore cannot attack with your ${weapon}.`
      );
    }
    return [enemies, used];
  }
}

async function handleEnemyTurn(enemy, enemies, i) {
  var playerPosition = getValue("position");
  var enemyPosition = enemy.position;
  var enemyX = enemyPosition[0];
  var enemyY = enemyPosition[1];
  var relationship = calculateRelationship(enemyPosition, playerPosition);
  var playerDistance = relationship[1];
  var enemyRange = enemy.range;
  if (playerDistance <= enemyRange) {
    quickPrint(enemy.attackDescription);
    var playerDefense = getRandomInt(getValue("armor"));
    var enemyAttack = diceRoll(enemy.attack);
    var rolls = enemyAttack[0];
    for (let roll of rolls) {
      quickPrint(`${enemy.name} rolled a ${roll}.`);
    }
    if (playerDefense > 0) {
      quickPrint(
        `You resisted ${enemy.name}'s attack, reducing the damage by ${playerDefense}.`
      );
    }
    let playerDamage = Math.max(enemyAttack[1] - playerDefense, 0);
    let tempHealth = getValue("tempHealth");
    if (tempHealth > 0) {
      var difference = playerDamage - tempHealth;
      if (difference > 0) {
        playerDamage = difference;
        tempHealth = 0;
      } else {
        tempHealth -= playerDamage;
        playerDamage = 0;
      }
      changeValue("tempHealth", tempHealth);
    }
    calculateValue("currentHealth", "subtract", playerDamage);
    quickPrint(`${enemy.name} dealt ${playerDamage} damage.`);
    return enemies;
  } else {
    enemies = moveEnemyTowardsPlayer(
      enemies,
      enemyX,
      enemyY,
      playerDistance,
      enemyRange,
      i
    );
    return enemies;
  }
}

function moveEnemyTowardsPlayer(
  enemies,
  enemyX,
  enemyY,
  playerDistance,
  enemyRange,
  index
) {
  var playerPosition = getValue("position");
  var playerX = playerPosition[0];
  var playerY = playerPosition[1];
  var startingX = enemyX;
  var startingY = enemyY;
  var budget = 4;
  var hasMoved = true;
  while (playerDistance > enemyRange && budget > 0 && hasMoved == true) {
    var originalX = enemyX;
    var originalY = enemyY;
    if (enemyX < playerX) {
      enemyX += 1;
      budget -= 1;
    } else if (enemyX > playerX) {
      enemyX -= 1;
      budget -= 1;
    }
    if (enemyY < playerY) {
      enemyY += 1;
      budget -= 1;
    } else if (enemyY > playerY) {
      enemyY -= 1;
      budget -= 1;
    }
    if (findEnemiesInCell([enemyX, enemyY], enemies)) {
      enemyX = originalX;
      enemyY = originalY;
      break;
    } else if (findPlayerInCell([enemyX, enemyY])) {
      enemyX = originalX;
      enemyY = originalY;
      break;
    } else if (checkBounds([enemyX, enemyY]) == false) {
      enemyX = originalX;
      enemyY = originalY;
      break;
    }
    enemies[index].position = [enemyX, enemyY];
    var relationship = calculateRelationship([enemyX, enemyY], playerPosition);
    var playerDistance = relationship[1];
  }
  relationship = calculateRelationship([enemyX, enemyY], playerPosition);
  var playerDirection = relationship[0];
  playerDistance = relationship[1];
  if (enemyX == startingX && enemyY < startingY) {
    var distanceTraveled = Math.abs(enemyY - startingY);
    var direction = "north";
  } else if (enemyX > startingX && enemyY < startingY) {
    var distanceX = Math.abs(enemyX - startingX);
    var distanceY = Math.abs(enemyY - startingY);
    distanceTraveled = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    direction = "northeast";
  } else if (enemyX > startingX && enemyY == startingY) {
    distanceTraveled = Math.abs(enemyX - startingX);
    direction = "east";
  } else if (enemyX > startingX && enemyY > startingY) {
    distanceX = Math.abs(enemyX - startingX);
    distanceY = Math.abs(enemyY - startingY);
    distanceTraveled = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    direction = "southeast";
  } else if (enemyX == startingX && enemyY > startingY) {
    distanceTraveled = Math.abs(enemyY - startingY);
    direction = "south";
  } else if (enemyX < startingX && enemyY > startingY) {
    distanceX = Math.abs(enemyX - startingX);
    distanceY = Math.abs(enemyY - startingY);
    distanceTraveled = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    direction = "southwest";
  } else if (enemyX < startingX && enemyY == startingY) {
    distanceTraveled = Math.abs(enemyX - startingX);
    direction = "west";
  } else if (enemyX < startingX && enemyY < startingY) {
    distanceX = Math.abs(enemyX - startingX);
    distanceY = Math.abs(enemyY - startingY);
    distanceTraveled = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    direction = "northwest";
  } else {
    var distanceTraveled = 0;
    var direction = "none";
  }
  distanceTraveled = distanceTraveled * 5;
  distanceTraveled = Math.floor(distanceTraveled);
  if (distanceTraveled != 0 && direction != "none") {
    quickPrint(
      `${enemies[index].name} moved ${distanceTraveled} feet to the ${direction}, and is now ${playerDistance} feet away to the 
      ${playerDirection}.`
    );
  }
  return enemies;
}

function handleCombatMovement(direction, magnitude) {
  var playerPosition = getValue("position");
  var playerDirection = getValue("direction");
  var combinedDirection = findDirection(playerDirection, direction);
  var playerX = playerPosition[0];
  var playerY = playerPosition[1];
  var location = getValue("location");
  location = getValue(location, true);
  var locationWidth = location.width;
  locationWidth = Math.floor(locationWidth);
  horizontalTiles = locationWidth / 5;
  var locationHeight = location.height;
  locationHeight = Math.floor(locationHeight);
  verticalTiles = locationHeight / 5;
  var newPosition = [];
  var budget = getValue("movementPoints");
  var magnitude = magnitude / 5;
  switch (combinedDirection) {
    case "north":
      budget = budget - magnitude;
      if (budget < 0) {
        quickPrint("You cannot move more than 20 feet in one turn.");
        return;
      } else if (playerY - magnitude < 0) {
        quickPrint("You cannot move out of bounds.");
        return;
      } else {
        newPosition = [playerX, playerY - magnitude];
        if (findEnemiesInCell(newPosition) == true) {
          quickPrint("You cannot move into a cell with an enemy.");
          return;
        } else {
          changeValue("position", newPosition);
          changeValue("movementPoints", budget);
          magnitude = magnitude * 5;
          quickPrint(`You moved ${magnitude} ft. north.`);
        }
      }
      break;
    case "northeast":
      budget = budget - magnitude;
      if (budget < 0) {
        quickPrint("You cannot move more than 20 feet in one turn.");
        return;
      } else if (
        playerY - magnitude < 0 ||
        playerX + magnitude > horizontalTiles
      ) {
        quickPrint("You cannot move out of bounds.");
        return;
      } else {
        newPosition = [playerX + magnitude, playerY - magnitude];
        if (findEnemiesInCell(newPosition) == true) {
          quickPrint("You cannot move into a cell with an enemy.");
          return;
        } else {
          changeValue("position", newPosition);
          changeValue("movementPoints", budget);
          magnitude = magnitude * 5;
          quickPrint(`You moved ${magnitude} ft. northeast.`);
        }
      }
      break;
    case "east":
      budget = budget - magnitude;
      if (budget < 0) {
        quickPrint("You cannot move more than 20 feet in one turn.");
        return;
      } else if (playerX + magnitude > horizontalTiles) {
        quickPrint("You cannot move out of bounds.");
        return;
      } else {
        newPosition = [playerX + magnitude, playerY];
        if (findEnemiesInCell(newPosition) == true) {
          quickPrint("You cannot move into a cell with an enemy.");
          return;
        } else {
          changeValue("position", newPosition);
          changeValue("movementPoints", budget);
          magnitude = magnitude * 5;
          quickPrint(`You moved ${magnitude} ft. east.`);
        }
      }
      break;
    case "southeast":
      budget = budget - magnitude;
      if (budget < 0) {
        quickPrint("You cannot move more than 20 feet in one turn.");
        return;
      } else if (
        playerY + magnitude > verticalTiles ||
        playerX + magnitude > horizontalTiles
      ) {
        quickPrint("You cannot move out of bounds.");
        return;
      } else {
        newPosition = [playerX + magnitude, playerY + magnitude];
        if (findEnemiesInCell(newPosition) == true) {
          quickPrint("You cannot move into a cell with an enemy.");
          return;
        } else {
          changeValue("position", newPosition);
          changeValue("movementPoints", budget);
          magnitude = magnitude * 5;
          quickPrint(`You moved ${magnitude} ft. southeast.`);
        }
      }
      break;
    case "south":
      budget = budget - magnitude;
      if (budget < 0) {
        quickPrint("You cannot move more than 20 feet in one turn.");
        return;
      } else if (playerY + magnitude > verticalTiles) {
        quickPrint("You cannot move out of bounds.");
        return;
      } else {
        newPosition = [playerX, playerY + magnitude];
        if (findEnemiesInCell(newPosition) == true) {
          quickPrint("You cannot move into a cell with an enemy.");
          return;
        } else {
          changeValue("position", newPosition);
          changeValue("movementPoints", budget);
          magnitude = magnitude * 5;
          quickPrint(`You moved ${magnitude} ft. south.`);
        }
      }
      break;
    case "southwest":
      budget = budget - magnitude;
      if (budget < 0) {
        quickPrint("You cannot move more than 20 feet in one turn.");
        return;
      } else if (
        playerY + magnitude > verticalTiles ||
        playerX - magnitude < 0
      ) {
        quickPrint("You cannot move out of bounds.");
        return;
      } else {
        newPosition = [playerX - magnitude, playerY + magnitude];
        if (findEnemiesInCell(newPosition) == true) {
          quickPrint("You cannot move into a cell with an enemy.");
          return;
        } else {
          changeValue("position", newPosition);
          changeValue("movementPoints", budget);
          magnitude = magnitude * 5;
          quickPrint(`You moved ${magnitude} ft. southwest.`);
        }
      }
      break;
    case "west":
      budget = budget - magnitude;
      if (budget < 0) {
        quickPrint("You cannot move more than 20 feet in one turn.");
        return;
      } else if (playerX - magnitude < 0) {
        quickPrint("You cannot move out of bounds.");
        return;
      } else {
        newPosition = [playerX - magnitude, playerY];
        if (findEnemiesInCell(newPosition) == true) {
          quickPrint("You cannot move into a cell with an enemy.");
          return;
        } else {
          changeValue("position", newPosition);
          changeValue("movementPoints", budget);
          magnitude = magnitude * 5;
          quickPrint(`You moved ${magnitude} ft. west.`);
        }
      }
      break;
    case "northwest":
      budget = budget - magnitude;
      if (budget < 0) {
        quickPrint("You cannot move more than 20 feet in one turn.");
        return;
      } else if (playerY - magnitude < 0 || playerX - magnitude < 0) {
        quickPrint("You cannot move out of bounds.");
        return;
      } else {
        newPosition = [playerX - magnitude, playerY - magnitude];
        if (findEnemiesInCell(newPosition) == true) {
          quickPrint("You cannot move into a cell with an enemy.");
          return;
        } else {
          changeValue("position", newPosition);
          changeValue("movementPoints", budget);
          magnitude = magnitude * 5;
          quickPrint(`You moved ${magnitude} ft. northwest.`);
        }
      }
      break;
    default:
      quickPrint("You cannot move in that direction.");
      break;
  }
}

function findDirection(playerDirection, direction) {
  switch (playerDirection) {
    case "north":
      if (direction == "forward" || direction == "forwards") {
        return "north";
      } else if (
        direction == "back" ||
        direction == "backward" ||
        direction == "backwards"
      ) {
        return "south";
      } else if (direction == "left") {
        return "west";
      } else if (direction == "right") {
        return "east";
      } else if (direction == "left forward" || direction == "left forwards") {
        return "northwest";
      } else if (
        direction == "right forward" ||
        direction == "right forwards"
      ) {
        return "northeast";
      } else if (
        direction == "left back" ||
        direction == "left backward" ||
        direction == "left backwards"
      ) {
        return "southwest";
      } else if (
        direction == "right back" ||
        direction == "right backward" ||
        direction == "right backwards"
      ) {
        return "southeast";
      }
      break;
    case "northeast":
      if (direction == "forward" || direction == "forwards") {
        return "northeast";
      } else if (
        direction == "back" ||
        direction == "backward" ||
        direction == "backwards"
      ) {
        return "southwest";
      } else if (direction == "left") {
        return "north";
      } else if (direction == "right") {
        return "east";
      } else if (direction == "left forward" || direction == "left forwards") {
        return "north";
      } else if (
        direction == "right forward" ||
        direction == "right forwards"
      ) {
        return "northeast";
      } else if (
        direction == "left back" ||
        direction == "left backward" ||
        direction == "left backwards"
      ) {
        return "southwest";
      } else if (
        direction == "right back" ||
        direction == "right backward" ||
        direction == "right backwards"
      ) {
        return "south";
      }
      break;
    case "east":
      if (direction == "forward" || direction == "forwards") {
        return "east";
      } else if (
        direction == "back" ||
        direction == "backward" ||
        direction == "backwards"
      ) {
        return "west";
      } else if (direction == "left") {
        return "north";
      } else if (direction == "right") {
        return "south";
      } else if (direction == "left forward" || direction == "left forwards") {
        return "northeast";
      } else if (
        direction == "right forward" ||
        direction == "right forwards"
      ) {
        return "southeast";
      } else if (
        direction == "left back" ||
        direction == "left backward" ||
        direction == "left backwards"
      ) {
        return "northwest";
      } else if (
        direction == "right back" ||
        direction == "right backward" ||
        direction == "right backwards"
      ) {
        return "southwest";
      }
      break;
    case "southeast":
      if (direction == "forward" || direction == "forwards") {
        return "southeast";
      } else if (
        direction == "back" ||
        direction == "backward" ||
        direction == "backwards"
      ) {
        return "northwest";
      } else if (direction == "left") {
        return "south";
      } else if (direction == "right") {
        return "east";
      } else if (direction == "left forward" || direction == "left forwards") {
        return "south";
      } else if (
        direction == "right forward" ||
        direction == "right forwards"
      ) {
        return "southeast";
      } else if (
        direction == "left back" ||
        direction == "left backward" ||
        direction == "left backwards"
      ) {
        return "northwest";
      } else if (
        direction == "right back" ||
        direction == "right backward" ||
        direction == "right backwards"
      ) {
        return "north";
      }
      break;
    case "south":
      if (direction == "forward" || direction == "forwards") {
        return "south";
      } else if (
        direction == "back" ||
        direction == "backward" ||
        direction == "backwards"
      ) {
        return "north";
      } else if (direction == "left") {
        return "east";
      } else if (direction == "right") {
        return "west";
      } else if (direction == "left forward" || direction == "left forwards") {
        return "southeast";
      } else if (
        direction == "right forward" ||
        direction == "right forwards"
      ) {
        return "southwest";
      } else if (
        direction == "left back" ||
        direction == "left backward" ||
        direction == "left backwards"
      ) {
        return "northeast";
      } else if (
        direction == "right back" ||
        direction == "right backward" ||
        direction == "right backwards"
      ) {
        return "northwest";
      }
      break;
    case "southwest":
      if (direction == "forward" || direction == "forwards") {
        return "southwest";
      } else if (
        direction == "back" ||
        direction == "backward" ||
        direction == "backwards"
      ) {
        return "northeast";
      } else if (direction == "left") {
        return "south";
      } else if (direction == "right") {
        return "west";
      } else if (direction == "left forward" || direction == "left forwards") {
        return "south";
      } else if (
        direction == "right forward" ||
        direction == "right forwards"
      ) {
        return "southwest";
      } else if (
        direction == "left back" ||
        direction == "left backward" ||
        direction == "left backwards"
      ) {
        return "northeast";
      } else if (
        direction == "right back" ||
        direction == "right backward" ||
        direction == "right backwards"
      ) {
        return "north";
      }
      break;
    case "west":
      if (direction == "forward" || direction == "forwards") {
        return "west";
      } else if (
        direction == "back" ||
        direction == "backward" ||
        direction == "backwards"
      ) {
        return "east";
      } else if (direction == "left") {
        return "south";
      } else if (direction == "right") {
        return "north";
      } else if (direction == "left forward" || direction == "left forwards") {
        return "southwest";
      } else if (
        direction == "right forward" ||
        direction == "right forwards"
      ) {
        return "northwest";
      } else if (
        direction == "left back" ||
        direction == "left backward" ||
        direction == "left backwards"
      ) {
        return "southeast";
      } else if (
        direction == "right back" ||
        direction == "right backward" ||
        direction == "right backwards"
      ) {
        return "northeast";
      }
      break;
    case "northwest":
      if (direction == "forward" || direction == "forwards") {
        return "northwest";
      } else if (
        direction == "back" ||
        direction == "backward" ||
        direction == "backwards"
      ) {
        return "southeast";
      } else if (direction == "left") {
        return "north";
      } else if (direction == "right") {
        return "west";
      } else if (direction == "left forward" || direction == "left forwards") {
        return "north";
      } else if (
        direction == "right forward" ||
        direction == "right forwards"
      ) {
        return "northwest";
      } else if (
        direction == "left back" ||
        direction == "left backward" ||
        direction == "left backwards"
      ) {
        return "southeast";
      } else if (
        direction == "right back" ||
        direction == "right backward" ||
        direction == "right backwards"
      ) {
        return "south";
      }
      break;
    default:
      break;
  }
}

function findEnemiesInCell(targetCell, enemies = null) {
  var location = getValue("location");
  location = getValue(location, true);
  var enemyX = targetCell[0];
  var enemyY = targetCell[1];
  if (enemies == null) {
    enemies = location.enemies;
  } else {
    enemies = enemies;
  }
  var enemiesInCell = false;
  for (let i = 0; i < enemies.length; i++) {
    var enemy = enemies[i];
    var enemyPosition = enemy.position;
    var otherX = enemyPosition[0];
    var otherY = enemyPosition[1];
    if (enemyX == otherX && enemyY == otherY) {
      enemiesInCell = true;
      break;
    }
  }
  return enemiesInCell;
}

function findPlayerInCell(targetCell) {
  var playerInCell = false;
  var position = getValue("position");
  var playerX = position[0];
  var playerY = position[1];
  var enemyX = targetCell[0];
  var enemyY = targetCell[1];
  if (playerX == enemyX && playerY == enemyY) {
    playerInCell = true;
  }
  return playerInCell;
}

function checkBounds(targetCell) {
  var location = getValue("location");
  location = getValue(location, true);
  var locationWidth = location.width;
  locationWidth = Math.floor(locationWidth);
  horizontalTiles = locationWidth / 5;
  var locationHeight = location.height;
  locationHeight = Math.floor(locationHeight);
  verticalTiles = locationHeight / 5;
  var enemyX = targetCell[0];
  var enemyY = targetCell[1];
  if (enemyX < 1 || enemyX > horizontalTiles) {
    return false;
  } else if (enemyY < 1 || enemyY > verticalTiles) {
    return false;
  } else {
    return true;
  }
}

module.exports = {
  handleCombat,
  handleCombatMovement,
  findEnemiesInCell,
  findPlayerInCell,
};
