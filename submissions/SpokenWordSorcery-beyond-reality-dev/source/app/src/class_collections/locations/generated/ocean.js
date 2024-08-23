const { Room } = require("../room");

class Ocean extends Room {
  constructor(id) {
    super(
      "Ocean",
      id,
      "The ocean is a vast expanse of water, stretching as far as the eye can see.",
      900,
      900,
      true,
      "Without a ship, you can't go any further."
    );
    this.exits = {};
    this.type = "ocean";
  }
}

module.exports = Ocean;