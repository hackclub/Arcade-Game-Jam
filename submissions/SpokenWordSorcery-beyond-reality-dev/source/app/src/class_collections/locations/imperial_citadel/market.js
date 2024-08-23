const Room = require("../room.js").Room;
const { enemies } = require("../../../class_collections");
const { items } = require("../../../class_collections");

class MarketEntrance extends Room {
  constructor() {
    super(
      "Market Entrance",
      "imperialMarket.marketEntrance",
      "The entrance to the market is a large open area. The remains of large iron gates lie shattered in the burnt grass. There is a path to the east, leading to the nexus of the Imperial Citadel, and a road to the west, leading to the market.",
      10.5,
      20.5
    );
    this.items = {};
    this.exits = {
      east: "imperialNexus.nexus",
      west: "imperialMarket.market",
    };
  }
}

var marketEntrance = new MarketEntrance();

class Market extends Room {
  constructor() {
    super(
      "Market",
      "imperialMarket.market",
      "The market is a large open area with numerous stalls and shops. There is a path to the east leading to the market entrance, and a path to the west leading to the exterior of the Imperial Treasury.",
      100.5,
      100.5
    );
    this.items = {};
    this.exits = {
      east: "imperialMarket.marketEntrance",
      west: "imperialMarket.imperialTreasuryExterior",
    };
    this.enemies = [
      new enemies.RebelCaptain("Rebel Captain", [10, 11]),
      new enemies.RebelGrunt("Rebel 1", [8, 10]),
      new enemies.RebelGrunt("Rebel 2", [12, 7]),
      new enemies.RebelGrunt("Rebel 3", [9, 8]),
      new enemies.RebelShortBowman("Rebel Archer 1", [2, 4]),
      new enemies.RebelShortBowman("Rebel Archer 2", [3, 16]),
      new enemies.RebelShortBowman("Rebel Archer 3", [5, 8]),
    ];
    this.cutscene = "marketStalls";
    this.cutscenePlayed = false;
  }
}

var market = new Market();

class ImperialTreasuryExterior extends Room {
  constructor() {
    super(
      "Imperial Treasury Exterior",
      "imperialMarket.imperialTreasuryExterior",
      "The Imperial Treasury is a large stone building with a massive iron door. There is a path to the east leading to the market stalls, a door to the north leading inside, and a road to the south leading to the Imperial Citadel's walls.",
      20.5,
      30.5
    );
    this.items = {};
    this.exits = {
      north: "imperialMarket.imperialTreasury",
      east: "imperialMarket.market",
      south: "imperialMarket.citadelRoad",
    };
    this.enemies = [
      new enemies.RebelGrunt("Rebel 1", [3, 5]),
      new enemies.RebelGrunt("Rebel 2", [3, 6]),
      new enemies.RebelGrunt("Rebel 3", [3, 7]),
      new enemies.RebelGrunt("Rebel 4", [3, 8]),
    ];
    this.cutsene = "imperialTreasuryExterior";
    this.cutscenePlayed = false;
  }
}

var imperialTreasuryExterior = new ImperialTreasuryExterior();

class CitadelRoad extends Room {
  constructor() {
    super(
      "Citadel Road",
      "imperialMarket.citadelRoad",
      "The Citadel Road is a wide stone road that leads to the Imperial Citadel's walls. There is a path to the north leading to the Imperial Treasury, and a path to the south leading to the Imperial Citadel's walls.",
      20.5,
      60.5
    );
    this.items = {};
    this.exits = {
      north: "imperialMarket.imperialTreasuryExterior",
      south: "imperialCitadel.citadelWalls",
    };
  }
}

var citadelRoad = new CitadelRoad();

class CitadelWalls extends Room {
  constructor() {
    super(
      "Citadel Walls",
      "imperialMarket.citadelWalls",
      "The Citadel Walls are tall stone walls that surround the Imperial Citadel. There is a path to the north leading to the Citadel Road, and a path to the south leading to the main gates of the Imperial Citadel.",
      80.5,
      20.5
    );
    this.items = {};
    this.exits = {
      north: "imperialMarket.citadelRoad",
      south: "imperialCitadel.mainGate",
    };
  }
}

var citadelWalls = new CitadelWalls();

class MainGate extends Room {
  constructor() {
    super(
      "Main Gate",
      "imperialCitadel.mainGate",
      "The main gates of the Imperial Citadel are large iron gates that are currently closed. There is a path to the north leading to the Citadel Walls, and a path to the south leading outside of the Imperial Citadel.",
      15.5,
      15.5
    );
    this.items = {};
    this.exits = {
      north: "imperialMarket.citadelWalls",
      south: "imperialMarket.fields",
    };
    this.enemies = [
      new enemies.RebelCaptain("Rebel Captain", [2, 3]),
      new enemies.RebelGrunt("Rebel 1", [1, 1]),
      new enemies.RebelGrunt("Rebel 2", [3, 1]),
      new enemies.RebelGrunt("Rebel 3", [1, 2]),
      new enemies.RebelGrunt("Rebel 4", [3, 2]),
      new enemies.RebelGrunt("Rebel 5", [1, 3]),
      new enemies.RebelGrunt("Rebel 6", [3, 3]),
    ];
    this.cutscene = "mainGate";
    this.cutscenePlayed = false;
  }
}

var mainGate = new MainGate();

class Fields extends Room {
  constructor() {
    super(
      "Fields",
      "imperialMarket.fields",
      "The fields outside the Imperial Citadel are a large open area with burnt crops and the remains of a small battle. There is a path to the north leading to the main gates of the Imperial Citadel.",
      200.5,
      200.5
    );
    this.items = {};
    this.exits = {
      north: "imperialCitadel.mainGate",
    };
  }
}

var fields = new Fields();

class ImperialTreasuryLounge extends Room {
  constructor() {
    super(
      "Imperial Treasury Lounge",
      "imperialMarket.imperialTreasuryLounge",
      "The Imperial Treasury Lounge is a crowded room with several guards and officials rushing about. There is a door to the north leading deeper inside, and a door to the south leading outside.",
      40.5,
      40.5
    );
    this.items = {};
    this.exits = {
      north: "imperialMarket.shortHallway",
      south: "imperialMarket.imperialTreasuryExterior",
    };
    this.isLocked = true;
    this.lockedDescription =
      "The doors to the inside of the Imperial Treasury are locked. The guards inform you that it will not open except for express, written permission from the Emperor himself.";
    this.key = "Imperial Writ of Entry";
    this.unlockMessage =
      "The guards nod and step aside as you present the Imperial Writ of Entry. The doors to the Imperial Treasury swing open.";
  }
}

var imperialTreasuryLounge = new ImperialTreasuryLounge();

class ShortHallway_01 extends Room {
  constructor() {
    super(
      "Short Hallway",
      "imperialMarket.shortHallway_01",
      "The short hallway is a narrow stone hallway with a door to the north leading to the Imperial Treasury's main hall, and a door to the south leading back to the Imperial Treasury's lounge.",
      10.5,
      15.5
    );
    this.items = {};
    this.exits = {
      north: "imperialMarket.mainHall",
      south: "imperialMarket.imperialTreasuryLounge",
    };
  }
}

var shortHallway_01 = new ShortHallway_01();

class MainHall extends Room {
  constructor() {
    super(
      "Main Hall",
      "imperialMarket.mainHall",
      "The main hall of the Imperial Treasury is a large open area with numerous guards and officials moving about. It appears to be being used as a staging area for the defense and management of the treasury. There is a door to the north leading to a short hallway, and a door to the south leading to a different short hallway.",
      40.5,
      80.5
    );
    this.items = {};
    this.exits = {
      north: "imperialMarket.shortHallway_02",
      south: "imperialMarket.shortHallway_01",
    };
  }
}

var mainHall = new MainHall();

class ShortHallway_02 extends Room {
  constructor() {
    super(
      "Short Hallway",
      "imperialMarket.shortHallway_02",
      "The short hallway is a narrow stone hallway with a door to the north leading to the Imperial Treasury's vaults, and a door to the south leading to the Imperial Treasury's main hall.",
      10.5,
      15.5
    );
    this.items = {};
    this.exits = {
      north: "imperialMarket.vaults",
      south: "imperialMarket.mainHall",
    };
  }
}

var shortHallway_02 = new ShortHallway_02();

class VaultEntrance extends Room {
  constructor() {
    super(
      "Vault Entrance",
      "imperialMarket.vaultEntrance",
      "The vault entrance is a large stone door with a heavy iron lock. The vaults of the treasury are to the north, and a short hallway is to the south.",
      20.5,
      20.5
    );
    this.items = {};
    this.exits = {
      north: "imperialMarket.longPassage_01",
      south: "imperialMarket.shortHallway_02",
    };
    this.cutscene = "vaultEntrance";
    this.cutscenePlayed = false;
  }
}

var vaultEntrance = new VaultEntrance();

class LongPassage_01 extends Room {
  constructor() {
    super(
      "Long Passage",
      "imperialMarket.longPassage_01",
      "The long passage is a narrow stone hallway with a door to the north leading to a small room, and a door to the south leading to the vault's entrance.",
      10.5,
      30.5
    );
    this.items = {};
    this.exits = {
      north: "imperialMarket.smallRoom_01",
      south: "imperialMarket.vaultEntrance",
    };
  }
}

var longPassage_01 = new LongPassage_01();

class SmallRoom_01 extends Room {
  constructor() {
    super(
      "Small Room",
      "imperialMarket.smallRoom_01",
      "The small room is a cramped stone room with a single table and chair, the purpose of which is unclear. There is a door to the north leading to a long passage, a door to the east leading to a short hallway, a door to the south leading to a different long passage, and a door to the west leading to a different short hallway.",
      15.5,
      15.5
    );
    this.items = {};
    this.exits = {
      north: "imperialMarket.longPassage_02",
      east: "imperialMarket.shortHallway_03",
      south: "imperialMarket.longPassage_01",
      west: "imperialMarket.shortHallway_04",
    };
  }
}

var smallRoom_01 = new SmallRoom_01();

class LongPassage_02 extends Room {
  constructor() {
    super(
      "Long Passage",
      "imperialMarket.longPassage_02",
      "The long passage is a narrow stone hallway with a door to the north leading to a small room, and a door to the south leading to a different small room.",
      10.5,
      30.5
    );
    this.items = {};
    this.exits = {
      north: "imperialMarket.smallRoom_02",
      south: "imperialMarket.smallRoom_01",
    };
  }
}

var longPassage_02 = new LongPassage_02();

class SmallRoom_02 extends Room {
  constructor() {
    super(
      "Small Room",
      "imperialMarket.smallRoom_02",
      "The small room appears to both contain nothing and lead nowhere, with a door to the south leading to a long passage.",
      15.5,
      15.5
    );
    this.items = {};
    this.exits = {
      south: "imperialMarket.longPassage_02",
    };
  }
}

var smallRoom_02 = new SmallRoom_02();

class ShortHallway_03 extends Room {
  constructor() {
    super(
      "Short Hallway",
      "imperialMarket.shortHallway_03",
      "The short hallway is a narrow stone hallway with a door to the west leading to a small room, and a door to the east leading to a large chamber.",
      15.5,
      10.5
    );
    this.items = {};
    this.exits = {
      west: "imperialMarket.smallRoom_01",
      east: "imperialMarket.largeChamber_01",
    };
  }
}

var shortHallway_03 = new ShortHallway_03();

class LargeChamber_01 extends Room {
  constructor() {
    super(
      "Large Chamber",
      "imperialMarket.largeChamber_01",
      "The large chamber is a large stone room with a high ceiling and numerous pillars. The numerous crates and barrels scattered throughout the room seem to indicate that it is being used as a store room for the rebels holed-up inside. There is a door to the west leading to a short hallway, and a door to the east leading to a long passage.",
      30.5,
      30.5
    );
    this.items = {};
    this.exits = {
      west: "imperialMarket.shortHallway_03",
      east: "longPassage_03",
    };
    this.enemies = [
      new enemies.RebelCaptain("Rebel 1", [5, 4]),
      new enemies.RebelGrunt("Rebel 2", [3, 2]),
      new enemies.RebelGrunt("Rebel 3", [4, 6]),
      new enemies.Crate([1, 2]),
      new enemies.Crate([3, 4]),
      new enemies.Crate([5, 6]),
      new enemies.Barrel([2, 3]),
      new enemies.Barrel([4, 5]),
      new enemies.Barrel([5, 3]),
    ];
  }
}

var largeChamber_01 = new LargeChamber_01();

class LongPassage_03 extends Room {
  constructor() {
    super(
      "Long Passage",
      "imperialMarket.longPassage_03",
      "The long passage is a narrow stone passage with a door to the west leading to a large chamber, and a door to the east leading to a small room.",
      30.5,
      10.5
    );
    this.items = {};
    this.exits = {
      west: "imperialMarket.largeChamber_01",
      east: "imperialMarket.smallRoom_03",
    };
  }
}

var longPassage_03 = new LongPassage_03();

class SmallRoom_03 extends Room {
  constructor() {
    super(
      "Small Room",
      "imperialMarket.smallRoom_03",
      "The small room contains a bloody cot, with a dead rebel soldier lying on top of it clutching his sword. There is a door to the west leading to a long passage.",
      15.5,
      15.5
    );
    this.items = {
      sword: new items.ShortSword(),
    };
    this.exits = {
      west: "imperialMarket.longPassage_03",
    };
  }
}

var smallRoom_03 = new SmallRoom_03();

class ShortHallway_04 extends Room {
  constructor() {
    super(
      "Short Hallway",
      "imperialMarket.shortHallway_04",
      "The short hallway is a narrow stone hallway with a door to the east leading to a small room, and a door to the west leading to a different small room.",
      15.5,
      10.5
    );
    this.items = {};
    this.exits = {
      east: "imperialMarket.smallRoom_04",
      west: "imperialMarket.smallRoom_03",
    };
  }
}

var shortHallway_04 = new ShortHallway_04();

class SmallRoom_04 extends Room {
  constructor() {
    super(
      "Small Room",
      "imperialMarket.smallRoom_04",
      "The small room contains a small chest, with the lock broken and the contents long gone. There is a door to the east leading to a short hallway, and a door to the west leading to a long passage.",
      15.5,
      15.5
    );
    this.items = {};
    this.exits = {
      east: "imperialMarket.shortHallway_04",
      west: "imperialMarket.longPassage_04",
    };
  }
}

var smallRoom_04 = new SmallRoom_04();

class LongPassage_04 extends Room {
  constructor() {
    super(
      "Long Passage",
      "imperialMarket.longPassage_04",
      "The long passage is a narrow stone passage with a door to the east leading to a small room, and a door to the west leading to a different small room.",
      10.5,
      30.5
    );
    this.items = {};
    this.exits = {
      east: "imperialMarket.smallRoom_04",
      west: "imperialMarket.smallRoom_05",
    };
  }
}

var longPassage_04 = new LongPassage_04();

class SmallRoom_05 extends Room {
  constructor() {
    super(
      "Small Room",
      "imperialMarket.smallRoom_05",
      "This small room is mostly empty, except for some mouse droppings on the floor, with a door to the north leading to a short hallway and a door to the east leading to a long passage.",
      15.5,
      15.5
    );
    this.items = {};
    this.exits = {
      north: "imperialMarket.shortHallway_05",
      east: "imperialMarket.longPassage_04",
    };
  }
}

var smallRoom_05 = new SmallRoom_05();

class ShortHallway_05 extends Room {
  constructor() {
    super(
      "Short Hallway",
      "imperialMarket.shortHallway_05",
      "The short hallway is a narrow stone hallway with a door to the north leading to a small room, and a door to the south leading to a different small room.",
      10.5,
      15.5
    );
    this.items = {};
    this.exits = {
      north: "imperialMarket.smallRoom_06",
      south: "imperialMarket.smallRoom_05",
    };
  }
}

var shortHallway_05 = new ShortHallway_05();

class SmallRoom_06 extends Room {
  constructor() {
    super(
      "Small Room",
      "imperialMarket.smallRoom_06",
      "The small room is totally empty, with a door to the north leading to a short hallway and a door to the south leading to a long passage.",
      15.5,
      15.5
    );
    this.items = {};
    this.exits = {
      north: "longPassage_05",
      south: "imperialMarket.shortHallway_05",
    };
    this.enemies = [new enemies.RebelCaptain("Rebel", "north")];
  }
}

var smallRoom_06 = new SmallRoom_06();

class LongPassage_05 extends Room {
  constructor() {
    super(
      "Long Passage",
      "imperialMarket.longPassage_05",
      "The long passage is a narrow stone hallway with a door to the north leading to a large chamber and a door to the south leading to a small room.",
      10.5,
      10.5
    );
    this.items = {};
    this.exits = {
      south: "imperialMarket.smallRoom_06",
      north: "imperialMarket.largeChamber_02",
    };
  }
}

var longPassage_05 = new LongPassage_05();

class LargeChamber_02 extends Room {
  constructor() {
    super(
      "Large Chamber",
      "imperialMarket.largeChamber_02",
      "The large chamber is a large stone room with a high ceiling and numerous pillars. The broken barrels and crates, all empty, that lie scattered on the floor may be a sign of the rebels' growing desperation. There is a door to the south leading to a long passage, and a door to the north, east, and west, each leading to different hallways.",
      30.5,
      30.5
    );
    this.items = {};
    this.exits = {
      north: "imperialMarket.longPassage_05",
      east: "imperialMarket.shortHallway_06",
      south: "imperialMarket.shortHallway_08",
      west: "imperialMarket.shortHallway_07",
    };
  }
}

var largeChamber_02 = new LargeChamber_02();

class ShortHallway_06 extends Room {
  constructor() {
    super(
      "Short Hallway",
      "imperialMarket.shortHallway_06",
      "The short hallway is a narrow stone hallway with a door to the a door to the east leading to a small room, and a door to the west leading to a large chamber.",
      15.5,
      10.5
    );
    this.items = {};
    this.exits = {
      west: "imperialMarket.largeChamber_02",
      east: "imperialMarket.smallRoom_07",
    };
  }
}

var shortHallway_06 = new ShortHallway_06();

class SmallRoom_07 extends Room {
  constructor() {
    super(
      "Small Room",
      "imperialMarket.smallRoom_07",
      "The small room is a dead end, although you notice a coin lying on the floor, with a door to the west leading to a short hallway.",
      15.5,
      15.5
    );
    this.items = {
      coin: new items.Coin(),
    };
    this.exits = {
      west: "imperialMarket.shortHallway_06",
    };
  }
}

var smallRoom_07 = new SmallRoom_07();

class ShortHallway_07 extends Room {
  constructor() {
    super(
      "Short Hallway",
      "imperialMarket.shortHallway_07",
      "The short hallway is a narrow stone hallway with a door to the a door to the east leading to a large chamber, and a door to the west leading to a small room.",
      15.5,
      10.5
    );
    this.items = {};
    this.exits = {
      east: "imperialMarket.largeChamber_02",
      west: "imperialMarket.smallRoom_07",
    };
  }
}

var shortHallway_07 = new ShortHallway_07();

class SmallRoom_08 extends Room {
  constructor() {
    super(
      "Small Room",
      "imperialMarket.smallRoom_08",
      "The small room is empty except for a pouch that someone seems to have tried to hide under a pile of rusty weapons. There is a door to the east leading to a short hallway.",
      15.5,
      15.5
    );
    this.items = {
      pouch: new items.Coin(5),
    };
    this.exits = {
      east: "imperialMarket.shortHallway_07",
    };
  }
}

var smallRoom_08 = new SmallRoom_08();

class ShortHallway_08 extends Room {
  constructor() {
    super(
      "Short Hallway",
      "imperialMarket.shortHallway_08",
      "The short hallway is a narrow stone hallway with a door to the a door to the north leading to a large chamber, and a door to the south leading to a small room.",
      10.5,
      15.5
    );
    this.items = {};
    this.exits = {
      north: "imperialMarket.largeChamber_02",
    };
  }
}

var shortHallway_08 = new ShortHallway_08();

class SmallRoom_09 extends Room {
  constructor() {
    super(
      "Small Room",
      "imperialMarket.smallRoom_09",
      "The small room seems to be completely empty, with a door to the south leading to a short hallway.",
      15.5,
      15.5
    );
    this.items = {};
    this.exits = {
      south: "imperialMarket.shortHallway_08",
    };
    this.cutscene = "imperialTreasuryVault";
    this.cutscenePlayed = false;
  }
}

var smallRoom_09 = new SmallRoom_09();

class HiddenTunnel extends Room {
  constructor() {
    super(
      "Hidden Tunnel",
      "imperialMarket.hiddenTunnel",
      "The hidden tunnel is a dark, damp passage that leads deep underground. There is a door to the south leading back to the Imperial Treasury's vault.",
      10.5,
      30.5
    );
    this.items = {};
    this.exits = {
      south: "imperialMarket.smallRoom_09",
    };
    this.cutscene = "hiddenTunnel";
    this.cutscenePlayed = false;
  }
}

var hiddenTunnel = new HiddenTunnel();

module.exports = {
  marketEntrance,
  market,
  imperialTreasuryExterior,
  citadelRoad,
  citadelWalls,
  mainGate,
  imperialTreasuryLounge,
  shortHallway_01,
  mainHall,
  shortHallway_02,
  vaultEntrance,
  longPassage_01,
  smallRoom_01,
  longPassage_02,
  smallRoom_02,
  shortHallway_03,
  largeChamber_01,
  longPassage_03,
  smallRoom_03,
  shortHallway_04,
  smallRoom_04,
  longPassage_04,
  smallRoom_05,
  shortHallway_05,
  smallRoom_06,
  longPassage_05,
  largeChamber_02,
  shortHallway_06,
  smallRoom_07,
  shortHallway_07,
  smallRoom_08,
  shortHallway_08,
  smallRoom_09,
  hiddenTunnel,
};
