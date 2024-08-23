class Room {
  constructor(
    name,
    id,
    description,
    width,
    height,
    isLocked = false,
    lockedDescription = "The door is locked."
  ) {
    this.name = name;
    this.id = id;
    this.description = description;
    this.width = width;
    this.height = height;
    this.isVisited = false;
    this.isLocked = isLocked;
    this.lockedDescription = lockedDescription;
    this.items = {};
    this.exits = {};
  }
}

class Shop extends Room {
  constructor(
    name,
    id,
    description,
    width,
    height,
    vendor,
    shopItems,
    currency,
    markup,
    exits,
  ) {
    super(name, id, description, width, height, exits);
    this.vendor = vendor;
    this.shopItems = shopItems;
    this.currency = currency;
    this.markup = markup;
  }
}

module.exports = { Room, Shop };
