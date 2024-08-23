const { Room } = require("../room");

class VerticalRiverEntrance extends Room {
  constructor(id) {
    super(
      "River Entrance",
      id,
      "The river entrance is a calm place, with a gentle current and a sandy shore. The path leads to the north and south.",
      40.5,
      20.5
    );
    this.items = {};
    this.exits = {};
    this.type = "verticalRiverEntrance";
  }
}

class HorizontalRiverEntrance extends Room {
  constructor(id) {
    super(
      "River Entrance",
      id,
      "The river entrance is a calm place, with a gentle current and a sandy shore. The path leads to the east and west.",
      20.5,
      40.5
    );
    this.items = {};
    this.exits = {};
    this.type = "horizontalRiverEntrance";
  }
}

class ThickHorizontalBridge extends Room {
  constructor(id, tier) {
    super(
      "Bridge",
      id,
      "The bridge over the great river continues to the east and west.",
      40.5,
      20.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "bridge";
  }
}

class ThinHorizontalBridge extends Room {
  constructor(id, tier) {
    super(
      "Bridge",
      id,
      "The bridge spans the river, connecting the east and west banks.",
      40.5,
      10.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "bridge";
  }
}

class ThickVerticalBridge extends Room {
  constructor(id, tier) {
    super(
      "Bridge",
      id,
      "The bridge over the great river continues to the north and south.",
      20.5,
      40.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "bridge";
  }
}

class ThinVerticalBridge extends Room {
  constructor(id, tier) {
    super(
      "Bridge",
      id,
      "The bridge spans the river, connecting the north and south banks.",
      10.5,
      40.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = `generateRandomEncounter(${tier})`;
    this.encountered = false;
    this.type = "bridge";
  }
}

module.exports = {
  VerticalRiverEntrance,
  HorizontalRiverEntrance,
  ThickHorizontalBridge,
  ThinHorizontalBridge,
  ThickVerticalBridge,
  ThinVerticalBridge,
};
