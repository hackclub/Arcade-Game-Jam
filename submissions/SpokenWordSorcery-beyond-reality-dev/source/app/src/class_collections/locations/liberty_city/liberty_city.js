const { Room } = require("../room");

class HorizontalLibertyCityEntrance extends Room {
  constructor(id) {
    super(
      "Liberty City Entrance",
      id,
      "The city entrance is a bustling place, with cars honking and people shouting. The path leads to the east and west.",
      20.5,
      40.5
    );
    this.items = {};
    this.exits = {};
    this.type = "horizontalLibertyCityEntrance";
  }
}

class VerticalLibertyCityEntrance extends Room {
  constructor(id) {
    super(
      "Liberty City Entrance",
      id,
      "The city entrance is a bustling place, with cars honking and people shouting. The path leads to the north and south.",
      40.5,
      20.5
    );
    this.items = {};
    this.exits = {};
    this.type = "verticalLibertyCityEntrance";
  }
}

class HorizontalLibertyCityPath extends Room {
  constructor(id, tier) {
    super(
      "Liberty City Path",
      id,
      "The city path winds through the buildings for a long way, leading to different areas to the east and west.",
      40.5,
      10.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "horizontalLibertyCityPath";
  }
}

class VerticalLibertyCityPath extends Room {
  constructor(id, tier) {
    super(
      "Liberty City Path",
      id,
      "The city path winds through the buildings for a long way, leading to different areas to the north and south.",
      10.5,
      40.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "verticalLibertyCityPath";
  }
}

class CitySquare extends Room {
  constructor(id, tier) {
    super(
      "City Square",
      id,
      "The city square is a bustling place, with people coming and going in all directions. The path leads to the north, south, east, and west.",
      20.5,
      20.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "citySquare";
  }
}

module.exports = {
  HorizontalLibertyCityEntrance,
  VerticalLibertyCityEntrance,
  HorizontalLibertyCityPath,
  VerticalLibertyCityPath,
  CitySquare,
};
