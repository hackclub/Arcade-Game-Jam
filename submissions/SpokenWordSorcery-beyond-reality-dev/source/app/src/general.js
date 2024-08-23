module.exports = {
  switchScreen,
  switchButton,
  switchMapButton,
  printLines,
  quickPrint,
  requireAnswer,
  toTitleCase,
  diceRoll,
  addDice,
  getRandomInt,
};

const { allowInput, blockInput, closedInput } = require("./handle_input");
const { getValue } = require("./save_data");
const items = require("./class_collections/item_catalog");
const { NameGenerator } = require("../lib/markov_namegen/name_generator");

function switchScreen(screen) {
  document.getElementById("main").style.display = "none";
  document.getElementById("spellbook-screen").style.display = "none";
  document.getElementById("equipment-screen").style.display = "none";
  document.getElementById("inventory-screen").style.display = "none";
  document.getElementById("settings-screen").style.display = "none";
  document.getElementById("map-screen").style.display = "none";
  document.getElementById(screen).style.display = "block";
}

function switchButton(button) {
  document.getElementById("spellbook-button").style.backgroundColor = "#ffffff";
  document.getElementById("spellbook-button").style.cursor = "pointer";
  document.getElementById("equipment-button").style.backgroundColor = "#ffffff";
  document.getElementById("equipment-button").style.cursor = "pointer";
  document.getElementById("inventory-button").style.backgroundColor = "#ffffff";
  document.getElementById("inventory-button").style.cursor = "pointer";
  document.getElementById("settings-button").style.backgroundColor = "#ffffff";
  document.getElementById("settings-button").style.cursor = "pointer";
  document.getElementById("map-button").style.backgroundColor = "#ffffff";
  document.getElementById("map-button").style.cursor = "pointer";
  document.getElementById("home-button").style.backgroundColor = "#ffffff";
  document.getElementById("home-button").style.cursor = "pointer";
  document.getElementById(button).style.backgroundColor = "#d1d1d1";
  document.getElementById(button).style.cursor = "default";
}

function switchMapButton(button) {
  document.getElementById("local-map-button").style.backgroundColor = "#ffffff";
  document.getElementById("local-map-button").style.cursor = "pointer";
  document.getElementById("world-map-button").style.backgroundColor = "#ffffff";
  document.getElementById("world-map-button").style.cursor = "pointer";
  document.getElementById("map-key-button").style.backgroundColor = "#ffffff";
  document.getElementById("map-key-button").style.cursor = "pointer";
  document.getElementById(button).style.backgroundColor = "#d1d1d1";
  document.getElementById(button).style.cursor = "default";
}

async function printLines(file, injectedVariables = {}) {
  blockInput();
  var fs = require("fs");
  fs.readFile(file, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    var lines = data.split("\n");
    for (let i = 0; i < lines.length; i++) {
      for (const key in injectedVariables) {
        lines[i] = lines[i].replace(
          new RegExp(`{"${key}"}`, "g"),
          injectedVariables[key]
        );
      }
    }
    for (let i = 0; i < lines.length; i++) {
      setTimeout(() => {
        document.getElementById("main-content").innerHTML +=
          "<p>" + lines[i] + "</p>";
        document.getElementById("main-content").scrollTop =
          document.getElementById("main-content").scrollHeight;
        if (i == lines.length - 1) {
          allowInput();
        }
      }, i * getValue("gameSpeed"));
    }
  });
}

function quickPrint(text) {
  document.getElementById("main-content").innerHTML += "<p>" + text + "</p>";
  document.getElementById("main-content").scrollTop =
    document.getElementById("main-content").scrollHeight;
}

async function requireAnswer(answerChoices, question) {
  var confirm = await closedInput();
  confirm = confirm.toLowerCase();
  confirm = confirm.replace(/[^\w\s\']|_/g, "").replace(/\s+/g, " ");
  while (!answerChoices.includes(confirm) && !answerChoices.includes("any")) {
    quickPrint(question);
    confirm = await closedInput();
    confirm = confirm.toLowerCase();
    confirm = confirm.replace(/[^\w\s\']|_/g, "").replace(/\s+/g, " ");
  }
  confirm = false;
}

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

function diceRoll(dice) {
  var rolls = [];
  var total = 0;
  if (dice == 0) {
    return [rolls, total];
  }
  var dice = dice.split("d");
  for (let i = 0; i < dice[0]; i++) {
    rolls.push(getRandomInt(dice[1]) + 1);
    total += rolls[i];
  }
  return [rolls, total];
}

function addDice(dice1, dice2) {
  if (dice1 == 0) {
    return dice2;
  } else if (dice2 == 0) {
    return dice1;
  }
  var dice1 = dice1.split("d");
  var dice2 = dice2.split("d");
  if (dice1[1] == dice2[1]) {
    return dice1[0] + dice2[0] + "d" + dice1[1];
  } else {
    return dice1[0] + "d" + dice1[1] + " + " + dice2[0] + "d" + dice2[1];
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
