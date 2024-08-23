const { Room } = require("../room");
const { enemies } = require("../../../class_collections");

class Nexus extends Room {
  constructor() {
    super(
      "Nexus",
      "imperialNexus.nexus",
      "The nexus of the Imperial Citadel is a large open area with numerous roads and paths intersecting. There is a path to the north leading to the guard towers of the Imperial Academy, a path to the east leading to the port, a path to the south leading to the guard towers of the Imperial Palace, and a path to the west leading to the market.",
      40.5,
      40.5
    );
    this.items = {};
    this.exits = {
      north: "imperialAcademy.guardTowers",
      east: "imperialPort.portEntrance",
      south: "imperialPalace.guardTowers",
      west: "imperialMarket.marketEntrance",
    };
    this.enemies = [
      new enemies.RebelCaptain("Rebel Captain", "south"),
      new enemies.RebelGrunt("Rebel 1", "southwest"),
      new enemies.RebelGrunt("Rebel 2", "southwest"),
    ];
  }
}

var nexus = new Nexus();

module.exports = { nexus };
