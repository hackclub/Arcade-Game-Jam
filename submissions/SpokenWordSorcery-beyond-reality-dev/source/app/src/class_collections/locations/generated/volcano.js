const { Room } = require("../room");

class HorizontalVolcanicEntrance extends Room {
  constructor(id) {
    super(
      "Volcanic Entrance",
      id,
      "The volcanic entrance is a dangerous place, with lava flows and volcanic ash. The path leads to the east and west.",
      20.5,
      40.5
    );
    this.items = {};
    this.exits = {};
    this.type = "horizontalVolcanicEntrance";
  }
}

class VerticalVolcanicEntrance extends Room {
  constructor(id) {
    super(
      "Volcanic Entrance",
      id,
      "The volcanic entrance is a dangerous place, with lava flows and volcanic ash. The path leads to the north and south.",
      40.5,
      20.5
    );
    this.items = {};
    this.exits = {};
    this.type = "verticalVolcanicEntrance";
  }
}

class HorizontalVolcanicPath extends Room {
  constructor(id, tier) {
    super(
      "Volcanic Path",
      id,
      "The volcanic path winds through the rocks for a long way, leading to different areas to the east and west.",
      40.5,
      10.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "horizontalVolcanicPath";
  }
}

class VerticalVolcanicPath extends Room {
  constructor(id, tier) {
    super(
      "Volcanic Path",
      id,
      "The volcanic path winds through the rocks for a long way, leading to different areas to the north and south.",
      10.5,
      40.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "verticalVolcanicPath";
  }
}

class LavaLake extends Room {
  constructor(id, tier) {
    super(
      "Lava Lake",
      id,
      "The lava lake is a swirling cauldron of fire and melted rock.",
      40.5,
      40.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "lavaLake";
  }
}

class LavaFlow extends Room {
  constructor(id, tier) {
    super(
      "Lava Flow",
      id,
      "The lava flow is a river of molten rock, flowing from the volcano.",
      40.5,
      40.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "lavaFlow";
  }
}

class LavaCave extends Room {
  constructor(id, tier) {
    super(
      "Lava Cave",
      id,
      "The lava cave is a dark, hot place, with glowing lava pools and steam vents.",
      40.5,
      40.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "lavaCave";
  }
}

module.exports = {
  HorizontalVolcanicEntrance,
  VerticalVolcanicEntrance,
  HorizontalVolcanicPath,
  VerticalVolcanicPath,
  LavaLake,
  LavaFlow,
  LavaCave,
};