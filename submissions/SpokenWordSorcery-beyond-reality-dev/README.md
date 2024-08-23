# Spoken Word Sorcery <!-- omit from toc -->

## Table of Contents <!-- omit from toc -->

- [About](#about)
- [FAQ](#faq)
- [Installation](#installation)
  - [Binary Installation](#binary-installation)
  - [Manual Installation](#manual-installation)
- [How to Play](#how-to-play)
  - [General](#general)
  - [Movement](#movement)
  - [Item Management](#item-management)
  - [Combat](#combat)
  - [Resting](#resting)
  - [Remembering](#remembering)
- [Features](#features)
  - [Prologue](#prologue)
  - [Game Speed Settings](#game-speed-settings)
  - [Inventory System](#inventory-system)
  - [Combat System](#combat-system)
  - [Resting System](#resting-system)
  - [Visual Map](#visual-map)
  - [Procedural Generation](#procedural-generation)
- [Miscellaneous](#miscellaneous)
  - [AI Disclosure](#ai-disclosure)

## About

This is the official repository for Spoken Word Sorcery, a text-based role-playing game (RPG) written in JavaScript. The game is designed to be as open world as possible, within the constraints of the format and technical limitations. It utilizes the Electron platform to allow for distribution and release.

## FAQ

### How can I install Spoken Word Sorcery? <!-- omit from toc -->

Please see the [installation instructions](#installation) below.

### How can I play Spoken Word Sorcery? <!-- omit from toc -->

Please see the [how to play section](#how-to-play) below.

### Why do I get a warning when I try to run Spoken Word Sorcery? <!-- omit from toc -->

Spoken Word Sorcery is not signed, so some operating systems may give you a warning when you try to run it. You can be confident that the game is safe to run, especially since it is an Electron PWA that runs in a secured sandbox, but if you are still concerned, you can check the source code yourself!

### What do I do if the screen is greyed out and nothing is happening on the start of a new game? <!-- omit from toc -->

On some devices/browser configurations, there are stricter limits on recursion than others, which can sometimes cause an invisible crash during the map generation at the very beginning of the game. If this occurs, you can simply close and reopen the game until it works. This is a known issue that I am working on fixing, although it is a challenging one due to device-specific limitations.

### How is this related to the Arcade Club Game Jam theme "loopholes"? <!-- omit from toc -->

No spoilers! You will understand once you complete the prologue.

### How can I report a bug or suggest a feature? <!-- omit from toc -->

Please open an issue on the [issues page](https://github.com/beyond-reality-dev/Spoken-Word-Sorcery/issues), or message me directly.

### How can I contribute to Spoken Word Sorcery? <!-- omit from toc -->

Please open a pull request on the [pull requests page](https://github.com/beyond-reality-dev/Spoken-Word-Sorcery/pulls), or message me directly.

## Installation

Please note that Spoken Word Sorcery has only been tested on a Windows 11 machine with a 1080p display. It should work on other operating systems and displays, but there may be some graphical or other issues.

### Binary Installation

1. Download the latest release from the [releases page](https://github.com/beyond-reality-dev/Spoken-Word-Sorcery/releases).
2. Extract the contents of the zip file.
3. Run the executable file.
4. If you get a warning from Windows Defender SmartScreen, click "More info" and then "Run anyway".
5. If you have any issues, please open an issue on the [issues page](https://github.com/beyond-reality-dev/Spoken-Word-Sorcery/issues), or message me directly.

### Manual Installation

1. Clone the repository.
2. Install Node.js and npm.
3. Run `npm install` in the repository directory.
4. Run `npm start` to start the game.
5. If you have any issues, please open an issue on the [issues page](https://github.com/beyond-reality-dev/Spoken-Word-Sorcery/issues), or message me directly.

## How to Play

The introduction to the game will give you a good idea of how to play, but there are some more detailed instructions below. And remember, you can always type "help," "info," or "instructions" to get a list of commands that you can use in the game.

### General

To play Spoken Word Sorcery, you can type phrases to interact with the game.

You may optionally begin phrases with the letter "I" but it is not required.

Similarly, you may optionally insert prepositions, articles, or other words that do not change the meaning of the phrase, like "a," "an," "to," and "the."

For example, you can type either "I go north," "go to the north," etc. to move north.

Punctuation and capitalization is irrelevant, and you can combine phrases with "and" in most cases.

### Movement

To move to a room connected to your current location, you can type "go," "run," "exit," "move," or "walk" followed by a cardinal (compass) direction.

### Item Management

To pick up an item, you can type "take," "grab," "acquire," "obtain," "pick up," or "lift" followed by the item name.

To drop an item, you can type "drop," "discard," "leave," or "lose" followed by the item name.

To equip an item, you can type "equip" or "put on" followed by the item name.

To unequip an item, you can type "unequip" or "take off" followed by the item name.

For consumables, you can type "use," "consume," "drink," "eat," or "ingest" followed by the item name.

### Combat

To attack an enemy that is in front of you with a melee weapon, you can type "hit," "stab," "fight," "attack," "strike," "slash," "swing," or "thrust," followed by the weapon you wish to use. Optionally, you can add certain words like "with" before the weapon name. For example, "hit with sword," "stab with dagger," "swing sword," etc. will all work.

To attack an enemy that is farther away or out of reach with a ranged weapon, you can type "aim," "fire," "shoot," "snipe," "throw," or "launch" followed by the weapon you wish to use. Optionally, you can add certain words like "with" before the weapon name. For example, "aim with bow," "fire crossbow," etc. will all work.

To use a spell, you can type "say," "yell," "cast," "chant," "shout," "speak," "utter," "mutter," or "whisper" followed by the spell phrase.

To turn and phase a different direction, you can type "turn," "face," or "look" followed by the direction, left or right, you want to face. If you wish to only turn 45 degrees, rather than 90 degrees, you can add "slightly" or "halfway" before the direction. For example, "turn slightly left," "face halfway right," etc. will work.

To move during combat you can type "go," "run," "exit," "move," or "walk" followed by a direction, like "forward," "backward," "left," or "right," then a distance in feet, with a maximum of 20, optionally followed by the word "feet." For example "go forward 5 feet," "run left 10 feet." The grid is broken up into tiles, and each tile is 5 feet wide. Since moving diagonally requires you to move 7.5 feet, movements diagonally must be made in those increments, for example "go left forward 7.5 feet," or "run right backward 15 feet." Please note that the due to the keyword nature of the game, the order DOES matter. For example, "go 5 feet forward" will not work, but "go forward 5 feet" will.

### Resting

If you are in a safe location, you can type "rest" or "sleep" to regain health and mana.

### Remembering

To remember a phrase, you can type "remember" followed by the phrase you want to remember.

## Features

### Prologue

The prologue to the game is a short, linear introduction to the game's mechanics and some of its lore. Afterwards, players are free to explore the largely procedurally generated world and continue the main story.

### Game Speed Settings

Users can select how much of a delay they want between lines being printed on the screen. The options range from no delay to a four second delay, which is roughly the speed that it takes to easily read most of the lines as they are being printed. The default is a one second delay.

### Inventory System

Users can pick up, drop, equip, and unequip items, and view their items in the inventory screen. These items determine player stats like armor, attack, and speed. They also contribute to the weight that the player is carrying, which will affect their speed and other stats in the future. Items are persistent in rooms, and the player can move and store items.

### Combat System

The combat system is turn-based, with the player and enemies taking turns to attack. The enemies and player maneuver around a grid, and the player can attack with melee or ranged weapons, or use spells. The player and enemies can only move a certain distance each turn. The player can also turn to face different directions, in order to target different enemies. The player can also use items in combat, like potions and other consumables.

### Resting System

Certain rooms in the game allow the player to rest, which will fully restore their health and mana. They cannot rest while in combat or outside of these rooms.

### Visual Map

The game has a visual map that shows the player's current location and the locations of the rooms that are directly connected to it, and those that are connected to those rooms, and so on. There is a fog of war system that hides rooms that are not attached to a room that the player has already visited. The player can move to any room that is directly connected to their current room, assuming it is not locked, and the map will update to show their new location. 

During combat, there is also now a tactical map that is displayed. The tactical map shows the player's current location, the direction that they are facing, and the locations of the enemies that are in the room. It also displays the rooms that are directly connected to the player's current room, although no others, due to technical limitations and the fact that the player is not able to move during combat.

After the prologue has been completed, there is also a world map that the player can use to see other regions of the world that they can travel to. The world map is not interactive, but it does show the locations of the regions that the player can travel to, and the connections between them.

### Procedural Generation

Most character and place names in the game are entirely procedurally generated, using a Markov chain algorithm. This allows for a large number of unique names to be generated, which is important for the open world format of the game. It also allows for many unique items to be generated.

The game also uses procedural generation to create the layout of the world, including the locations of the rooms and the connections between them. This allows for a large, open world to be created, with many different regions and locations to explore.

The game world is large, largely because of the procedural generation that is used to create it. While there are around 100 handcrafted rooms and locations, the game world can have as many as 3,000 rooms and locations, depending on various factors such as the size of the ocean that is generated. The game world is divided into regions, each of which has its own unique features and locations based on its biome.

## Miscellaneous

### AI Disclosure

GitHub Copilot was used for some boilerplate/autocomplete code, but all substantial programming and creative work was done by myself.