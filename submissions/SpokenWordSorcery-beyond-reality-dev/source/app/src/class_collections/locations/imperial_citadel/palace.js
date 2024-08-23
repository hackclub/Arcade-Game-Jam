const { Room } = require("../room.js");

class GuardTowers extends Room {
  constructor() {
    super(
      "Guard Towers",
      "imperialPalace.guardTowers",
      "The two guard towers are large stone towers that stand in front of the Palace Bridge. There is a path to the north, leading to the nexus of the Imperial Citadel, and a path to the south, leading to the bridge of the Imperial Palace.",
      20.5,
      10.5
    );
    this.items = {};
    this.exits = {
      north: "imperialNexus.nexus",
      south: "imperialPalace.palaceBridge",
    };
    this.cutscene = "guardTowers";
    this.cutscenePlayed = false;
  }
}

var guardTowers = new GuardTowers();

class PalaceBridge extends Room {
  constructor() {
    super(
      "Palace Bridge",
      "imperialPalace.palaceBridge",
      "The Palace Bridge is a long stone bridge that spans a deep moat. There is a path to the north, leading to the guard towers of the Imperial Palace, and a path to the south, leading to the entrance of the Imperial Palace.",
      10.5,
      20.5
    );
    this.items = {};
    this.exits = {
      north: "imperialPalace.guardTowers",
      south: "imperialPalace.palaceEntrance",
    };
    this.isLocked = true;
    this.lockedMessage =
      "Guards rush forward to block your path, and remind you that they will not let you pass until you have the Emperor's belongings.";
  }
}

var palaceBridge = new PalaceBridge();

class PalaceEntrance extends Room {
  constructor() {
    super(
      "Palace Entrance",
      "imperialPalace.palaceEntrance",
      "The entrance to the Imperial Palace is a large open area. The remains of large iron gates lie shattered in the burnt grass. There is a path to the north, leading to the Palace Bridge, and a road to the south, leading to the Imperial Palace.",
      20.5,
      10.5
    );
    this.items = {};
    this.exits = {
      north: "imperialPalace.palaceBridge",
      south: "imperialPalace.imperialPalace",
    };
    this.cutscene = "palaceEntrance";
    this.cutscenePlayed = false;
  }
}

var palaceEntrance = new PalaceEntrance();

class ImperialPalace extends Room {
  constructor() {
    super(
      "Imperial Palace",
      "imperialPalace.imperialPalace",
      "The Imperial Palace is a grand structure with towering spires and walls of polished marble. There is a walkway to the north, leading to the entrance of the Imperial Palace, a walkway to the east, leading to the Imperial Library, a walkway to the south, leading to the throne room, and a walkway to the west, leading to the Imperial Gardens.",
      40.5,
      40.5
    );
    this.items = {};
    this.exits = {
      north: "imperialPalace.palaceEntrance",
      east: "imperialPalace.imperialLibrary",
      south: "imperialPalace.throneRoom",
      west: "imperialPalace.imperialGardens",
    };
  }
}

var imperialPalace = new ImperialPalace();

class ImperialLibrary extends Room {
  constructor() {
    super(
      "Imperial Library",
      "imperialPalace.imperialLibrary",
      "The Imperial Library is a vast chamber with shelves of books and scrolls lining the walls. There is a walkway to the west, leading to the Imperial Palace.",
      20.5,
      20.5,
      true,
      "The doors to the Imperial Library are locked, by order of the Emperor."
    );
    this.items = {};
    this.exits = {
      west: "imperialPalace.imperialPalace",
    };
  }
}

var imperialLibrary = new ImperialLibrary();

class ImperialGardens extends Room {
  constructor() {
    super(
      "Imperial Gardens",
      "imperialPalace.imperialGardens",
      "The Imperial Gardens are a lush oasis of greenery and flowers. There is a walkway to the east, leading to the Imperial Palace.",
      20.5,
      20.5,
      true,
      "The doors to the Imperial Gardens are locked, by order of the Emperor."
    );
    this.items = {};
    this.exits = {
      east: "imperialPalace.imperialPalace",
    };
  }
}

var imperialGardens = new ImperialGardens();

class ThroneRoom extends Room {
  constructor() {
    super(
      "Throne Room",
      "imperialPalace.throneRoom",
      "The throne room is a vast chamber with a high ceiling and walls adorned with tapestries and banners. At the far end of the room, a golden throne sits atop a raised dais. There is a walkway to the north, leading to the Imperial Palace, and a walkway to the south, leading to the Emperor's chambers behind the throne room.",
      40.5,
      20.5
    );
    this.items = {};
    this.exits = {
      north: "imperialPalace.imperialPalace",
      south: "imperialPalace.emperorsChambers",
    };
    this.cutscene = "throneRoom";
    this.cutscenePlayed = false;
  }
}

var throneRoom = new ThroneRoom();



class EmperorsChambers extends Room {
  constructor() {
    super(
      "Emperor's Chambers",
      "imperialPalace.emperorsChambers",
      "The Emperor's chambers are a private suite of rooms with luxurious furnishings and decorations. There is a walkway to the north, leading to the throne room, and a door to the south, leading to the Emperor's private study.",
      20.5,
      20.5,
      true,
      "The doors to the Emperor's chambers are securely locked, and he possesses the only key."
    );
    this.items = {};
    this.exits = {
      north: "imperialPalace.throneRoom",
      south: "imperialPalace.emperorsStudy",
    };
    this.cutscenePlayed = false;
    this.cutscene = "emperorsChambers";
  }
}

var emperorsChambers = new EmperorsChambers();

class EmperorsStudy extends Room {
  constructor() {
    super(
      "Emperor's Study",
      "imperialPalace.emperorsStudy",
      "The Emperor's private study is a small, cluttered room with shelves of books and scrolls. There is a door to the north, leading to the Emperor's chambers.",
      10.5,
      10.5
    );
    this.items = {};
    this.exits = {
      north: "imperialPalace.emperorsChambers",
    };
  }
}

var emperorsStudy = new EmperorsStudy();

module.exports = {
  guardTowers,
  palaceBridge,
  palaceEntrance,
  imperialPalace,
  imperialLibrary,
  imperialGardens,
  throneRoom,
  emperorsChambers,
  emperorsStudy,
};
