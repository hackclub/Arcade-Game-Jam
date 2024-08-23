const Ocean = require("./class_collections/locations/generated/ocean");

var row01 = ["O","O","O","O","O","O","O","O","O","O","O","O","O","O","O"]; // prettier-ignore
var row02 = ["O","X","X","X","X","X","X","X","X","X","X","X","X","X","O"]; // prettier-ignore
var row03 = ["O","X","X","X","X","X","X","X","X","X","X","X","X","X","O"]; // prettier-ignore
var row04 = ["O","X","X","X","X","X","X","X","X","X","X","X","X","X","O"]; // prettier-ignore
var row05 = ["O","X","X","X","X","X","X","X","X","X","X","X","X","X","O"]; // prettier-ignore
var row06 = ["O","X","X","X","X","X","X","X","X","X","X","X","X","X","O"]; // prettier-ignore
var row07 = ["O","X","X","X","X","X","X","X","X","X","X","X","X","X","O"]; // prettier-ignore
var row08 = ["O","X","X","X","X","X","X","X","X","X","X","X","X","X","O"]; // prettier-ignore
var row09 = ["O","X","X","X","X","X","X","X","X","X","X","X","X","X","O"]; // prettier-ignore
var row10 = ["O","X","X","X","X","X","X","X","X","X","X","X","X","X","O"]; // prettier-ignore
var row11 = ["O","X","X","X","X","X","X","X","X","X","X","X","X","X","O"]; // prettier-ignore
var row12 = ["O","X","X","X","X","X","X","X","X","X","X","X","X","X","O"]; // prettier-ignore
var row13 = ["O","X","X","X","X","X","X","X","X","X","X","X","X","X","O"]; // prettier-ignore
var row14 = ["O","X","X","X","X","X","X","X","X","X","X","X","X","X","O"]; // prettier-ignore
var row15 = ["O","O","O","O","O","O","O","O","O","O","O","O","O","O","O"]; // prettier-ignore

var mapGrid = [
  row01,
  row02,
  row03,
  row04,
  row05,
  row06,
  row07,
  row08,
  row09,
  row10,
  row11,
  row12,
  row13,
  row14,
  row15,
];

function generateMap(map) {
  generateOceans(map); // If a cell is adjacent to ocean, it will become ocean 33% of the time, otherwise it will become shore
  generateBiome(map, "F"); // Generate 5 forest tiles
  generateBiome(map, "M"); // Generate 5 mountain tiles
  generateBiome(map, "D"); // Generate 5 desert tiles
  propagateBiomes(map); // Biomes will propagate to adjacent cells
  generateParagonCity(map); // Generate Paragon City, on a tile that is surrounded by four mountain tiles (or less if that is not possible)
  fillShoreline(map); // If there are empty cells adjacent to ocean cells, they will become shore
  trimShoreline(map); // If there are shore cells that are not adjacent to non-shore tiles, they will become ocean
  generateRiver(map); // Generate a river that starts at the ocean and ends at the ocean
  generateLibertyCity(map); // Generate Liberty City, on a forest tile that is adjacent to a shore and not too close to Paragon City
  generateSpecialBiome(map, "M", "V", 2); // Generate 2 volcano tiles
  var unknownShoreCoords = generateUnknownShore(map); // Generate the Unknown Shore
  // Make an array of all the map cells
  var displayMap = [];
  for (let i = 0; i < map.length; i++) {
    var row = [];
    for (let j = 0; j < map[i].length; j++) {
      row.push(map[i][j]);
    }
    displayMap.push(row);
  }
  generateRegions(map, unknownShoreCoords); // Generate regions for each cell
  linkRegions(map); // Link the entrances of each region to the entrances of adjacent regions
  return [mapGrid, displayMap];
}

function generateOceans(mapGrid) {
  for (let i = 0; i < mapGrid.length; i++) {
    if (i == 0) {
      var priorRow = null;
    } else if (i == mapGrid.length - 1) {
      var nextRow = null;
    } else {
      var priorRow = mapGrid[i - 1];
      var nextRow = mapGrid[i + 1];
    }
    var currentRow = mapGrid[i];
    var hasGeneratedOcean = false;
    for (let i = 0; i < currentRow.length; i++) {
      if (i == 0) {
        var left = null;
      } else if (i == currentRow.length - 1) {
        var right = null;
      } else {
        var left = currentRow[i - 1];
        var right = currentRow[i + 1];
      }
      if (currentRow[i] == "X" && !hasGeneratedOcean) {
        if (
          priorRow[i] == "O" ||
          nextRow[i] == "O" ||
          left == "O" ||
          right == "O"
        ) {
          var coinFlip = Math.random();
          if (coinFlip > 0.66) {
            currentRow[i] = "O";
          } else {
            currentRow[i] = "S";
          }
        }
      } else if (currentRow[i] == "X" && hasGeneratedOcean) {
        if (
          priorRow[i] == "O" ||
          nextRow[i] == "O" ||
          left == "O" ||
          right == "O"
        ) {
          currentRow[i] = "S";
        }
      }
      if (i == currentRow.length - 1 && !hasGeneratedOcean) {
        hasGeneratedOcean = true;
        i = 0;
      }
    }
  }
  for (let i = 0; i < mapGrid.length; i++) {
    if (i == 0) {
      var priorRow = null;
    } else if (i == mapGrid.length - 1) {
      var nextRow = null;
    } else {
      var priorRow = mapGrid[i - 1];
      var nextRow = mapGrid[i + 1];
    }
    var currentRow = mapGrid[i];
    for (let i = 0; i < currentRow.length; i++) {
      if (i == 0) {
        var left = null;
      } else if (i == currentRow.length - 1) {
        var right = null;
      } else {
        var left = currentRow[i - 1];
        var right = currentRow[i + 1];
      }
      if (currentRow[i] == "S") {
        if (
          priorRow[i] == "O" &&
          nextRow[i] == "O" &&
          left == "O" &&
          right == "O"
        ) {
          currentRow[i] = "O";
        }
      }
    }
  }
}

function generateBiome(mapGrid, biome) {
  var biomeNum = 5;
  for (let i = 0; i < biomeNum; i++) {
    var rowChoice = Math.floor(Math.random() * mapGrid.length);
    var colChoice = Math.floor(Math.random() * mapGrid[rowChoice].length);
    if (mapGrid[rowChoice][colChoice] == "X") {
      mapGrid[rowChoice][colChoice] = biome;
    } else {
      i--;
    }
  }
}

function propagateBiomes(mapGrid) {
  for (let i = 0; i < mapGrid.length; i++) {
    if (i == 0) {
      var priorRow = null;
    } else if (i == mapGrid.length - 1) {
      var nextRow = null;
    } else {
      var priorRow = mapGrid[i - 1];
      var nextRow = mapGrid[i + 1];
    }
    var currentRow = mapGrid[i];
    var iteration = 0;
    for (let i = 0; i < currentRow.length; i++) {
      if (i == 0) {
        var left = null;
      } else if (i == currentRow.length - 1) {
        var right = null;
      } else {
        var left = currentRow[i - 1];
        var right = currentRow[i + 1];
      }
      if (currentRow[i] == "X") {
        if (iteration < 4) {
          iteration++;
        } else {
          iteration = 0;
        }
        if (iteration == 0 || iteration == 1) {
          if (
            priorRow[i] == "F" ||
            nextRow[i] == "F" ||
            left == "F" ||
            right == "F"
          ) {
            currentRow[i] = "F";
            i = 0;
          } else if (
            priorRow[i] == "M" ||
            nextRow[i] == "M" ||
            left == "M" ||
            right == "M"
          ) {
            currentRow[i] = "M";
            i = 0;
          } else if (
            priorRow[i] == "D" ||
            nextRow[i] == "D" ||
            left == "D" ||
            right == "D"
          ) {
            currentRow[i] = "D";
            i = 0;
          }
        } else if (iteration == 2) {
          if (
            priorRow[i] == "D" ||
            nextRow[i] == "D" ||
            left == "D" ||
            right == "D"
          ) {
            currentRow[i] = "D";
            i = 0;
          } else if (
            priorRow[i] == "F" ||
            nextRow[i] == "F" ||
            left == "F" ||
            right == "F"
          ) {
            currentRow[i] = "F";
            i = 0;
          } else if (
            priorRow[i] == "M" ||
            nextRow[i] == "M" ||
            left == "M" ||
            right == "M"
          ) {
            currentRow[i] = "M";
            i = 0;
          }
        } else if (iteration == 3) {
          if (
            priorRow[i] == "M" ||
            nextRow[i] == "M" ||
            left == "M" ||
            right == "M"
          ) {
            currentRow[i] = "M";
            i = 0;
          } else if (
            priorRow[i] == "D" ||
            nextRow[i] == "D" ||
            left == "D" ||
            right == "D"
          ) {
            currentRow[i] = "D";
            i = 0;
          } else if (
            priorRow[i] == "F" ||
            nextRow[i] == "F" ||
            left == "F" ||
            right == "F"
          ) {
            currentRow[i] = "F";
            i = 0;
          }
        }
      }
    }
  }
}

function fillShoreline(mapGrid) {
  for (let i = 0; i < mapGrid.length; i++) {
    for (let j = 0; j < mapGrid[i].length; j++) {
      if (mapGrid[i][j] == "X") {
        if (i > 0 && mapGrid[i - 1][j] != "X" && mapGrid[i - 1][j] != "S") {
          mapGrid[i][j] = "S";
        } else if (
          i < mapGrid.length - 1 &&
          mapGrid[i + 1][j] != "X" &&
          mapGrid[i + 1][j] != "S"
        ) {
          mapGrid[i][j] = "S";
        } else if (
          j > 0 &&
          mapGrid[i][j - 1] != "X" &&
          mapGrid[i][j - 1] != "S"
        ) {
          mapGrid[i][j] = "S";
        } else if (
          j < mapGrid[i].length - 1 &&
          mapGrid[i][j + 1] != "X" &&
          mapGrid[i][j + 1] != "S"
        ) {
          mapGrid[i][j] = "S";
        } else {
          mapGrid[i][j] = "O";
        }
      }
    }
  }
  for (let i = 0; i < mapGrid.length; i++) {
    for (let j = 0; j < mapGrid[i].length; j++) {
      if (mapGrid[i][j] != "O" && mapGrid[i][j] != "S") {
        if (i > 0 && mapGrid[i - 1][j] == "O" && mapGrid[i - 1][j] != "S") {
          mapGrid[i][j] = "S";
        } else if (
          i < mapGrid.length - 1 &&
          mapGrid[i + 1][j] == "O" &&
          mapGrid[i + 1][j] != "S"
        ) {
          mapGrid[i][j] = "S";
        } else if (
          j > 0 &&
          mapGrid[i][j - 1] == "O" &&
          mapGrid[i][j - 1] != "S"
        ) {
          mapGrid[i][j] = "S";
        } else if (
          j < mapGrid[i].length - 1 &&
          mapGrid[i][j + 1] == "O" &&
          mapGrid[i][j + 1] != "S"
        ) {
          mapGrid[i][j] = "S";
        }
      }
    }
  }
}

function trimShoreline(mapGrid) {
  for (let i = 0; i < mapGrid.length; i++) {
    for (let j = 0; j < mapGrid[i].length; j++) {
      if (mapGrid[i][j] == "S") {
        if (i > 0 && mapGrid[i - 1][j] != "S" && mapGrid[i - 1][j] != "O") {
          continue;
        } else if (
          i < mapGrid.length - 1 &&
          mapGrid[i + 1][j] != "S" &&
          mapGrid[i + 1][j] != "O"
        ) {
          continue;
        } else if (
          j > 0 &&
          mapGrid[i][j - 1] != "S" &&
          mapGrid[i][j - 1] != "O"
        ) {
          continue;
        } else if (
          j < mapGrid[i].length - 1 &&
          mapGrid[i][j + 1] != "S" &&
          mapGrid[i][j + 1] != "O"
        ) {
          continue;
        } else {
          mapGrid[i][j] = "O";
        }
      }
    }
  }
}

function generateRiver(mapGrid) {
  var riverPlotted = false;
  while (!riverPlotted) {
    var startRow = Math.floor(Math.random() * mapGrid.length);
    var startCol = Math.floor(Math.random() * mapGrid[startRow].length);
    while (mapGrid[startRow][startCol] != "S") {
      startRow = Math.floor(Math.random() * mapGrid.length);
      startCol = Math.floor(Math.random() * mapGrid[startRow].length);
    }
    var rowNum = mapGrid.length - 1;
    var colNum = mapGrid[rowNum].length - 1;
    var endRow = rowNum - startRow;
    var endCol = colNum - startCol;
    var xDistance = endCol - startCol;
    var yDistance = endRow - startRow;
    if (mapGrid[endRow][endCol] == "S") {
      mapGrid[startRow][startCol] = "R";
      riverPlotted = true;
    }
  }
  var currentRow = startRow;
  var currentCol = startCol;
  while (xDistance != 0 || yDistance != 0) {
    if (xDistance > 0) {
      mapGrid[currentRow][currentCol + 1] = "R";
      currentCol++;
      xDistance--;
    } else if (xDistance < 0) {
      mapGrid[currentRow][currentCol - 1] = "R";
      currentCol--;
      xDistance++;
    }
    if (yDistance > 0) {
      mapGrid[currentRow + 1][currentCol] = "R";
      currentRow++;
      yDistance--;
    } else if (yDistance < 0) {
      mapGrid[currentRow - 1][currentCol] = "R";
      currentRow--;
      yDistance++;
    }
  }
}

function generateParagonCity(mapGrid, targetNumber = 4) {
  var targetNum = targetNumber;
  var currentNum = 0;
  for (let i = 0; i < mapGrid.length; i++) {
    if (i == 0) {
      var priorRow = null;
    } else if (i == mapGrid.length - 1) {
      var nextRow = null;
    } else {
      var priorRow = mapGrid[i - 1];
      var nextRow = mapGrid[i + 1];
    }
    var currentRow = mapGrid[i];
    for (j = 0; j < currentRow.length; j++) {
      if (j == 0) {
        var left = null;
      } else if (j == currentRow.length - 1) {
        var right = null;
      } else {
        var left = currentRow[j - 1];
        var right = currentRow[j + 1];
      }
      if (currentRow[j] == "M") {
        if (left != null) {
          if (left == "M") {
            currentNum++;
          }
        }
        if (right != null) {
          if (right == "M") {
            currentNum++;
          }
        }
        if (priorRow != null) {
          if (priorRow[j] == "M") {
            currentNum++;
          }
        }
        if (nextRow != null) {
          if (nextRow[j] == "M") {
            currentNum++;
          }
        }
        if (currentNum >= targetNum) {
          mapGrid[i][j] = "P";
          return;
        }
      }
      currentNum = 0;
    }
  }
  targetNum--;
  generateParagonCity(mapGrid, targetNum);
}

function generateLibertyCity(mapGrid) {
  var targetNum = 1;
  var currentNum = 0;
  for (let i = 0; i < mapGrid.length; i++) {
    if (i == 0) {
      var priorRow = null;
    } else if (i == mapGrid.length - 1) {
      var nextRow = null;
    } else {
      var priorRow = mapGrid[i - 1];
      var nextRow = mapGrid[i + 1];
    }
    var currentRow = mapGrid[i];
    for (j = 0; j < currentRow.length; j++) {
      if (j == 0) {
        var left = null;
      } else if (j == currentRow.length - 1) {
        var right = null;
      } else {
        var left = currentRow[j - 1];
        var right = currentRow[j + 1];
      }
      if (currentRow[j] == "F") {
        if (left != null) {
          if (left == "S") {
            currentNum++;
          }
        }
        if (right != null) {
          if (right == "S") {
            currentNum++;
          }
        }
        if (priorRow != null) {
          if (priorRow[j] == "S") {
            currentNum++;
          }
        }
        if (nextRow != null) {
          if (nextRow[j] == "S") {
            currentNum++;
          }
        }
        if (currentNum >= targetNum) {
          var paragonCityCoords = findParagonCity(mapGrid);
          if (paragonCityCoords == undefined) {
            return false;
          }
          var xDistance = Math.abs(paragonCityCoords[0] - i);
          var yDistance = Math.abs(paragonCityCoords[1] - j);
          if (xDistance > 5 || yDistance > 5) {
            mapGrid[i][j] = "L";
            return;
          } else {
            currentNum = 0;
          }
        }
      }
      currentNum = 0;
    }
  }
  targetNum--;
  generateLibertyCity(mapGrid, targetNum);
}

function findParagonCity(mapGrid) {
  try {
    for (let i = 0; i < mapGrid.length; i++) {
      for (let j = 0; j < mapGrid[i].length; j++) {
        if (mapGrid[i][j] == "P") {
          return [i, j];
        }
      }
    }
  } catch (error) {
    generateParagonCity(mapGrid);
    findParagonCity(mapGrid);
  }
}

function findLibertyCity(mapGrid) {
  try {
    for (let i = 0; i < mapGrid.length; i++) {
      for (let j = 0; j < mapGrid[i].length; j++) {
        if (mapGrid[i][j] == "L") {
          return [i, j];
        }
      }
    }
  } catch (error) {
    generateLibertyCity(mapGrid);
    findLibertyCity(mapGrid);
  }
}

function generateSpecialBiome(
  mapGrid,
  biome,
  specialBiome,
  targetNumber,
  currentNum = 0,
  iterations = 0
) {
  var targetNum = targetNumber;
  var currentNum = currentNum;
  var iterations = iterations;
  var randomRow = Math.floor(Math.random() * mapGrid.length);
  var randomCol = Math.floor(Math.random() * mapGrid[randomRow].length);
  if (iterations > 1000) {
    return;
  }
  if (mapGrid[randomRow][randomCol] == biome && currentNum < targetNum) {
    mapGrid[randomRow][randomCol] = specialBiome;
    currentNum++;
    if (currentNum >= targetNum) {
      return;
    }
  }
  iterations++;
  generateSpecialBiome(mapGrid, biome, specialBiome, targetNumber, currentNum);
}

function generateUnknownShore(mapGrid) {
  for (let i = 0; i < mapGrid.length; i++) {
    for (let j = 0; j < mapGrid[i].length; j++) {
      if (mapGrid[i][j] == "S") {
        var paragonCityCoords = findParagonCity(mapGrid);
        var libertyCityCoords = findLibertyCity(mapGrid);
        var xDistanceParagon = Math.abs(paragonCityCoords[0] - i);
        var yDistanceParagon = Math.abs(paragonCityCoords[1] - j);
        var xDistanceLiberty = Math.abs(libertyCityCoords[0] - i);
        var yDistanceLiberty = Math.abs(libertyCityCoords[1] - j);
        if (xDistanceParagon > 5 || yDistanceParagon > 5) {
          if (xDistanceLiberty > 5 || yDistanceLiberty > 5) {
            mapGrid[i][j] = "U";
            return [i, j];
          }
        }
      }
    }
  }
}

function generateRegions(mapGrid, unknownShoreCoords) {
  for (let i = 0; i < mapGrid.length; i++) {
    for (let j = 0; j < mapGrid[i].length; j++) {
      if (mapGrid[i][j] == "O") {
        generateOceanTile(mapGrid, [i, j]);
      } else if (mapGrid[i][j] == "F") {
        generateTile(mapGrid, [i, j], "forest", unknownShoreCoords);
      } else if (mapGrid[i][j] == "D") {
        generateTile(mapGrid, [i, j], "desert", unknownShoreCoords);
      } else if (mapGrid[i][j] == "M") {
        generateTile(mapGrid, [i, j], "mountain", unknownShoreCoords);
      } else if (mapGrid[i][j] == "V") {
        generateTile(mapGrid, [i, j], "volcano", unknownShoreCoords);
      } else if (mapGrid[i][j] == "S") {
        generateTile(mapGrid, [i, j], "shore", unknownShoreCoords);
      } else if (mapGrid[i][j] == "R") {
        generateRiverTile(mapGrid, [i, j], unknownShoreCoords);
      } else if (mapGrid[i][j] == "P") {
        generateParagonCityTile(mapGrid, [i, j], unknownShoreCoords);
      } else if (mapGrid[i][j] == "L") {
        generateTile(mapGrid, [i, j], "libertyCity", unknownShoreCoords);
      } else if (mapGrid[i][j] == "U") {
        generateUnknownShoreTile(mapGrid, [i, j]);
      }
    }
  }
}

function getIncrement(mapGrid, roomType) {
  var increment = 1;
  for (let i = 0; i < mapGrid.length; i++) {
    for (let j = 0; j < mapGrid[i].length; j++) {
      var keys = Object.keys(mapGrid[i][j]);
      for (let k = 0; k < keys.length; k++) {
        if (keys[k].includes(roomType)) {
          increment++;
        }
      }
    }
  }
  return increment;
}

function getTier(targetTile, unknownShoreCoords) {
  var d10 = Math.floor(Math.random() * 10 + 1);
  if (d10 == 1) {
    var xDistance = Math.abs(unknownShoreCoords[0] - targetTile[0]);
    var yDistance = Math.abs(unknownShoreCoords[1] - targetTile[1]);
    var distance = xDistance + yDistance;
    var tier = Math.floor(distance / 5);
  } else {
    tier = 0;
  }
  return tier;
}

function generateOceanTile(mapGrid, targetTile) {
  var increment = getIncrement(mapGrid, "oceanTile");
  var regionId = `oceanTile_${increment}`;
  var oceanTile = new Ocean(`${regionId}.oceanTile_1`);
  var locationObjects = {};
  locationObjects[`oceanTile_1`] = oceanTile;
  mapGrid[targetTile[0]][targetTile[1]] = {};
  mapGrid[targetTile[0]][targetTile[1]][regionId] = locationObjects;
}

const {
  HorizontalForestEntrance,
  VerticalForestEntrance,
  HorizontalForestPath,
  VerticalForestPath,
  SmallClearing,
  LargeClearing,
  Crossroads,
} = require("./class_collections/locations/generated/forest");
const {
  HorizontalDesertEntrance,
  VerticalDesertEntrance,
  HorizontalDesertPath,
  VerticalDesertPath,
  SmallDunes,
  LargeDunes,
  SmallOasis,
  LargeOasis,
} = require("./class_collections/locations/generated/desert");
const {
  HorizontalMountainEntrance,
  VerticalMountainEntrance,
  HorizontalMountainPath,
  VerticalMountainPath,
  MountainPeak,
  BoulderField,
  Cave,
} = require("./class_collections/locations/generated/mountain");
const {
  HorizontalVolcanicEntrance,
  VerticalVolcanicEntrance,
  HorizontalVolcanicPath,
  VerticalVolcanicPath,
  LavaLake,
  LavaFlow,
  LavaCave,
} = require("./class_collections/locations/generated/volcano");
const {
  HorizontalShoreEntrance,
  VerticalShoreEntrance,
  HorizontalBeachPath,
  VerticalBeachPath,
  Beach,
  Tidepool,
  CoralReef,
} = require("./class_collections/locations/generated/shore");
const {
  HorizontalRiverEntrance,
  VerticalRiverEntrance,
  ThickHorizontalBridge,
  ThinHorizontalBridge,
  ThickVerticalBridge,
  ThinVerticalBridge,
} = require("./class_collections/locations/generated/river");
const {
  NorthernCityEntrance,
  SouthernCityEntrance,
  EasternCityEntrance,
  WesternCityEntrance,
  ShortHorizontalCityStreet,
  LongHorizontalCityStreet,
  ShortVerticalCityStreet,
  LongVerticalCityStreet,
  CitySquare,
} = require("./class_collections/locations/paragon_city/paragon_city");
const {
  HorizontalLibertyCityEntrance,
  VerticalLibertyCityEntrance,
  HorizontalLibertyCityPath,
  VerticalLibertyCityPath,
} = require("./class_collections/locations/liberty_city/liberty_city");
const {
  HorizontalUnknownShoreEntrance,
  VerticalUnknownShoreEntrance,
  rockyBeach,
  firstBeach,
  secondBeach,
  forestPath_01,
  clearing_01,
  travelingMerchant,
  oldTreeStump,
  forestPath_02,
  clearing_02,
} = require("./class_collections/locations/unknown_shore/unknown_shore");

function generateTile(mapGrid, targetTile, type, unknownShoreCoords) {
  var regionIncrement = getIncrement(mapGrid, type);
  var regionId = `${type}Tile_${regionIncrement}`;
  var increment = 1;
  switch (type) {
    case "forest":
      var randomTypes = [SmallClearing, LargeClearing];
      var horizontalPath = HorizontalForestPath;
      var verticalPath = VerticalForestPath;
      var horizontalEntrance = HorizontalForestEntrance;
      var verticalEntrance = VerticalForestEntrance;
      break;
    case "desert":
      var randomTypes = [SmallDunes, LargeDunes, SmallOasis, LargeOasis];
      var horizontalPath = HorizontalDesertPath;
      var verticalPath = VerticalDesertPath;
      var horizontalEntrance = HorizontalDesertEntrance;
      var verticalEntrance = VerticalDesertEntrance;
      break;
    case "mountain":
      var randomTypes = [MountainPeak, BoulderField, Cave];
      var horizontalPath = HorizontalMountainPath;
      var verticalPath = VerticalMountainPath;
      var horizontalEntrance = HorizontalMountainEntrance;
      var verticalEntrance = VerticalMountainEntrance;
      break;
    case "volcano":
      var randomTypes = [LavaLake, LavaFlow, LavaCave];
      var horizontalPath = HorizontalVolcanicPath;
      var verticalPath = VerticalVolcanicPath;
      var horizontalEntrance = HorizontalVolcanicEntrance;
      var verticalEntrance = VerticalVolcanicEntrance;
      break;
    case "shore":
      var randomTypes = [Beach, Tidepool, CoralReef];
      var horizontalPath = HorizontalBeachPath;
      var verticalPath = VerticalBeachPath;
      var horizontalEntrance = HorizontalShoreEntrance;
      var verticalEntrance = VerticalShoreEntrance;
      break;
    case "libertyCity":
      var randomTypes = [CitySquare];
      var horizontalPath = HorizontalLibertyCityPath;
      var verticalPath = VerticalLibertyCityPath;
      var horizontalEntrance = HorizontalLibertyCityEntrance;
      var verticalEntrance = VerticalLibertyCityEntrance;
      break;
  }
  var westernEntrance = new horizontalEntrance(
    `${regionId}.entrance_${increment}`
  );
  var westernPath = new horizontalPath(`${regionId}.path_${increment}`);
  var firstChoice = Math.floor(Math.random() * randomTypes.length);
  var firstRandomLocation = new randomTypes[firstChoice](
    `${regionId}.location_${increment}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var pathFromWestToNorthwest = new verticalPath(
    `${regionId}.path_${increment + 1}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var secondChoice = Math.floor(Math.random() * randomTypes.length);
  var secondRandomLocation = new randomTypes[secondChoice](
    `${regionId}.location_${increment + 1}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var pathFromNorthwestToEast = new horizontalPath(
    `${regionId}.path_${increment + 2}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var thirdChoice = Math.floor(Math.random() * randomTypes.length);
  var thirdRandomLocation = new randomTypes[thirdChoice](
    `${regionId}.location_${increment + 2}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var northernPathToEntrance = new verticalPath(
    `${regionId}.path_${increment + 3}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var pathFromNorthToEast = new horizontalPath(
    `${regionId}.path_${increment + 3}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var fourthChoice = Math.floor(Math.random() * randomTypes.length);
  var fourthRandomLocation = new randomTypes[fourthChoice](
    `${regionId}.location_${increment + 3}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var pathFromNortheastToSouth = new verticalPath(
    `${regionId}.path_${increment + 4}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var fifthChoice = Math.floor(Math.random() * randomTypes.length);
  var fifthRandomLocation = new randomTypes[fifthChoice](
    `${regionId}.location_${increment + 4}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var easternPathToEntrance = new horizontalPath(
    `${regionId}.path_${increment + 5}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var pathFromEastToSouth = new verticalPath(
    `${regionId}.path_${increment + 6}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var sixthChoice = Math.floor(Math.random() * randomTypes.length);
  var sixthRandomLocation = new randomTypes[sixthChoice](
    `${regionId}.location_${increment + 5}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var pathFromSouthEastToSouth = new horizontalPath(
    `${regionId}.path_${increment + 7}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var seventhChoice = Math.floor(Math.random() * randomTypes.length);
  var seventhRandomLocation = new randomTypes[seventhChoice](
    `${regionId}.location_${increment + 6}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var pathFromWestToSouthwest = new verticalPath(
    `${regionId}.path_${increment + 8}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var eighthChoice = Math.floor(Math.random() * randomTypes.length);
  var eighthRandomLocation = new randomTypes[eighthChoice](
    `${regionId}.location_${increment + 7}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var pathFromSouthwestToNorth = new horizontalPath(
    `${regionId}.path_${increment + 9}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var pathFromSouthToCenter = new verticalPath(
    `${regionId}.path_${increment + 10}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var center = new Crossroads(
    `${regionId}.location_${increment + 8}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var pathFromWestToCenter = new horizontalPath(
    `${regionId}.path_${increment + 11}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var pathFromEastToCenter = new horizontalPath(
    `${regionId}.path_${increment + 12}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var pathFromNorthToCenter = new verticalPath(
    `${regionId}.path_${increment + 13}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var southernPathToEntrance = new verticalPath(
    `${regionId}.path_${increment + 14}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var easternEntrance = new horizontalEntrance(
    `${regionId}.entrance_${increment + 1}`
  );
  var northernEntrance = new verticalEntrance(
    `${regionId}.entrance_${increment + 2}`
  );
  var southernEntrance = new verticalEntrance(
    `${regionId}.entrance_${increment + 3}`
  );
  southernPathToEntrance.exits = {
    north: seventhRandomLocation.id,
    south: southernEntrance.id,
  };
  southernEntrance.exits = {
    north: southernPathToEntrance.id,
  };
  westernEntrance.exits = {
    east: westernPath.id,
  };
  westernPath.exits = {
    west: westernEntrance.id,
    east: firstRandomLocation.id,
  };
  firstRandomLocation.exits = {
    west: westernPath.id,
    east: pathFromWestToCenter.id,
    north: pathFromWestToNorthwest.id,
    south: pathFromSouthwestToNorth.id,
  };
  firstRandomLocation.description =
    firstRandomLocation.description +
    " " +
    `The ${type} path continues in all directions.`;
  pathFromWestToNorthwest.exits = {
    north: secondRandomLocation.id,
    south: firstRandomLocation.id,
  };
  secondRandomLocation.exits = {
    south: pathFromWestToNorthwest.id,
    east: pathFromNorthwestToEast.id,
  };
  secondRandomLocation.description =
    secondRandomLocation.description +
    " " +
    `The ${type} path continues to the south and east.`;
  pathFromNorthwestToEast.exits = {
    west: secondRandomLocation.id,
    east: thirdRandomLocation.id,
  };
  thirdRandomLocation.exits = {
    west: pathFromNorthwestToEast.id,
    north: northernPathToEntrance.id,
    east: pathFromNorthToEast.id,
    south: pathFromNorthToCenter.id,
  };
  thirdRandomLocation.description =
    thirdRandomLocation.description +
    " " +
    `The ${type} path continues in all directions.`;
  northernPathToEntrance.exits = {
    south: thirdRandomLocation.id,
    north: northernEntrance.id,
  };
  northernEntrance.exits = {
    south: northernPathToEntrance.id,
  };
  pathFromNorthToEast.exits = {
    west: thirdRandomLocation.id,
    east: fourthRandomLocation.id,
  };
  fourthRandomLocation.exits = {
    west: pathFromNorthToEast.id,
    south: pathFromNortheastToSouth.id,
  };
  fourthRandomLocation.description =
    fourthRandomLocation.description +
    " " +
    `The ${type} path continues to the west and south.`;
  pathFromNortheastToSouth.exits = {
    north: fourthRandomLocation.id,
    south: fifthRandomLocation.id,
  };
  fifthRandomLocation.exits = {
    north: pathFromNortheastToSouth.id,
    east: easternPathToEntrance.id,
    south: pathFromEastToSouth.id,
    west: pathFromEastToCenter.id,
  };
  fifthRandomLocation.description =
    fifthRandomLocation.description +
    " " +
    `The ${type} path continues in all directions.`;
  easternPathToEntrance.exits = {
    west: fifthRandomLocation.id,
    east: easternEntrance.id,
  };
  easternEntrance.exits = {
    west: easternPathToEntrance.id,
  };
  pathFromEastToSouth.exits = {
    north: fifthRandomLocation.id,
    south: sixthRandomLocation.id,
  };
  sixthRandomLocation.exits = {
    north: pathFromEastToSouth.id,
    west: pathFromSouthEastToSouth.id,
  };
  sixthRandomLocation.description =
    sixthRandomLocation.description +
    " " +
    `The ${type} path continues to the north and west.`;
  pathFromSouthEastToSouth.exits = {
    east: sixthRandomLocation.id,
    west: seventhRandomLocation.id,
  };
  seventhRandomLocation.exits = {
    north: pathFromSouthToCenter.id,
    east: pathFromSouthEastToSouth.id,
    west: pathFromSouthwestToNorth.id,
    south: southernPathToEntrance.id,
  };
  seventhRandomLocation.description =
    seventhRandomLocation.description +
    " " +
    `The ${type} path continues in all directions.`;
  pathFromWestToSouthwest.exits = {
    east: seventhRandomLocation.id,
    west: eighthRandomLocation.id,
  };
  eighthRandomLocation.exits = {
    east: pathFromWestToSouthwest.id,
    north: pathFromSouthwestToNorth.id,
  };
  eighthRandomLocation.description =
    eighthRandomLocation.description +
    " " +
    `The ${type} path continues to the east and north.`;
  pathFromSouthToCenter.exits = {
    west: pathFromSouthwestToNorth.id,
    east: center.id,
  };
  center.exits = {
    west: pathFromSouthToCenter.id,
    east: pathFromEastToCenter.id,
    north: pathFromNorthToCenter.id,
    south: pathFromSouthToCenter.id,
  };
  pathFromWestToCenter.exits = {
    west: westernPath.id,
    east: center.id,
  };
  pathFromEastToCenter.exits = {
    west: center.id,
    east: easternPathToEntrance.id,
  };
  pathFromNorthToCenter.exits = {
    north: northernPathToEntrance.id,
    south: center.id,
  };
  easternEntrance.exits = {
    east: easternPathToEntrance.id,
  };
  northernEntrance.exits = {
    north: northernPathToEntrance.id,
  };
  southernEntrance.exits = {
    south: southernPathToEntrance.id,
  };
  var locationObjects = {};
  locationObjects[`path_${increment}`] = westernPath;
  locationObjects[`location_${increment}`] = firstRandomLocation;
  locationObjects[`path_${increment + 1}`] = pathFromWestToNorthwest;
  locationObjects[`location_${increment + 1}`] = secondRandomLocation;
  locationObjects[`path_${increment + 2}`] = pathFromNorthwestToEast;
  locationObjects[`location_${increment + 2}`] = thirdRandomLocation;
  locationObjects[`path_${increment + 3}`] = pathFromNorthToEast;
  locationObjects[`location_${increment + 3}`] = fourthRandomLocation;
  locationObjects[`path_${increment + 4}`] = pathFromNortheastToSouth;
  locationObjects[`path_${increment + 5}`] = easternPathToEntrance;
  locationObjects[`location_${increment + 4}`] = fifthRandomLocation;
  locationObjects[`path_${increment + 6}`] = pathFromEastToSouth;
  locationObjects[`location_${increment + 5}`] = sixthRandomLocation;
  locationObjects[`path_${increment + 7}`] = pathFromSouthEastToSouth;
  locationObjects[`location_${increment + 6}`] = seventhRandomLocation;
  locationObjects[`path_${increment + 8}`] = pathFromWestToSouthwest;
  locationObjects[`location_${increment + 7}`] = eighthRandomLocation;
  locationObjects[`path_${increment + 9}`] = pathFromSouthwestToNorth;
  locationObjects[`path_${increment + 10}`] = pathFromSouthToCenter;
  locationObjects[`location_${increment + 8}`] = center;
  locationObjects[`path_${increment + 11}`] = pathFromWestToCenter;
  locationObjects[`path_${increment + 12}`] = pathFromEastToCenter;
  locationObjects[`path_${increment + 13}`] = pathFromNorthToCenter;
  locationObjects[`entrance_${increment}`] = westernEntrance;
  locationObjects[`entrance_${increment + 1}`] = easternEntrance;
  locationObjects[`entrance_${increment + 2}`] = northernEntrance;
  locationObjects[`entrance_${increment + 3}`] = southernEntrance;
  mapGrid[targetTile[0]][targetTile[1]] = {};
  mapGrid[targetTile[0]][targetTile[1]][regionId] = locationObjects;
}

function generateParagonCityTile(mapGrid, targetTile, unknownShoreCoords) {
  var regionId = `paragonCityTile`;
  var increment = getIncrement(mapGrid, `${regionId}.entrance`);
  var locationObjects = {};
  var northernCityEntrance = new NorthernCityEntrance(
    `${regionId}.entrance_${increment}`
  );
  var southernCityEntrance = new SouthernCityEntrance(
    `${regionId}.entrance_${increment + 1}`
  );
  var easternCityEntrance = new EasternCityEntrance(
    `${regionId}.entrance_${increment + 2}`
  );
  var westernCityEntrance = new WesternCityEntrance(
    `${regionId}.entrance_${increment + 3}`
  );
  var cityStreetFromNorth = new ShortVerticalCityStreet(`${regionId}.cityStreetFromNorth`);
  var cityStreetFromSouth = new ShortVerticalCityStreet(`${regionId}.cityStreetFromSouth`);
  var cityStreetFromEast = new ShortHorizontalCityStreet(`${regionId}.cityStreetFromEast`);
  var cityStreetFromWest = new ShortHorizontalCityStreet(`${regionId}.cityStreetFromWest`);
  var importedLocations = require("./class_collections/locations/paragon_city/paragon_city");
  for (var key in importedLocations) {
    if (typeof importedLocations[key] == "function") {
      delete importedLocations[key];
    }
  }
  northernCityEntrance.exits = {
    south: cityStreetFromNorth.id,
  };
  southernCityEntrance.exits = {
    north: cityStreetFromSouth.id,
  };
  easternCityEntrance.exits = {
    west: cityStreetFromEast.id,
  };
  westernCityEntrance.exits = {
    east: cityStreetFromWest.id,
  };
  cityStreetFromNorth.exits = {
    north: northernCityEntrance.id,
    south: `${regionId}.northernCustomsCheckpoint`,
  };
  cityStreetFromSouth.exits = {
    north: `${regionId}.southernCustomsCheckpoint`,
    south: southernCityEntrance.id,
  };
  cityStreetFromEast.exits = {
    east: easternCityEntrance.id,
    west: `${regionId}.easternCustomsCheckpoint`,
  };
  cityStreetFromWest.exits = {
    east: `${regionId}.westernCustomsCheckpoint`,
    west: westernCityEntrance.id,
  };
  locationObjects[`entrance_${increment}`] = northernCityEntrance;
  locationObjects[`entrance_${increment + 1}`] = southernCityEntrance;
  locationObjects[`entrance_${increment + 2}`] = easternCityEntrance;
  locationObjects[`entrance_${increment + 3}`] = westernCityEntrance;
  locationObjects[`cityStreetFromNorth`] = cityStreetFromNorth;
  locationObjects[`cityStreetFromSouth`] = cityStreetFromSouth;
  locationObjects[`cityStreetFromEast`] = cityStreetFromEast;
  locationObjects[`cityStreetFromWest`] = cityStreetFromWest;
  for (var key in importedLocations) {
    var id = key.split(".")[1];
    locationObjects[id] = importedLocations[key];
  }
  mapGrid[targetTile[0]][targetTile[1]] = {};
  mapGrid[targetTile[0]][targetTile[1]][regionId] = locationObjects;
}

function generateRiverTile(mapGrid, targetTile, unknownShoreCoords) {
  var regionIncrement = getIncrement(mapGrid, "river");
  var regionId = `riverTile_${regionIncrement}`;
  var increment = getIncrement(mapGrid, `${regionId}.entrance`);
  var locationObjects = {};
  var westernRiverEntrance = new HorizontalRiverEntrance(
    `${regionId}.entrance_${increment}`
  );
  var easternRiverEntrance = new HorizontalRiverEntrance(
    `${regionId}.entrance_${increment + 1}`
  );
  var northernRiverEntrance = new VerticalRiverEntrance(
    `${regionId}.entrance_${increment + 2}`
  );
  var southernRiverEntrance = new VerticalRiverEntrance(
    `${regionId}.entrance_${increment + 3}`
  );
  var westToEastSegment_01 = new ThickHorizontalBridge(
    `${regionId}.path_${increment}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var westToEastSegment_02 = new ThinHorizontalBridge(
    `${regionId}.path_${increment + 1}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var westToEastSegment_03 = new ThickHorizontalBridge(
    `${regionId}.path_${increment + 2}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var westToEastSegment_04 = new ThinHorizontalBridge(
    `${regionId}.path_${increment + 3}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var westToEastSegment_05 = new ThickHorizontalBridge(
    `${regionId}.path_${increment + 4}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var northToSouthSegment_01 = new ThickVerticalBridge(
    `${regionId}.path_${increment + 5}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var northToSouthSegment_02 = new ThinVerticalBridge(
    `${regionId}.path_${increment + 6}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var northToSouthSegment_03 = new ThickVerticalBridge(
    `${regionId}.path_${increment + 7}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var northToSouthSegment_04 = new ThinVerticalBridge(
    `${regionId}.path_${increment + 8}`,
    getTier(targetTile, unknownShoreCoords)
  );
  var northToSouthSegment_05 = new ThickVerticalBridge(
    `${regionId}.path_${increment + 9}`,
    getTier(targetTile, unknownShoreCoords)
  );
  westernRiverEntrance.exits = {
    east: westToEastSegment_01.id,
  };
  westToEastSegment_01.exits = {
    west: westernRiverEntrance.id,
    east: westToEastSegment_02.id,
  };
  westToEastSegment_02.exits = {
    west: westToEastSegment_01.id,
    east: westToEastSegment_03.id,
  };
  westToEastSegment_03.exits = {
    west: westToEastSegment_02.id,
    east: westToEastSegment_04.id,
  };
  westToEastSegment_04.exits = {
    west: westToEastSegment_03.id,
    east: westToEastSegment_05.id,
  };
  westToEastSegment_05.exits = {
    west: westToEastSegment_04.id,
    east: easternRiverEntrance.id,
  };
  easternRiverEntrance.exits = {
    west: westToEastSegment_05.id,
  };
  northernRiverEntrance.exits = {
    south: northToSouthSegment_01.id,
  };
  northToSouthSegment_01.exits = {
    north: northernRiverEntrance.id,
    south: northToSouthSegment_02.id,
  };
  northToSouthSegment_02.exits = {
    north: northToSouthSegment_01.id,
    south: northToSouthSegment_03.id,
  };
  northToSouthSegment_03.exits = {
    north: northToSouthSegment_02.id,
    south: northToSouthSegment_04.id,
  };
  northToSouthSegment_04.exits = {
    north: northToSouthSegment_03.id,
    south: northToSouthSegment_05.id,
  };
  northToSouthSegment_05.exits = {
    north: northToSouthSegment_04.id,
    south: southernRiverEntrance.id,
  };
  southernRiverEntrance.exits = {
    north: northToSouthSegment_05.id,
  };
  locationObjects[`entrance_${increment}`] = westernRiverEntrance;
  locationObjects[`entrance_${increment + 1}`] = easternRiverEntrance;
  locationObjects[`entrance_${increment + 2}`] = northernRiverEntrance;
  locationObjects[`entrance_${increment + 3}`] = southernRiverEntrance;
  locationObjects[`path_${increment}`] = westToEastSegment_01;
  locationObjects[`path_${increment + 1}`] = westToEastSegment_02;
  locationObjects[`path_${increment + 2}`] = westToEastSegment_03;
  locationObjects[`path_${increment + 3}`] = westToEastSegment_04;
  locationObjects[`path_${increment + 4}`] = westToEastSegment_05;
  locationObjects[`path_${increment + 5}`] = northToSouthSegment_01;
  locationObjects[`path_${increment + 6}`] = northToSouthSegment_02;
  locationObjects[`path_${increment + 7}`] = northToSouthSegment_03;
  locationObjects[`path_${increment + 8}`] = northToSouthSegment_04;
  locationObjects[`path_${increment + 9}`] = northToSouthSegment_05;
  mapGrid[targetTile[0]][targetTile[1]] = {};
  mapGrid[targetTile[0]][targetTile[1]][regionId] = locationObjects;
}

function generateUnknownShoreTile(mapGrid, targetTile) {
  var regionId = `unknownShore`;
  var increment = getIncrement(mapGrid, `${regionId}.entrance`);
  var locationObjects = {};
  var westernUnknownShoreEntrance = new HorizontalUnknownShoreEntrance(
    `${regionId}.entrance_${increment}`
  );
  var easternUnknownShoreEntrance = new HorizontalUnknownShoreEntrance(
    `${regionId}.entrance_${increment + 1}`
  );
  var northernUnknownShoreEntrance = new VerticalUnknownShoreEntrance(
    `${regionId}.entrance_${increment + 2}`
  );
  var southernUnknownShoreEntrance = new VerticalUnknownShoreEntrance(
    `${regionId}.entrance_${increment + 3}`
  );
  locationObjects[`entrance_${increment}`] = westernUnknownShoreEntrance;
  locationObjects[`entrance_${increment + 1}`] = easternUnknownShoreEntrance;
  locationObjects[`entrance_${increment + 2}`] = northernUnknownShoreEntrance;
  locationObjects[`entrance_${increment + 3}`] = southernUnknownShoreEntrance;
  var center = Math.floor(mapGrid.length / 2);
  var xDistance = Math.abs(center - targetTile[0]);
  var yDistance = Math.abs(center - targetTile[1]);
  var center = Math.floor(mapGrid.length / 2);
  var xDistance = Math.abs(center - targetTile[0]);
  var yDistance = Math.abs(center - targetTile[1]);
  if (yDistance > xDistance) {
    if (targetTile[1] < center) {
      var direction = "north";
    } else {
      var direction = "south";
    }
  } else {
    if (targetTile[0] < center) {
      var direction = "west";
    } else {
      var direction = "east";
    }
  }
  switch (direction) {
    case "north":
      rockyBeach.exits = {
        west: firstBeach.id,
        east: secondBeach.id,
        south: forestPath_01.id,
      };
      rockyBeach.height = 20.5;
      rockyBeach.width = 40.5;
      rockyBeach.description =
        rockyBeach.description +
        " " +
        "The beach continues to the east and west, and a forest path leads south. The ocean is to the north.";
      firstBeach.exits = {
        east: rockyBeach.id,
      };
      firstBeach.height = 10.5;
      firstBeach.width = 20.5;
      firstBeach.description =
        firstBeach.description + " " + "The beach continues to the east.";
      secondBeach.exits = {
        west: rockyBeach.id,
      };
      secondBeach.height = 10.5;
      secondBeach.width = 20.5;
      secondBeach.description =
        secondBeach.description + " " + "The beach continues to the west.";
      forestPath_01.exits = {
        north: rockyBeach.id,
        south: clearing_01.id,
      };
      forestPath_01.height = 40.5;
      forestPath_01.width = 10.5;
      forestPath_01.name = "Forest/Path";
      forestPath_01.description =
        forestPath_01.description + "south and a rocky beach to the north.";
      clearing_01.exits = {
        north: forestPath_01.id,
        west: travelingMerchant.id,
        east: oldTreeStump.id,
        south: forestPath_02.id,
      };
      clearing_01.description =
        clearing_01.description +
        " " +
        "There is a forest path to the north and south, a traveling merchant to the west, and an old tree stump to the east.";
      travelingMerchant.exits = {
        east: clearing_01.id,
      };
      travelingMerchant.description =
        travelingMerchant.description +
        " " +
        "There is a clearing to the east.";
      oldTreeStump.exits = {
        west: clearing_01.id,
      };
      oldTreeStump.description =
        oldTreeStump.description + " " + "There is a clearing to the west.";
      forestPath_02.exits = {
        north: clearing_01.id,
        south: clearing_02.id,
      };
      forestPath_02.height = 40.5;
      forestPath_02.width = 10.5;
      forestPath_02.name = "Forest/Path";
      forestPath_02.description =
        forestPath_02.description + "a clearing to the north and south.";
      clearing_02.exits = {
        north: forestPath_02.id,
        south: southernUnknownShoreEntrance.id,
      };
      clearing_02.description =
        clearing_02.description +
        " " +
        "There is a forest path to the north and south.";
      westernUnknownShoreEntrance.exits = {
        east: firstBeach.id,
      };
      easternUnknownShoreEntrance.exits = {
        west: secondBeach.id,
      };
      northernUnknownShoreEntrance.exits = {
        south: rockyBeach.id,
      };
      southernUnknownShoreEntrance.exits = {
        north: clearing_02.id,
      };
      break;
    case "south":
      rockyBeach.exits = {
        west: firstBeach.id,
        east: secondBeach.id,
        north: forestPath_01.id,
      };
      rockyBeach.height = 20.5;
      rockyBeach.width = 40.5;
      rockyBeach.description =
        rockyBeach.description +
        " " +
        "The beach continues to the east and west, and a forest path leads north. The ocean is to the south.";
      firstBeach.exits = {
        east: rockyBeach.id,
      };
      firstBeach.height = 10.5;
      firstBeach.width = 20.5;
      firstBeach.description =
        firstBeach.description + " " + "The beach continues to the east.";
      secondBeach.exits = {
        west: rockyBeach.id,
      };
      secondBeach.height = 10.5;
      secondBeach.width = 20.5;
      secondBeach.description =
        secondBeach.description + " " + "The beach continues to the west.";
      forestPath_01.exits = {
        south: rockyBeach.id,
        north: clearing_01.id,
      };
      forestPath_01.height = 40.5;
      forestPath_01.width = 10.5;
      forestPath_01.name = "Forest/Path";
      forestPath_01.description =
        forestPath_01.description + "north and a rocky beach to the south.";
      clearing_01.exits = {
        south: forestPath_01.id,
        west: travelingMerchant.id,
        east: oldTreeStump.id,
        north: forestPath_02.id,
      };
      clearing_01.description =
        clearing_01.description +
        " " +
        "There is a forest path to the south and north, a traveling merchant to the west, and an old tree stump to the east.";
      travelingMerchant.exits = {
        east: clearing_01.id,
      };
      travelingMerchant.description =
        travelingMerchant.description +
        " " +
        "There is a clearing to the east.";
      oldTreeStump.exits = {
        west: clearing_01.id,
      };
      oldTreeStump.description =
        oldTreeStump.description + " " + "There is a clearing to the west.";
      forestPath_02.exits = {
        south: clearing_01.id,
        north: clearing_02.id,
      };
      forestPath_02.height = 40.5;
      forestPath_02.width = 10.5;
      forestPath_02.name = "Forest/Path";
      forestPath_02.description =
        forestPath_02.description + "a clearing to the south and north.";
      clearing_02.exits = {
        south: forestPath_02.id,
        north: northernUnknownShoreEntrance.id,
      };
      clearing_02.description =
        clearing_02.description +
        " " +
        "There is a forest path to the south and north.";
      westernUnknownShoreEntrance.exits = {
        east: firstBeach.id,
      };
      easternUnknownShoreEntrance.exits = {
        west: secondBeach.id,
      };
      northernUnknownShoreEntrance.exits = {
        south: clearing_02.id,
      };
      southernUnknownShoreEntrance.exits = {
        north: rockyBeach.id,
      };
      break;
    case "east":
      rockyBeach.exits = {
        north: firstBeach.id,
        south: secondBeach.id,
        west: forestPath_01.id,
      };
      rockyBeach.height = 40.5;
      rockyBeach.width = 20.5;
      rockyBeach.description =
        rockyBeach.description +
        " " +
        "The beach continues to the north and south, and a forest path leads west. The ocean is to the east.";
      firstBeach.exits = {
        south: rockyBeach.id,
      };
      firstBeach.height = 20.5;
      firstBeach.width = 10.5;
      firstBeach.name = "First/Beach";
      firstBeach.description =
        firstBeach.description + " " + "The beach continues to the south.";
      secondBeach.exits = {
        north: rockyBeach.id,
      };
      secondBeach.height = 20.5;
      secondBeach.width = 10.5;
      secondBeach.name = "Second/Beach";
      secondBeach.description =
        secondBeach.description + " " + "The beach continues to the north.";
      forestPath_01.exits = {
        west: rockyBeach.id,
        east: clearing_01.id,
      };
      forestPath_01.height = 10.5;
      forestPath_01.width = 40.5;
      forestPath_01.description =
        forestPath_01.description + "east and a rocky beach to the west.";
      clearing_01.exits = {
        east: forestPath_01.id,
        north: travelingMerchant.id,
        south: oldTreeStump.id,
        west: forestPath_02.id,
      };
      clearing_01.description =
        clearing_01.description +
        " " +
        "There is a forest path to the east and west, a traveling merchant to the north, and an old tree stump to the south.";
      travelingMerchant.exits = {
        south: clearing_01.id,
      };
      travelingMerchant.description =
        travelingMerchant.description +
        " " +
        "There is a clearing to the south.";
      oldTreeStump.exits = {
        north: clearing_01.id,
      };
      oldTreeStump.description =
        oldTreeStump.description + " " + "There is a clearing to the north.";
      forestPath_02.exits = {
        east: clearing_01.id,
        west: clearing_02.id,
      };
      forestPath_02.height = 10.5;
      forestPath_02.width = 40.5;
      forestPath_02.description =
        forestPath_02.description + "a clearing to the east and west.";
      clearing_02.exits = {
        east: forestPath_02.id,
        west: westernUnknownShoreEntrance.id,
      };
      westernUnknownShoreEntrance.exits = {
        east: clearing_02.id,
      };
      easternUnknownShoreEntrance.exits = {
        west: rockyBeach.id,
      };
      northernUnknownShoreEntrance.exits = {
        south: firstBeach.id,
      };
      southernUnknownShoreEntrance.exits = {
        north: secondBeach.id,
      };
      break;
    case "west":
      rockyBeach.exits = {
        north: firstBeach.id,
        south: secondBeach.id,
        east: forestPath_01.id,
      };
      rockyBeach.height = 40.5;
      rockyBeach.width = 20.5;
      rockyBeach.description =
        rockyBeach.description +
        " " +
        "The beach continues to the north and south, and a forest path leads east. The ocean is to the west.";
      firstBeach.exits = {
        south: rockyBeach.id,
      };
      firstBeach.height = 20.5;
      firstBeach.width = 10.5;
      firstBeach.name = "First/Beach";
      firstBeach.description =
        firstBeach.description + " " + "The beach continues to the south.";
      secondBeach.exits = {
        north: rockyBeach.id,
      };
      secondBeach.height = 20.5;
      secondBeach.width = 10.5;
      secondBeach.name = "Second/Beach";
      secondBeach.description =
        secondBeach.description + " " + "The beach continues to the north.";
      forestPath_01.exits = {
        east: rockyBeach.id,
        west: clearing_01.id,
      };
      forestPath_01.height = 10.5;
      forestPath_01.width = 40.5;
      forestPath_01.description =
        forestPath_01.description + "west and a rocky beach to the east.";
      clearing_01.exits = {
        west: forestPath_01.id,
        north: travelingMerchant.id,
        south: oldTreeStump.id,
        east: forestPath_02.id,
      };
      clearing_01.description =
        clearing_01.description +
        " " +
        "There is a forest path to the west and east, a traveling merchant to the north, and an old tree stump to the south.";
      travelingMerchant.exits = {
        south: clearing_01.id,
      };
      travelingMerchant.description =
        travelingMerchant.description +
        " " +
        "There is a clearing to the south.";
      oldTreeStump.exits = {
        north: clearing_01.id,
      };
      oldTreeStump.description =
        oldTreeStump.description + " " + "There is a clearing to the north.";
      forestPath_02.exits = {
        west: clearing_01.id,
        east: clearing_02.id,
      };
      forestPath_02.height = 10.5;
      forestPath_02.width = 40.5;
      forestPath_02.description =
        forestPath_02.description + "a clearing to the west and east.";
      clearing_02.exits = {
        west: forestPath_02.id,
        east: easternUnknownShoreEntrance.id,
      };
      westernUnknownShoreEntrance.exits = {
        west: clearing_02.id,
      };
      easternUnknownShoreEntrance.exits = {
        east: rockyBeach.id,
      };
      northernUnknownShoreEntrance.exits = {
        south: firstBeach.id,
      };
      southernUnknownShoreEntrance.exits = {
        north: secondBeach.id,
      };
      break;
  }
  mapGrid[targetTile[0]][targetTile[1]] = {};
  locationObjects["rockyBeach"] = rockyBeach;
  locationObjects["firstBeach"] = firstBeach;
  locationObjects["secondBeach"] = secondBeach;
  locationObjects["forestPath_01"] = forestPath_01;
  locationObjects["clearing_01"] = clearing_01;
  locationObjects["travelingMerchant"] = travelingMerchant;
  locationObjects["oldTreeStump"] = oldTreeStump;
  locationObjects["forestPath_02"] = forestPath_02;
  locationObjects["clearing_02"] = clearing_02;
  mapGrid[targetTile[0]][targetTile[1]][regionId] = locationObjects;
}

function linkRegions(mapGrid) {
  for (let i = 0; i < mapGrid.length; i++) {
    for (let j = 0; j < mapGrid[i].length; j++) {
      try {
        var room = mapGrid[i][j];
        var keys = Object.keys(room);
        for (let k = 0; k < keys.length; k++) {
          var secondaryRoom = room[keys[k]];
          var secondaryKeys = Object.keys(secondaryRoom);
          for (let l = 0; l < secondaryKeys.length; l++) {
            var primaryId = secondaryRoom[secondaryKeys[l]].id;
            if (
              primaryId.includes("entrance") ||
              primaryId.includes("oceanTile")
            ) {
              if (primaryId.includes("1") || primaryId.includes("oceanTile")) {
                if (j > 0) {
                  var westernRoom = mapGrid[i][j - 1];
                  var westernKeys = Object.keys(westernRoom);
                  for (let m = 0; m < westernKeys.length; m++) {
                    var westernSecondaryRoom = westernRoom[westernKeys[m]];
                    var westernSecondaryKeys =
                      Object.keys(westernSecondaryRoom);
                    for (let n = 0; n < westernSecondaryKeys.length; n++) {
                      var westernId =
                        westernSecondaryRoom[westernSecondaryKeys[n]].id;
                      if (
                        westernId.includes("entrance") ||
                        westernId.includes("oceanTile")
                      ) {
                        secondaryRoom[secondaryKeys[l]].exits["west"] =
                          westernSecondaryRoom[westernSecondaryKeys[n]].id;
                      }
                    }
                  }
                }
              }
              if (primaryId.includes("2") || primaryId.includes("oceanTile")) {
                if (j < mapGrid[i].length - 1) {
                  var easternRoom = mapGrid[i][j + 1];
                  var easternKeys = Object.keys(easternRoom);
                  for (let m = 0; m < easternKeys.length; m++) {
                    var easternSecondaryRoom = easternRoom[easternKeys[m]];
                    var easternSecondaryKeys =
                      Object.keys(easternSecondaryRoom);
                    for (let n = 0; n < easternSecondaryKeys.length; n++) {
                      var easternId =
                        easternSecondaryRoom[easternSecondaryKeys[n]].id;
                      if (
                        easternId.includes("entrance") ||
                        easternId.includes("oceanTile")
                      ) {
                        secondaryRoom[secondaryKeys[l]].exits["east"] =
                          easternSecondaryRoom[easternSecondaryKeys[n]].id;
                      }
                    }
                  }
                }
              }
              if (primaryId.includes("3") || primaryId.includes("oceanTile")) {
                if (i > 0) {
                  var northernRoom = mapGrid[i - 1][j];
                  var northernKeys = Object.keys(northernRoom);
                  for (let m = 0; m < northernKeys.length; m++) {
                    var northernSecondaryRoom = northernRoom[northernKeys[m]];
                    var northernSecondaryKeys = Object.keys(
                      northernSecondaryRoom
                    );
                    for (let n = 0; n < northernSecondaryKeys.length; n++) {
                      var northernId =
                        northernSecondaryRoom[northernSecondaryKeys[n]].id;
                      if (
                        northernId.includes("entrance") ||
                        northernId.includes("oceanTile")
                      ) {
                        secondaryRoom[secondaryKeys[l]].exits["north"] =
                          northernSecondaryRoom[northernSecondaryKeys[n]].id;
                      }
                    }
                  }
                }
              }
              if (primaryId.includes("4") || primaryId.includes("oceanTile")) {
                if (i < mapGrid.length - 1) {
                  var southernRoom = mapGrid[i + 1][j];
                  var southernKeys = Object.keys(southernRoom);
                  for (let m = 0; m < southernKeys.length; m++) {
                    var southernSecondaryRoom = southernRoom[southernKeys[m]];
                    var southernSecondaryKeys = Object.keys(
                      southernSecondaryRoom
                    );
                    for (let n = 0; n < southernSecondaryKeys.length; n++) {
                      var southernId =
                        southernSecondaryRoom[southernSecondaryKeys[n]].id;
                      if (
                        southernId.includes("entrance") ||
                        southernId.includes("oceanTile")
                      ) {
                        secondaryRoom[secondaryKeys[l]].exits["south"] =
                          southernSecondaryRoom[southernSecondaryKeys[n]].id;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        continue;
      }
    }
  }
}

module.exports = {
  generateMap,
  mapGrid,
};
