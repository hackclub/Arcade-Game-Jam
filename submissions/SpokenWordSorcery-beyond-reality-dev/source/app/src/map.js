const { getValue } = require("./save_data");

function updateMap() {
  var location = getValue("location");
  var primaryLocation = location.split(".")[0];
  var secondaryLocation = location.split(".")[1];
  var locations = getValue("locations");
  var currentLocation = locations[primaryLocation][secondaryLocation];
  var locationName = currentLocation["name"];
  var exits = currentLocation["exits"];
  const canvas = document.getElementById("map");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var startingWidth = currentLocation["width"] * 10;
  var startingHeight = currentLocation["height"] * 10;
  var startingX = canvas.width / 2 - startingWidth / 2;
  var startingY = canvas.height / 2 - startingHeight / 2;
  ctx.lineWidth = 2;
  ctx.font = "bold 20px Segoe UI";
  ctx.textAlign = "center";
  ctx.clearRect(startingX, startingY, startingWidth, startingHeight);
  ctx.fillStyle = "white";
  ctx.fillRect(startingX, startingY, startingWidth, startingHeight);
  ctx.fillStyle = "black";
  ctx.strokeRect(startingX, startingY, startingWidth, startingHeight);
  ctx.strokeRect(
    startingX - 1,
    startingY - 1,
    startingWidth + 1.5,
    startingHeight + 1.5
  );
  if (getValue("isCombat") == true) {
    buildCombatMap(ctx, currentLocation, startingX, startingY);
    buildRooms(exits, startingWidth, startingHeight, startingX, startingY, 4);
  } else {
    if (locationName.split("/").length > 1) {
      locationName = locationName.split("/");
      ctx.fillText(
        locationName[0],
        startingX + startingWidth / 2 + 0.5,
        startingY + startingHeight / 2 - 10.5
      );
      ctx.fillText(
        locationName[1],
        startingX + startingWidth / 2 + 0.5,
        startingY + startingHeight / 2 + 10.5
      );
    } else {
      ctx.fillText(
        locationName,
        canvas.width / 2 + 0.5,
        canvas.height / 2 + 0.5
      );
    }
    buildRooms(exits, startingWidth, startingHeight, startingX, startingY);
  }
  drawCompass(ctx, canvas.width, canvas.height);
}

function buildCombatMap(ctx, currentLocation, startingX, startingY) {
  var enemies = currentLocation["enemies"];
  for (let i = 0; i < enemies.length; i++) {
    var enemy = enemies[i];
    var enemyPosition = enemy["position"];
    var paddingX = startingX + 15;
    var paddingY = startingY + 15;
    var enemyX = paddingX + (enemyPosition[0] - 1) * 50;
    var enemyY = paddingY + (enemyPosition[1] - 1) * 50;
    if (enemy.hitLastTurn) {
      ctx.fillStyle = "red";
    } else {
      if (enemy.hasOwnProperty("color")) {
        ctx.fillStyle = enemy["color"];
      } else {
        ctx.fillStyle = "salmon";
      }
    }
    if (enemy.hasOwnProperty("shape")) {
      if (enemy.shape == "square") {
        ctx.fillRect(enemyX, enemyY, 25, 25);
        ctx.strokeRect(enemyX, enemyY, 25, 25);
      }
    } else {
      ctx.beginPath();
      ctx.arc(enemyX + 12.5, enemyY + 12.5, 12.5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
      ctx.fillStyle = "black";
      ctx.stroke();
    }
    ctx.font = "bold 12px Segoe UI";
    if (enemy.isObstacle == false) {
      ctx.fillText(enemy["name"], enemyX + 12.5, enemyY + 35);
    }
    if (enemy.hasOwnProperty("icon")) {
      if (enemy.icon == "ranged") {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(enemyX + 6.25, enemyY + 12.5);
        ctx.lineTo(enemyX + 9.375, enemyY + 12.5);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(enemyX + 12.5, enemyY + 6.25);
        ctx.lineTo(enemyX + 12.5, enemyY + 9.375);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(enemyX + 18.75, enemyY + 12.5);
        ctx.lineTo(enemyX + 15.625, enemyY + 12.5);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(enemyX + 12.5, enemyY + 18.75);
        ctx.lineTo(enemyX + 12.5, enemyY + 15.625);
        ctx.stroke();
        ctx.closePath();
      } else if (enemy.icon == "crown") {
        ctx.fillStyle = "gold";
        ctx.beginPath();
        ctx.moveTo(enemyX + 6.25, enemyY + 17.1875);
        ctx.lineTo(enemyX + 6.25, enemyY + 10.9375);
        ctx.lineTo(enemyX + 9.375, enemyY + 14.0625);
        ctx.lineTo(enemyX + 12.5, enemyY + 10.9375);
        ctx.lineTo(enemyX + 15.625, enemyY + 14.0625);
        ctx.lineTo(enemyX + 18.75, enemyY + 10.9375);
        ctx.lineTo(enemyX + 18.75, enemyY + 17.1875);
        ctx.lineTo(enemyX + 6.25, enemyY + 17.1875);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle = "black";
      }
    }
  }
  var playerPosition = getValue("position");
  var paddingX = startingX + 15;
  var paddingY = startingY + 15;
  var playerX = paddingX + (playerPosition[0] - 1) * 50;
  var playerY = paddingY + (playerPosition[1] - 1) * 50;
  ctx.fillStyle = "lightblue";
  ctx.beginPath();
  ctx.arc(playerX + 12.5, playerY + 12.5, 12.5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
  ctx.fillStyle = "black";
  ctx.stroke();
  var direction = getValue("direction");
  var directionX = playerX + 12.5;
  var directionY = playerY + 12.5;
  ctx.beginPath();
  ctx.moveTo(directionX, directionY);
  switch (direction) {
    case "north":
      ctx.lineTo(directionX, directionY - 25);
      ctx.lineTo(directionX - 5, directionY - 20);
      ctx.moveTo(directionX, directionY - 25);
      ctx.lineTo(directionX + 5, directionY - 20);
      break;
    case "northeast":
      ctx.lineTo(directionX + 20, directionY - 20);
      ctx.lineTo(directionX + 12.5, directionY - 20);
      ctx.moveTo(directionX + 20, directionY - 20);
      ctx.lineTo(directionX + 20, directionY - 12.5);
      break;
    case "east":
      ctx.lineTo(directionX + 25, directionY);
      ctx.lineTo(directionX + 20, directionY - 5);
      ctx.moveTo(directionX + 25, directionY);
      ctx.lineTo(directionX + 20, directionY + 5);
      break;
    case "southeast":
      ctx.lineTo(directionX + 20, directionY + 20);
      ctx.lineTo(directionX + 20, directionY + 12.5);
      ctx.moveTo(directionX + 20, directionY + 20);
      ctx.lineTo(directionX + 12.5, directionY + 20);
      break;
    case "south":
      ctx.lineTo(directionX, directionY + 25);
      ctx.lineTo(directionX - 5, directionY + 20);
      ctx.moveTo(directionX, directionY + 25);
      ctx.lineTo(directionX + 5, directionY + 20);
      break;
    case "southwest":
      ctx.lineTo(directionX - 20, directionY + 20);
      ctx.lineTo(directionX - 20, directionY + 12.5);
      ctx.moveTo(directionX - 20, directionY + 20);
      ctx.lineTo(directionX - 12.5, directionY + 20);
      break;
    case "west":
      ctx.lineTo(directionX - 25, directionY);
      ctx.lineTo(directionX - 20, directionY - 5);
      ctx.moveTo(directionX - 25, directionY);
      ctx.lineTo(directionX - 20, directionY + 5);
      break;
    case "northwest":
      ctx.lineTo(directionX - 20, directionY - 20);
      ctx.lineTo(directionX - 20, directionY - 12.5);
      ctx.moveTo(directionX - 20, directionY - 20);
      ctx.lineTo(directionX - 12.5, directionY - 20);
      break;
  }
  ctx.stroke();
  ctx.fillText(getValue("name"), playerX + 12.5, playerY - 2.5);
}

function buildRooms(
  exits,
  startingWidth,
  startingHeight,
  startingX,
  startingY,
  level = 0
) {
  if (level >= 5) {
    return;
  }
  const canvas = document.getElementById("map");
  const ctx = canvas.getContext("2d");
  ctx.font = "bold 20px Segoe UI";
  if (exits["north"]) {
    var north = eval(getValue(exits["north"], true));
    var northExits = north["exits"];
    var northName = north["name"];
    var northWidth = north["width"] * 10;
    var northHeight = north["height"] * 10;
    var differenceX = startingWidth - northWidth;
    var northX = startingX + differenceX / 2;
    var northY = startingY - northHeight - 1.5;
    ctx.clearRect(northX, northY, northWidth, northHeight);
    ctx.fillStyle = "white";
    ctx.fillRect(northX, northY, northWidth, northHeight);
    ctx.fillStyle = "black";
    ctx.strokeRect(northX, northY, northWidth, northHeight);
    ctx.strokeRect(northX - 1, northY - 1, northWidth + 1.5, northHeight + 1.5);
    if (northName.split("/").length > 1) {
      northName = northName.split("/");
      ctx.fillText(
        northName[0],
        northX + northWidth / 2 + 0.5,
        northY + northHeight / 2 - 10.5
      );
      ctx.fillText(
        northName[1],
        northX + northWidth / 2 + 0.5,
        northY + northHeight / 2 + 10.5
      );
    } else {
      ctx.fillText(
        northName,
        northX + northWidth / 2 + 0.5,
        northY + northHeight / 2 + 0.5
      );
    }
    if (north.isVisited) {
      level++;
      buildRooms(northExits, northWidth, northHeight, northX, northY, level);
      level--;
    }
  }
  if (exits["east"]) {
    var east = eval(getValue(exits["east"], true));
    var eastExits = east["exits"];
    var eastName = east["name"];
    var eastWidth = east["width"] * 10;
    var eastHeight = east["height"] * 10;
    var differenceY = startingHeight - eastHeight;
    var eastX = startingX + startingWidth + 1.5;
    var eastY = startingY + differenceY / 2;
    ctx.clearRect(eastX, eastY, eastWidth, eastHeight);
    ctx.fillStyle = "white";
    ctx.fillRect(eastX, eastY, eastWidth, eastHeight);
    ctx.fillStyle = "black";
    ctx.strokeRect(eastX, eastY, eastWidth, eastHeight);
    ctx.strokeRect(eastX - 1, eastY - 1, eastWidth + 1.5, eastHeight + 1.5);
    if (eastName.split("/").length > 1) {
      eastName = eastName.split("/");
      ctx.fillText(
        eastName[0],
        eastX + eastWidth / 2 + 0.5,
        eastY + eastHeight / 2 - 10.5
      );
      ctx.fillText(
        eastName[1],
        eastX + eastWidth / 2 + 0.5,
        eastY + eastHeight / 2 + 10.5
      );
    } else {
      ctx.fillText(
        eastName,
        eastX + eastWidth / 2 + 0.5,
        eastY + eastHeight / 2 + 0.5
      );
    }
    if (east.isVisited) {
      level++;
      buildRooms(eastExits, eastWidth, eastHeight, eastX, eastY, level);
      level--;
    }
  }
  if (exits["south"]) {
    var south = eval(getValue(exits["south"], true));
    var southExits = south["exits"];
    var southName = south["name"];
    var southWidth = south["width"] * 10;
    var southHeight = south["height"] * 10;
    var differenceX = startingWidth - southWidth;
    var southX = startingX + differenceX / 2;
    var southY = startingY + startingHeight + 1.5;
    ctx.clearRect(southX, southY, southWidth, southHeight);
    ctx.fillStyle = "white";
    ctx.fillRect(southX, southY, southWidth, southHeight);
    ctx.fillStyle = "black";
    ctx.strokeRect(southX, southY, southWidth, southHeight);
    ctx.strokeRect(southX - 1, southY - 1, southWidth + 1.5, southHeight + 1.5);
    if (southName.split("/").length > 1) {
      southName = southName.split("/");
      ctx.fillText(
        southName[0],
        southX + southWidth / 2 + 0.5,
        southY + southHeight / 2 - 10.5
      );
      ctx.fillText(
        southName[1],
        southX + southWidth / 2 + 0.5,
        southY + southHeight / 2 + 10.5
      );
    } else {
      ctx.fillText(
        southName,
        southX + southWidth / 2 + 0.5,
        southY + southHeight / 2 + 0.5
      );
    }
    if (south.isVisited) {
      level++;
      buildRooms(southExits, southWidth, southHeight, southX, southY, level);
      level--;
    }
  }
  if (exits["west"]) {
    var west = eval(getValue(exits["west"], true));
    var westExits = west["exits"];
    var westName = west["name"];
    var westWidth = west["width"] * 10;
    var westHeight = west["height"] * 10;
    var differenceY = startingHeight - westHeight;
    var westX = startingX - westWidth - 1.5;
    var westY = startingY + differenceY / 2;
    ctx.clearRect(westX, westY, westWidth, westHeight);
    ctx.fillStyle = "white";
    ctx.fillRect(westX, westY, westWidth, westHeight);
    ctx.fillStyle = "black";
    ctx.strokeRect(westX, westY, westWidth, westHeight);
    ctx.strokeRect(westX - 1, westY - 1, westWidth + 1.5, westHeight + 1.5);
    if (westName.split("/").length > 1) {
      westName = westName.split("/");
      ctx.fillText(
        westName[0],
        westX + westWidth / 2 + 0.5,
        westY + westHeight / 2 - 10.5
      );
      ctx.fillText(
        westName[1],
        westX + westWidth / 2 + 0.5,
        westY + westHeight / 2 + 10.5
      );
    } else {
      ctx.fillText(
        westName,
        westX + westWidth / 2 + 0.5,
        westY + westHeight / 2 + 0.5
      );
    }
    if (west.isVisited) {
      level++;
      buildRooms(westExits, westWidth, westHeight, westX, westY, level);
      level--;
    }
  }
}

function drawCompass(ctx, width, height) {
  ctx.font = "bold 20px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.fillText("N", width / 2, 20);
  ctx.fillText("NE", width - 17.5, 20);
  ctx.fillText("E", width - 10, height / 2);
  ctx.fillText("SE", width - 17.5, height - 5);
  ctx.fillText("S", width / 2, height - 5);
  ctx.fillText("SW", 20, height - 5);
  ctx.fillText("W", 15, height / 2);
  ctx.fillText("NW", 20, 20);
}

function updateWorldMap() {
  var mapArray = getValue("map");
  const canvas = document.getElementById("map");
  const ctx = canvas.getContext("2d");
  var squareWidth = canvas.width / 15;
  var squareHeight = canvas.height / 15;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      var character = mapArray[i][j];
      if (character == "U") {
        ctx.fillStyle = "#8B6914";
        ctx.fillRect(i * squareWidth, j * squareHeight, squareWidth, squareHeight);
        ctx.font = "bold 20px Segoe UI";
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.fillText(
          "U",
          i * squareWidth + squareWidth / 2,
          j * squareHeight + squareHeight / 2 + 7
        );
      } else if (character == "P") {
        ctx.fillStyle = "#A9A9A9";
        ctx.fillRect(i * squareWidth, j * squareHeight, squareWidth, squareHeight);
        ctx.font = "bold 20px Segoe UI";
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.fillText(
          "P",
          i * squareWidth + squareWidth / 2,
          j * squareHeight + squareHeight / 2 + 7
        );
      } else if (character == "L") {
        ctx.fillStyle = "#228B22";
        ctx.fillRect(i * squareWidth, j * squareHeight, squareWidth, squareHeight);
        ctx.font = "bold 20px Segoe UI";
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.fillText(
          "L",
          i * squareWidth + squareWidth / 2,
          j * squareHeight + squareHeight / 2 + 7
        );
      } else if (character == "F") {
        ctx.fillStyle = "#228B22";
        ctx.fillRect(i * squareWidth, j * squareHeight, squareWidth, squareHeight);
      } else if (character == "M") {
        ctx.fillStyle = "#A9A9A9";
        ctx.fillRect(i * squareWidth, j * squareHeight, squareWidth, squareHeight);
      } else if (character == "V") {
        ctx.fillStyle = "#A9A9A9";
        ctx.fillRect(i * squareWidth, j * squareHeight, squareWidth, squareHeight);
        ctx.beginPath();
        ctx.arc(
          i * squareWidth + squareWidth / 2,
          j * squareHeight + squareHeight / 2,
          10,
          0,
          2 * Math.PI
        );
        ctx.fillStyle = "#8B0000";
        ctx.fill();
        ctx.closePath();
      } else if (character == "D") {
        ctx.fillStyle = "#FFD700";
        ctx.fillRect(i * squareWidth, j * squareHeight, squareWidth, squareHeight);
      } else if (character == "O") {
        ctx.fillStyle = "#0000FF";
        ctx.fillRect(i * squareWidth, j * squareHeight, squareWidth, squareHeight);
      } else if (character == "S") {
        ctx.fillStyle = "#8B6914";
        ctx.fillRect(i * squareWidth, j * squareHeight, squareWidth, squareHeight);
      } else if (character == "R") {
        ctx.fillStyle = "#4682B4";
        ctx.fillRect(i * squareWidth, j * squareHeight, squareWidth, squareHeight);
      }
    }
  }
  var playerLocation = getValue("location");
  var playerRegion = playerLocation.split(".")[0];
  var mapGrid = getValue("mapGrid");
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      var cell = mapGrid[i][j];
      var keys = Object.keys(cell);
      if (keys.length > 0) {
        var secondaryKeys = Object.keys(cell[keys[0]]);
        if (cell[keys[0]][secondaryKeys[0]].hasOwnProperty("id")) {
          var cellRegion = cell[keys[0]][secondaryKeys[0]]["id"].split(".")[0];
          if (cellRegion == playerRegion) {
            ctx.strokeStyle = "red";
            ctx.lineWidth = 4;
            ctx.strokeRect(i * squareWidth, j * squareHeight, squareWidth, squareHeight);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
          }
        }
      }
    }
  } 
}

function updateMapKey() {
  const canvas = document.getElementById("map");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "bold 20px Segoe UI";
  ctx.textAlign = "left";
  ctx.fillStyle = "#228B22";
  ctx.fillRect(50, 27.5, 50, 50);
  ctx.fillStyle = "black";
  ctx.fillText("Forest (L - Liberty City)", 110, 57.5);
  ctx.fillStyle = "#A9A9A9";
  ctx.fillRect(50, 97.5, 50, 50);
  ctx.fillStyle = "black";
  ctx.fillText("Mountain (P - Paragon City)", 110, 127.5);
  ctx.fillStyle = "#A9A9A9";
  ctx.fillRect(50, 167.5, 50, 50);
  ctx.fillStyle = "#8B0000";
  ctx.beginPath();
  ctx.arc(75, 192.5, 10, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
  ctx.fillStyle = "black";
  ctx.fillText("Volcano", 110, 197.5);
  ctx.fillStyle = "#FFD700";
  ctx.fillRect(50, 237.5, 50, 50);
  ctx.fillStyle = "black";
  ctx.fillText("Desert", 110, 267.5);
  ctx.fillStyle = "#0000FF";
  ctx.fillRect(50, 307.5, 50, 50);
  ctx.fillStyle = "black";
  ctx.fillText("Ocean", 110, 337.5);
  ctx.fillStyle = "#8B6914";
  ctx.fillRect(50, 377.5, 50, 50);
  ctx.fillStyle = "black";
  ctx.fillText("Shore (U - Unknown Shore)", 110, 407.5);
  ctx.fillStyle = "#4682B4";
  ctx.fillRect(50, 447.5, 50, 50);
  ctx.fillStyle = "black";
  ctx.fillText("River", 110, 477.5);
  ctx.fillStyle = "black";
  ctx.strokeStyle = "red";
  ctx.lineWidth = 4;
  ctx.strokeRect(50, 517.5, 50, 50);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.fillStyle = "black";
  ctx.fillText("Player Location", 110, 547.5);
}

module.exports = { updateMap, updateWorldMap, updateMapKey };