const { Room, Shop } = require("../room");
const enemies = require("../../../class_collections");
const items = require("../../../class_collections");
const { generateShop } = require("../../../proc_gen");

class RockyBeach extends Room {
  constructor() {
    super(
      "Rocky Beach",
      "unknownShore.rockyBeach",
      "The rocky beach is a desolate place, with the sound of waves crashing against the shore. There is a large piece of driftwood that looks like it would make a good place to rest. ",
      20.5,
      40.5
    );
    this.items = {};
    this.exits = {
      north: "unknownShore.northBeach",
      south: "unknownShore.southBeach",
      west: "unknownShore.forestPath_01",
    };
    this.cutscenePlayed = false;
    this.cutscene = "rockyBeach";
    this.restArea = true;
  }
}

var rockyBeach = new RockyBeach();

class FirstBeach extends Room {
  constructor() {
    super(
      "First Beach",
      "unknownShore.firstBeach",
      "The first beach is a desolate place, with no civilization in sight and the only sounds being the crashing waves.",
      10.5,
      20.5
    );
    this.items = {};
    this.exits = {};
  }
}

var firstBeach = new FirstBeach();

class SecondBeach extends Room {
  constructor() {
    super(
      "Second Beach",
      "unknownShore.secondBeach",
      "The second beach is a desolate place, with no civilization in sight and the only sounds being the crashing waves.",
      10.5,
      20.5
    );
    this.items = {};
    this.exits = {};
  }
}

var secondBeach = new SecondBeach();

class ForestPath_01 extends Room {
  constructor() {
    super(
      "Forest Path",
      "unknownShore.forestPath_01",
      "The forest path winds through the trees for a long way, leading to a small clearing in the ",
      40.5,
      10.5
    );
    this.items = {};
    this.exits = {};
  }
}

var forestPath_01 = new ForestPath_01();

class Clearing_01 extends Room {
  constructor() {
    super(
      "Clearing",
      "unknownShore.clearing_01",
      "The clearing is a small, open area surrounded by trees. ",
      20.5,
      20.5
    );
    this.items = {};
    this.exits = {};
  }
}

var clearing_01 = new Clearing_01();

class TravelingMerchant extends Shop {
  constructor() {
    super(
      "Traveling/Merchant",
      "unknownShore.travelingMerchant",
      `The traveling merchant, by the name of ${generatedMerchant[0]} has a small cart pulled by a donkey that contains a variety of wares.`,
      15.5,
      15.5
    );
    this.items = {};
    this.exits = {};
    this.vendor = generatedMerchant[0];
    this.shopItems = generatedMerchant[1];
    this.currency = generatedMerchant[2];
    this.markup = generatedMerchant[3];
  }
}

var generatedMerchant = generateShop(1);
var travelingMerchant = new TravelingMerchant();

class OldTreeStump extends Room {
  constructor() {
    super(
      "Old Tree/Stump",
      "unknownShore.oldTreeStump",
      "The old tree stump is a small, moss-covered stump with a hole in the center.",
      10.5,
      10.5
    );
    this.items = {};
    this.exits = {};
  }
}

var oldTreeStump = new OldTreeStump();

class ForestPath_02 extends Room {
  constructor() {
    super(
      "Forest Path",
      "unknownShore.forestPath_02",
      "The forest path winds through the trees for a long way, leading to ",
      40.5,
      10.5
    );
    this.items = {};
    this.exits = {};
    this.encounter = "generateRandomEncounter(1)";
    this.encountered = false;
  }
}

var forestPath_02 = new ForestPath_02();

class Clearing_02 extends Room {
  constructor() {
    super(
      "Clearing",
      "unknownShore.clearing_02",
      "The clearing is a small, open area surrounded by trees.",
      20.5,
      20.5
    );
    this.items = {};
    this.exits = {};
  }
}

var clearing_02 = new Clearing_02();

class HorizontalUnknownShoreEntrance extends Room {
  constructor(id) {
    super(
      "Unknown Shore/Entrance",
      id,
      "You can faintly hear the sound of waves crashing against the shore from the entrance to the Unknown Shore. The path leads to the east and west.",
      20.5,
      40.5
    );
    this.items = {};
    this.exits = {};
    this.type = "horizontalUnknownShoreEntrance";
  }
}

class VerticalUnknownShoreEntrance extends Room {
  constructor(id) {
    super(
      "Unknown Shore Entrance",
      id,
      "You can faintly hear the sound of waves crashing against the shore from the entrance to the Unknown Shore. The path leads to the north and south.",
      40.5,
      20.5
    );
    this.items = {};
    this.exits = {};
    this.type = "verticalUnknownShoreEntrance";
  }
}

module.exports = {
  rockyBeach,
  firstBeach,
  secondBeach,
  forestPath_01,
  clearing_01,
  travelingMerchant,
  oldTreeStump,
  forestPath_02,
  clearing_02,
  HorizontalUnknownShoreEntrance,
  VerticalUnknownShoreEntrance,
};
