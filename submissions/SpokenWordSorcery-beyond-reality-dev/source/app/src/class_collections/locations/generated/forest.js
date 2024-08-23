const { Room } = require("../room");

class HorizontalForestEntrance extends Room {
  constructor(id) {
    super(
      "Forest/Entrance",
      id,
      "The forest is dark and foreboding, with a thick canopy blocking out the sun. The path leads to the east and west.",
      20.5,
      40.5
    );
    this.items = {};
    this.exits = {};
    this.type = "horizontalForestEntrance";
  }
}

class VerticalForestEntrance extends Room {
  constructor(id) {
    super(
      "Forest Entrance",
      id,
      "The forest is dark and foreboding, with a thick canopy blocking out the sun. The path leads to the north and south.",
      40.5,
      20.5
    );
    this.items = {};
    this.exits = {};
    this.type = "verticalForestEntrance";
  }
}

class HorizontalForestPath extends Room {
  constructor(id, tier) {
    super(
      "Forest Path",
      id,
      "The forest path winds through the trees for a long way, leading to different areas to the east and west.",
      40.5,
      10.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "horizontalForestPath";
  }
}

class VerticalForestPath extends Room {
  constructor(id, tier) {
    super(
      "Forest/Path",
      id,
      "The forest path winds through the trees for a long way, leading to different areas to the north and south.",
      10.5,
      40.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "verticalForestPath";
  }
}

class SmallClearing extends Room {
  constructor(id, tier) {
    super(
      "Small/Clearing",
      id,
      "The clearing is a small, open area surrounded by trees.",
      20.5,
      20.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "smallClearing";
  }
}

class LargeClearing extends Room {
  constructor(id, tier) {
    super(
      "Large/Clearing",
      id,
      "The clearing is a large, open area surrounded by trees.",
      40.5,
      40.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "largeClearing";
  }
}

class Crossroads extends Room {
  constructor(id, tier) {
    super(
      "Crossroads",
      id,
      "The forest path leads to the north, south, east, and west.",
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
  HorizontalForestEntrance,
  VerticalForestEntrance,
  HorizontalForestPath,
  VerticalForestPath,
  SmallClearing,
  LargeClearing,
  Crossroads,
};
