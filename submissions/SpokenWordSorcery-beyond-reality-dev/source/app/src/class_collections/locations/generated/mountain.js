const { Room } = require("../room");

class HorizontalMountainEntrance extends Room {
  constructor(id) {
    super(
      "Mountain Entrance",
      id,
      "The mountain path is a steep climb, with jagged rocks and loose gravel. The path leads to the east and west.",
      20.5,
      40.5
    );
    this.items = {};
    this.exits = {};
    this.type = "horizontalMountainEntrance";
  }
}

class VerticalMountainEntrance extends Room {
  constructor(id) {
    super(
      "Mountain Entrance",
      id,
      "The mountain path is a steep climb, with jagged rocks and loose gravel. The path leads to the north and south.",
      40.5,
      20.5
    );
    this.items = {};
    this.exits = {};
    this.type = "verticalMountainEntrance";
  }
}

class HorizontalMountainPath extends Room {
  constructor(id, tier) {
    super(
      "Mountain Path",
      id,
      "The mountain path winds through the rocks for a long way, leading to different areas to the east and west.",
      40.5,
      10.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "horizontalMountainPath";
  }
}

class VerticalMountainPath extends Room {
  constructor(id, tier) {
    super(
      "Mountain Path",
      id,
      "The mountain path winds through the rocks for a long way, leading to different areas to the north and south.",
      10.5,
      40.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "verticalMountainPath";
  }
}

class MountainPeak extends Room {
  constructor(id, tier) {
    super(
      "Mountain Peak",
      id,
      "The mountain peak is a desolate place, with nothing but rocks and snow as far as the eye can see.",
      20.5,
      20.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.type = "mountainPeak";
  }
}

class BoulderField extends Room {
  constructor(id, tier) {
    super(
      "Boulder Field",
      id,
      "The boulder field is a treacherous place, with large rocks and loose gravel everywhere.",
      20.5,
      20.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "boulderField";
  }
}

class Cave extends Room {
  constructor(id, tier) {
    super(
      "Cave",
      id,
      "The cave is a dark, damp place, with a narrow entrance leading into the darkness.",
      20.5,
      20.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "cave";
  }
}

module.exports = {
  HorizontalMountainEntrance,
  VerticalMountainEntrance,
  HorizontalMountainPath,
  VerticalMountainPath,
  MountainPeak,
  BoulderField,
  Cave,
};