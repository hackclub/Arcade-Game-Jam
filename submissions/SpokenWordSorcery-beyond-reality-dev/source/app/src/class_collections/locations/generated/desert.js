const { Room } = require("../room");

class HorizontalDesertEntrance extends Room {
  constructor(id) {
    super(
      "Desert Entrance",
      id,
      "The desert is a vast expanse of sand, stretching as far as the eye can see. The path leads to the east and west.",
      20.5,
      40.5
    );
    this.items = {};
    this.exits = {};
    this.type = "horizontalDesertEntrance";
  }
}

class VerticalDesertEntrance extends Room {
  constructor(id) {
    super(
      "Desert Entrance",
      id,
      "The desert is a vast expanse of sand, stretching as far as the eye can see. The path leads to the north and south.",
      40.5,
      20.5
    );
    this.items = {};
    this.exits = {};
    this.type = "verticalDesertEntrance";
  }
}

class HorizontalDesertPath extends Room {
  constructor(id, tier) {
    super(
      "Desert Path",
      id,
      "The desert path winds through the sand for a long way, leading to different areas to the east and west.",
      40.5,
      10.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "horizontalDesertPath";
  }
}

class VerticalDesertPath extends Room {
  constructor(id, tier) {
    super(
      "Desert Path",
      id,
      "The desert path winds through the sand for a long way, leading to different areas to the north and south.",
      10.5,
      40.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "verticalDesertPath";
  }
}

class SmallDunes extends Room {
  constructor(id, tier) {
    super(
      "Small Dunes",
      id,
      "There is a small collection of sand dunes in the area.",
      20.5,
      20.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "smallDunes";
  }
}

class LargeDunes extends Room {
  constructor(id, tier) {
    super(
      "Large Dunes",
      id,
      "There is a large collection of sand dunes in the area.",
      40.5,
      40.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "largeDunes";
  }
}

class SmallOasis extends Room {
  constructor(id, tier) {
    super(
      "Small Oasis",
      id,
      "There is a small oasis in the area.",
      20.5,
      20.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "smallOasis";
  }
}

class LargeOasis extends Room {
  constructor(id, tier) {
    super(
      "Large Oasis",
      id,
      "There is a large oasis in the area.",
      40.5,
      40.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "largeOasis";
  }
}

class Crossroads extends Room {
  constructor(id, tier) {
    super(
      "Crossroads",
      id,
      "The desert path leads to the north, south, east, and west.",
      40.5,
      40.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "crossroads";
  }
}

module.exports = {
  HorizontalDesertEntrance,
  VerticalDesertEntrance,
  HorizontalDesertPath,
  VerticalDesertPath,
  SmallDunes,
  LargeDunes,
  SmallOasis,
  LargeOasis,
  Crossroads
};