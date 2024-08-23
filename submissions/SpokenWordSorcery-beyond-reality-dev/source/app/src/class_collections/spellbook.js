class Element {
  constructor(name, description, descriptor, negates, isNegatedBy) {
    this.name = name;
    this.description = description;
    this.descriptor = descriptor;
    this.negates = negates;
    this.isNegatedBy = isNegatedBy;
    this.type = "Element";
  }
}

class Aether extends Element {
  constructor() {
    super(
      "Aether",
      "Aether makes up the fabric of the universe, but spells cast using it do not have any material effect",
      "A shimmering ",
      "None",
      "None"
    );
  }
}

class Earth extends Element {
  constructor() {
    super(
      "Earth",
      "The element of rock, soil, and plant life",
      "An earthen ",
      "Water",
      "Air"
    );
  }
}

class Fire extends Element {
  constructor() {
    super(
      "Fire",
      "The element of heat and flame",
      "A flaming ",
      "Earth",
      "Water"
    );
  }
}

class Water extends Element {
  constructor() {
    super(
      "Water",
      "The element of rivers and rain",
      "A flowing ",
      "Fire",
      "Earth"
    );
  }
}

class Life extends Element {
  constructor() {
    super("Life", "The element of living things", "A living ", "Death", "None");
  }
}

class Death extends Element {
  constructor() {
    super(
      "Death",
      "The element of decay and destruction",
      "A decaying ",
      "Life",
      "None"
    );
  }
}

class Spell {
  constructor(name, description, descriptor, manaCost, power, range, effect) {
    this.name = name;
    this.description = description;
    this.descriptor = descriptor;
    this.manaCost = manaCost;
    this.power = power;
    this.range = range;
    this.effect = effect;
    this.type = "Spell";
  }
}

class Spear extends Spell {
  constructor() {
    super(
      "Spear",
      "An arcane spear",
      "spear flies through the air ",
      5,
      "5d10",
      100,
      "damage"
    );
  }
}

class Shield extends Spell {
  constructor() {
    super(
      "Shield",
      "An arcane shield",
      "shield forms facing ",
      5,
      "1d4",
      0,
      false,
      "tempArmor"
    );
  }
}

class Healing extends Spell {
  constructor() {
    super(
      "Healing",
      "An arcane healing spell",
      "warm light envelops ",
      5,
      "1d8",
      0,
      false,
      "healthIncrease"
    );
  }
}

class Heart extends Spell {
  constructor() {
    super(
      "Heart",
      "An arcane heart",
      "red mist forms around ",
      5,
      "1d4",
      0,
      false,
      "tempHealth"
    );
  }
}

class Restore extends Spell {
  constructor() {
    super(
      "Revitalize",
      "An arcane revitalization spell",
      "green light envelops ",
      5,
      "1d8",
      0,
      false,
      "tempMana"
    );
  }
}

class Direction {
  constructor(name, description, descriptor) {
    this.name = name;
    this.description = description;
    this.descriptor = descriptor;
    this.type = "Direction";
  }
}

class Away extends Direction {
  constructor() {
    super(
      "Away",
      "This direction will cause spells to face or move in the direction you are facing",
      "away from you!"
    );
  }
}

class Left extends Direction {
  constructor() {
    super(
      "Left",
      "This direction will cause spells to face or move to your left",
      "to your left!"
    );
  }
}

class Right extends Direction {
  constructor() {
    super(
      "Right",
      "This direction will cause spells to face or move to your right",
      "to your right!"
    );
  }
}

class Behind extends Direction {
  constructor() {
    super(
      "Behind",
      "This direction will cause spells to face or move behind you",
      "behind you!"
    );
  }
}

class Within extends Direction {
  constructor() {
    super(
      "Within",
      "This direction will cause spells to face or move within you",
      "within you!"
    );
  }
}

class Remember extends Direction {
  constructor() {
    super(
      "Remember",
      "Creates a memory that cannot be taken away",
      "in your mind!"
    );
  }
}

var scrolls = [
  "Earth",
  "Fire",
  "Water",
  "Life",
  "Death",
  "Spear",
  "Shield",
  "Healing",
  "Heart",
  "Restore",
  "Away",
  "Left",
  "Right",
  "Behind",
  "Within",
];

module.exports = {
  Aether,
  Earth,
  Fire,
  Water,
  Life,
  Death,
  Spear,
  Shield,
  Healing,
  Heart,
  Restore,
  Away,
  Left,
  Right,
  Behind,
  Remember,
  Within,
  scrolls,
};
