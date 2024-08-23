const { Room } = require("../room");
const { enemies } = require("../../../class_collections");
const { items } = require("../../../class_collections");

class TrainingRoom extends Room {
  constructor() {
    super(
      "Training/Room",
      "imperialAcademy.trainingRoom",
      "The training room is a large room with a few training dummies and a practice staff on the wall. There is a door to the north, leading to the common room, a door to the east, leading to the practice yard, and a door to the west, leading to the storage room.",
      15.5,
      15.5
    );
    this.items = { staff: new items.Staff() };
    this.exits = {
      north: "imperialAcademy.shortHallway_01",
      east: "imperialAcademy.practiceYard",
      west: "imperialAcademy.storageRoom",
    };
  }
}

var trainingRoom = new TrainingRoom();

class PracticeYard extends Room {
  constructor() {
    super(
      "Practice/Yard",
      "imperialAcademy.practiceYard",
      "The practice yard is a small outdoor yard with a few simple targets, some still pierced with arrows. A bow lies discarded on the ground in front of one of the targets. There is a door to the west, leading back to the training room.",
      10.5,
      10.5
    );
    this.items = { arrow: new items.Arrow(3), bow: new items.ShortBow() };
    this.exits = {
      west: "imperialAcademy.trainingRoom",
    };
  }
}

var practiceYard = new PracticeYard();

class StorageRoom extends Room {
  constructor() {
    super(
      "Storage/Room",
      "imperialAcademy.storageRoom",
      "The storage room is a small room with a few empty shelves, and seems to have been cleared out recently. There is a door to the east, leading back to the training room.",
      10.5,
      10.5
    );
    this.items = {};
    this.exits = {
      east: "imperialAcademy.trainingRoom",
    };
  }
}

var storageRoom = new StorageRoom();

class ShortHallway_01 extends Room {
  constructor() {
    super(
      "Short/Hallway",
      "imperialAcademy.shortHallway_01",
      "The short hallway is a small, dark hallway. There is a door to the south, leading to the training room, and a door to the north, leading to the common room.",
      10.5,
      15.5
    );
    this.items = {};
    this.exits = {
      north: "imperialAcademy.commonRoom",
      south: "imperialAcademy.trainingRoom",
    };
  }
}

var shortHallway_01 = new ShortHallway_01();

class CommonRoom extends Room {
  constructor() {
    super(
      "Common/Room",
      "imperialAcademy.commonRoom",
      "The common room is a large room with a few tables and chairs. There is a door to the north, leading to the grand hall, a door to the south, leading to the training room, a door to the east, leading to the kitchen, and a door to the west, leading to the barracks.",
      15.5,
      15.5,
      false,
      "unreachable"
    );
    this.items = {};
    this.exits = {
      north: "imperialAcademy.shortHallway_02",
      south: "imperialAcademy.shortHallway_01",
      east: "imperialAcademy.kitchen",
      west: "imperialAcademy.barracks",
    };
  }
}

var commonRoom = new CommonRoom();

class Kitchen extends Room {
  constructor() {
    super(
      "Kitchen",
      "imperialAcademy.kitchen",
      "The kitchen is a small room with some half-eaten meals still left on the tables. Chairs are left askew, as though their occupants left in a hurry. There is a door to the west, leading to the common room.",
      10.5,
      10.5
    );
    this.items = {};
    this.exits = {
      west: "imperialAcademy.commonRoom",
    };
  }
}

var kitchen = new Kitchen();

class Barracks extends Room {
  constructor() {
    super(
      "Barracks",
      "imperialAcademy.barracks",
      "The barracks is a small room with a few beds and footlockers. There is a door to the east, leading to the common room.",
      10.5,
      10.5
    );
    this.items = {};
    this.exits = {
      east: "imperialAcademy.commonRoom",
    };
    this.cutscene = "barracksMeeting";
    this.cutscenePlayed = false;
  }
}

var barracks = new Barracks();

class ShortHallway_02 extends Room {
  constructor() {
    super(
      "Short/Hallway",
      "imperialAcademy.shortHallway_02",
      "The short hallway is a small, dark hallway. There is a door to the north, leading to the grand hall, and a door to the south, leading to the common room.",
      10.5,
      15.5
    );
    this.items = {};
    this.exits = {
      north: "imperialAcademy.grandHall",
      south: "imperialAcademy.commonRoom",
    };
  }
}

var shortHallway_02 = new ShortHallway_02();

class GrandHall extends Room {
  constructor() {
    super(
      "Grand Hall",
      "imperialAcademy.grandHall",
      "The grand hall is an enormous hall, and normally an impressive sight. Right now, however, it's a mess. Guards line the doorways, and the doors are barricaded. There is a door to the north, leading to a long passage, a door to the east leading to the Academy's vault, a door to the west leading to the rest of the Academy, and a door to the south leading to the common room.",
      30.5,
      20.5
    );
    this.items = {};
    this.exits = {
      north: "imperialAcademy.longPassage",
      east: "imperialAcademy.vault",
      south: "imperialAcademy.shortHallway_02",
      west: "imperialAcademy.hallGates",
    };
    this.cutscene = "grandHallEncounter";
    this.cutscenePlayed = false;
  }
}

var grandHall = new GrandHall();

class Vault extends Room {
  constructor() {
    super(
      "Vault",
      "imperialAcademy.vault",
      "The vault is a small room with a few chests and a long scroll, kept safely behind a glowing force field. There is a door to the west, leading back to the grand hall.",
      15.5,
      15.5,
      true,
      "The entrance to the vault is securely locked."
    );
    this.items = {};
    this.exits = {
      west: "imperialAcademy.grandHall",
    };
    this.cutscene = "vault";
    this.cutscenePlayed = false;
    this.enemies = [
      new enemies.Enemy("Vault Door", [3, 2], 100, 0, 0, 0, 0, 0, 0),
    ];
  }
}

var vault = new Vault();

class HallGates extends Room {
  constructor() {
    super(
      "Hall/Gates",
      "imperialAcademy.hallGates",
      "The hall gates are a large, imposing set of doors. To the east of the doors is the grand hall, and to the west is a short hallway.",
      7.5,
      15.5,
      true,
      "The hall gates are barricaded and guarded by a pair of imposing soldiers, who inform you that the Grandmaster is only allowing movement between the interior and main part of the Academy with his explicit command."
    );
    this.items = {};
    this.exits = {
      east: "imperialAcademy.grandHall",
      west: "imperialAcademy.shortHallway_03",
    };
  }
}

var hallGates = new HallGates();

class ShortHallway_03 extends Room {
  constructor() {
    super(
      "Short/Hallway",
      "imperialAcademy.shortHallway_03",
      "The short hallway is a small, dark hallway. There is a door to the east, leading to the hall gates, and a door to the west, leading to the rest of the Academy.",
      15.5,
      10.5
    );
    this.items = {};
    this.exits = {
      east: "imperialAcademy.hallGates",
      west: "imperialAcademy.restOfAcademy",
    };
  }
}

var shortHallway_03 = new ShortHallway_03();

class RestOfAcademy extends Room {
  constructor() {
    super(
      "Rest of the Academy",
      "imperialAcademy.restOfAcademy",
      "The rest of the Academy is a large, open area. There is a door to the east, leading to the short hallway, and an opening in the wall to the south, leading to the survivor camp.",
      30.5,
      20.5
    );
    this.items = {};
    this.exits = {
      east: "imperialAcademy.shortHallway_03",
      south: "imperialAcademy.survivorsCamp",
    };
    this.cutscene = "restOfAcademy";
    this.cutscenePlayed = false;
  }
}

var restOfAcademy = new RestOfAcademy();

class LongPassage extends Room {
  constructor() {
    super(
      "Long/Passage",
      "imperialAcademy.longPassage",
      "The long passage is a long, dark passage. There is a door to the north, leading to the Academy's military annex, and a door to the south, leading to the grand hall.",
      10.5,
      30.5,
      true,
      "Two guards stand at the entrance to the passage, and inform you that the passage is off-limits for all except those with the Grandmaster's permission."
    );
    this.items = {};
    this.exits = {
      north: "imperialAcademy.militaryAnnex",
      south: "imperialAcademy.grandHall",
    };
  }
}

var longPassage = new LongPassage();

class MilitaryAnnex extends Room {
  constructor() {
    super(
      "Military/Annex",
      "imperialAcademy.militaryAnnex",
      "The military annex is a large, empty room. There is a door to the north, leading to the armory, a door to the east, leading to the first barracks, a door to the west, leading to the second barracks, and a door to the south, leading back to the long passage.",
      15.5,
      15.5
    );
    this.items = {};
    this.exits = {
      north: "imperialAcademy.armory",
      east: "imperialAcademy.secondBarracks",
      west: "imperialAcademy.firstBarracks",
      south: "imperialAcademy.longPassage",
    };
    this.enemies = [
      new enemies.RebelGrunt("Rebel 1", [1, 3]),
      new enemies.RebelGrunt("Rebel 2", [2, 3]),
      new enemies.RebelGrunt("Rebel 3", [3, 3]),
    ];
    this.cutscene = "militaryAnnex";
    this.cutscenePlayed = false;
  }
}

var militaryAnnex = new MilitaryAnnex();

class FirstBarracks extends Room {
  constructor() {
    super(
      "First/Barracks",
      "imperialAcademy.firstBarracks",
      "The first barracks is a small room with a few beds and footlockers. The inside of the doorframe is oddly pierced by an arrow. There is a door to the west, leading back to the military annex.",
      10.5,
      10.5
    );
    this.items = {};
    this.exits = {
      east: "imperialAcademy.militaryAnnex",
    };
  }
}

var firstBarracks = new FirstBarracks();

class SecondBarracks extends Room {
  constructor() {
    super(
      "Second/Barracks",
      "imperialAcademy.secondBarracks",
      "The second barracks is a small room with a few beds and footlockers. As you look closer at one of the beds, you realize that there is a deep, dark red stain, in roughly the shape of a person's profile. There is a door to the east, leading back to the military annex.",
      10.5,
      10.5
    );
    this.items = {};
    this.exits = {
      west: "imperialAcademy.militaryAnnex",
    };
  }
}

var secondBarracks = new SecondBarracks();

class Armory extends Room {
  constructor() {
    super(
      "Armory",
      "imperialAcademy.armory",
      "The armory is a small room with a few weapons racks and a few stands for pieces of armor. Oddly, much of the furniture has been strewn about, and none of the equipment remains. There is a door to the south, leading back to the military annex.",
      10.5,
      10.5
    );
    this.items = {};
    this.exits = {
      south: "imperialAcademy.militaryAnnex",
    };
  }
}

var armory = new Armory();

class SurvivorCamp extends Room {
  constructor() {
    super(
      "Survivor/Camp",
      "imperialAcademy.survivorCamp",
      "The survivor camp is a small camp with a few tents and a campfire. There is a path to the north, leading back to the Imperial Academy.",
      10.5,
      10.5
    );
    this.exits = {
      north: "imperialAcademy.restOfAcademy",
      south: "imperialAcademy.academyEntrance",
    };
    this.cutscene = "survivorCamp";
    this.cutscenePlayed = false;
    this.restArea = true;
  }
}

var survivorCamp = new SurvivorCamp();

class AcademyEntrance extends Room {
  constructor() {
    super(
      "Academy Entrance",
      "imperialAcademy.academyEntrance",
      "The entrance to the Imperial Academy is a large open area. The remains of large iron gates lie shattered in the burnt grass. There is a path to the north, leading to the survivor camp, and a road to the south, leading to the Academy's bridge.",
      20.5,
      10.5
    );
    this.exits = {
      north: "imperialAcademy.survivorCamp",
      south: "imperialAcademy.academyBridge",
    };
  }
}

var academyEntrance = new AcademyEntrance();

class AcademyBridge extends Room {
  constructor() {
    super(
      "Academy/Bridge",
      "imperialAcademy.academyBridge",
      "The Academy Bridge is a long stone bridge that spans a deep moat. There is a path to the north, leading to the Academy Entrance, and a path to the south, leading to two guard towers.",
      10.5,
      20.5
    );
    this.exits = {
      north: "imperialAcademy.academyEntrance",
      south: "imperialAcademy.guardTowers",
    };
  }
}

var academyBridge = new AcademyBridge();

class GuardTowers extends Room {
  constructor() {
    super(
      "Guard Towers",
      "imperialAcademy.guardTowers",
      "The two guard towers are large stone towers that stand in front of the Academy Bridge. There is a path to the north, leading to the Academy Bridge, and a path to the south, leading to the nexus of the Imperial Citadel.",
      20.5,
      10.5
    );
    this.exits = {
      north: "imperialAcademy.academyBridge",
      south: "imperialNexus.nexus",
    };
  }
}

var guardTowers = new GuardTowers();

module.exports = {
  trainingRoom,
  practiceYard,
  storageRoom,
  shortHallway_01,
  commonRoom,
  kitchen,
  barracks,
  shortHallway_02,
  grandHall,
  vault,
  hallGates,
  shortHallway_03,
  restOfAcademy,
  longPassage,
  militaryAnnex,
  firstBarracks,
  secondBarracks,
  armory,
  survivorCamp,
  academyEntrance,
  academyBridge,
  guardTowers,
};
