const Room = require("../room.js").Room;
const { enemies } = require("../../../class_collections");

class PortEntrance extends Room {
  constructor() {
    super(
      "Port Entrance",
      "imperialPort.portEntrance",
      "The entrance to the port is a large open area. The remains of large iron gates lie shattered in the burnt grass. There is a path to the west, leading to the nexus of the Imperial Citadel, and a road to the east, leading to the port.",
      10.5,
      20.5
    );
    this.items = {};
    this.exits = {
      west: "imperialNexus.nexus",
      east: "imperialPort.port",
    };
    this.enemies = [
      new enemies.RebelCaptain("Rebel Captain", [2, 3]),
      new enemies.RebelGrunt("Rebel 1", [2, 2]),
      new enemies.RebelGrunt("Rebel 2", [2, 4]),
    ];
  }
}

var portEntrance = new PortEntrance();

class Port extends Room {
  constructor() {
    super(
      "Port",
      "imperialPort.port",
      "The port is a large open area with numerous docks and ships. There is a path to the west leading to the port entrance, and a path to the east leading to the Imperial Dreadnought.",
      100.5,
      100.5,
      true,
      "A legion of Imperial soldiers stand guard at the entrance to the port, their weapons at the ready. This must be where much of the Empire's forces retreated to after the attack on the Imperial Academy. The soldiers appear to recognize your acolyte robes, but they nonetheless inform you that the port is under a strict lockdown."
    );
    this.items = {};
    this.exits = {
      west: "imperialPort.portEntrance",
      east: "imperialPort.imperialDreadnoughtExterior",
    };
    this.key = "Imperial Signet Ring";
    this.unlockMessage =
      "The soldiers recognize the Imperial Signet Ring that you hold as a sign of the Emperor's absolute authority, and they hastily step aside to grant you access.";
  }
}

var port = new Port();

class ImperialDreadnoughtExterior extends Room {
  constructor() {
    super(
      "Imperial Dreadnought",
      "imperialPort.imperialDreadnought",
      "The Imperial Dreadnought is a massive armored ship with imposing ballistae, each with a heavy javelin already nocked. There is a door to the west leading to the port, and a ladder to the east leading up to the upper deck.",
      20.5,
      80.5
    );
    this.items = {};
    this.exits = {
      west: "imperialPort.port",
      east: "imperialPort.imperialDreadnoughtUpperDeck",
    };
    this.cutscenePlayed = false;
    this.cutscene = "imperialDreadnoughtExterior";
  }
}

var imperialDreadnoughtExterior = new ImperialDreadnoughtExterior();

class ImperialDreadnoughtUpperDeck extends Room {
  constructor() {
    super(
      "Imperial Dreadnought Upper Deck",
      "imperialPort.imperialDreadnoughtUpperDeck",
      "The upper deck of the Imperial Dreadnought is a large open area with a few crates and barrels scattered about. There is a ladder to the west, leading down to the ship's exterior, and a wooden door to the south, leading below deck.",
      30.5,
      60.5
    );
    this.items = {};
    this.exits = {
      west: "imperialDreadnoughtExterior",
      south: "imperialDreadnoughtLowerDeck",
    };
    this.cutscenePlayed = false;
    this.cutscene = "imperialDreadnoughtUpperDeck";
  }
}

var imperialDreadnoughtUpperDeck = new ImperialDreadnoughtUpperDeck();

class ImperialDreadnoughtLowerDeck extends Room {
  constructor() {
    super(
      "Imperial Dreadnought Lower Deck",
      "imperialPort.imperialDreadnoughtLowerDeck",
      "The lower deck of the Imperial Dreadnought is a dimly lit area with a few crates and barrels scattered about. There is a wooden ladder to the north, leading up to the upper deck, a door to the crew quarters to the west, a door to the captain's quarters to the east, and a ladder to the south, leading further below deck into the ship's hold.",
      30.5,
      30.5
    );
    this.items = {};
    this.exits = {
      north: "imperialDreadnoughtUpperDeck",
      east: "imperialDreadnoughtCaptainQuarters",
      south: "imperialDreadnoughtHold",
      west: "imperialDreadnoughtCrewQuarters",
    };
  }
}

var imperialDreadnoughtLowerDeck = new ImperialDreadnoughtLowerDeck();

class ImperialDreadnoughtCrewQuarters extends Room {
  constructor() {
    super(
      "Imperial Dreadnought Crew Quarters",
      "imperialPort.imperialDreadnoughtCrewQuarters",
      "The crew quarters of the Imperial Dreadnought is a cramped area with rows of hammocks and personal belongings. There is a door to the east, leading back to the lower deck.",
      15.5,
      15.5
    );
    this.items = {};
    this.exits = {
      east: "imperialDreadnoughtLowerDeck",
    };
  }
}

var imperialDreadnoughtCrewQuarters = new ImperialDreadnoughtCrewQuarters();

class ImperialDreadnoughtCaptainQuarters extends Room {
  constructor() {
    super(
      "Imperial Dreadnought Captain Quarters",
      "imperialPort.imperialDreadnoughtCaptainQuarters",
      "The captain's quarters of the Imperial Dreadnought is a spacious area with a large bed, a desk, and a few personal belongings. There is a door to the west, leading back to the lower deck.",
      15.5,
      15.5,
      true,
      "The door to the captain's quarters, which is now serving the Emperor if the hastily crossed out sign is any indication, is locked."
    );
    this.items = {};
    this.exits = {
      west: "imperialDreadnoughtLowerDeck",
    };
  }
}

var imperialDreadnoughtCaptainQuarters =
  new ImperialDreadnoughtCaptainQuarters();

class ImperialDreadnoughtHold extends Room {
  constructor() {
    super(
      "Imperial Dreadnought Hold",
      "imperialPort.imperialDreadnoughtHold",
      "The hold of the Imperial Dreadnought is a dark, cramped area with rows of crates and barrels stacked to the ceiling. A hammock seems to have been hastily strung up in the center of the room. There is a ladder to the north, leading back up to the lower deck.",
      15.5,
      15.5
    );
    this.items = {};
    this.exits = {
      north: "imperialDreadnoughtLowerDeck",
    };
    this.cutscenePlayed = false;
    this.cutscene = "imperialDreadnoughtHold";
  }
}

var imperialDreadnoughtHold = new ImperialDreadnoughtHold();

module.exports = {
  portEntrance,
  port,
  imperialDreadnoughtExterior,
  imperialDreadnoughtUpperDeck,
  imperialDreadnoughtLowerDeck,
  imperialDreadnoughtCrewQuarters,
  imperialDreadnoughtCaptainQuarters,
  imperialDreadnoughtHold,
};
