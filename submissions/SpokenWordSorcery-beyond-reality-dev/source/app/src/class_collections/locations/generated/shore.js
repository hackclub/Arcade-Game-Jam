const { Room } = require("../room");

class VerticalShoreEntrance extends Room {
  constructor(id) {
    super(
      "Shore Entrance",
      id,
      "The shore is a long stretch of sand, with the ocean on one side and the land on the other.",
      40.5,
      20.5
    );
    this.items = {};
    this.exits = {};
    this.type = "verticalShoreEntrance";
  }
}

class HorizontalShoreEntrance extends Room {
  constructor(id) {
    super(
      "Shore Entrance",
      id,
      "The shore is a long stretch of sand, with the ocean on one side and the land on the other.",
      20.5,
      40.5
    );
    this.items = {};
    this.exits = {};
    this.type = "horizontalShoreEntrance";
  }
}

class HorizontalBeachPath extends Room {
  constructor(id, tier) {
    super(
      "Beach Path",
      id,
      "The beach path winds through the sand for a long way, leading to different areas to the east and west.",
      40.5,
      10.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "horizontalBeachPath";
  }
}

class VerticalBeachPath extends Room {
  constructor(id, tier) {
    super(
      "Beach Path",
      id,
      "The beach path winds through the sand for a long way, leading to different areas to the north and south.",
      10.5,
      40.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "verticalBeachPath";
  }
}

class Beach extends Room {
  constructor(id, tier) {
    super(
      "Beach",
      id,
      "The beach is a pleasant stretch of sand, and you can hear the sounds of crashing waves",
      20.5,
      20.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "beach";
  }
}

class Tidepool extends Room {
  constructor(id, tier) {
    super(
      "Tidepool",
      id,
      "The tidepool is a small pool of water left behind by the receding tide.",
      20.5,
      20.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "tidepool";
  }
}

class CoralReef extends Room {
  constructor(id, tier) {
    super(
      "Coral Reef",
      id,
      "The coral reef is a beautiful underwater garden of colorful coral and fish.",
      20.5,
      20.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "coralReef";
  }
}

module.exports = {
  VerticalShoreEntrance,
  HorizontalShoreEntrance,
  HorizontalBeachPath,
  VerticalBeachPath,
  Beach,
  Tidepool,
  CoralReef
};