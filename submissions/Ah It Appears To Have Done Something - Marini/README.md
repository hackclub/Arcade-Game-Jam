# Ah It Appears To Have Done Something

Made for Hack Club Jam of summer 2024, the theme is loopholes, which as stated on [Wikipedia](https://en.wikipedia.org/wiki/Loophole) are:

```
A loophole is an ambiguity or inadequacy in a system, such as a law or security, 
which can be used to circumvent or otherwise avoid the purpose,
implied or explicitly stated, of the system.
```

Name inspired by the meme of the same name (https://youtu.be/bzmIitaLMfA).

## Description

Ah It Appears To Have Done Something is a 2D puzzle platformer structured in a plethora of levels with varying mechanics, in which the player will have to find out a way to reach the end of the level by alternative means, often breaking the boundaries of the game and interacting with the hardware and operating system itself.

Solutions will be available in a separate files to avoid spoilers.

Feel free to contact me at pmarini72107@gmail.com or message me on slack (name: Marini) if you want to report a bug or leave a review, but please keep in mind that this is my first platformer game made for my first game jam in rudimentary framework such as Pygame (i did the best I could in less than two weeks    😭).

IMPORTANT: Game may be interpreted as a virus because of the interaction with the Windows API, if you see any Windows Defender messages or pop ups do not worry I can assure you I write nothing harmful (I know it's not very reassuring but idk to know much about it 😩).
Used Github Copilot a bit to guide me in the right direction to avoid having to look through hundreds of pages of documentation of the Windows API.

## Keybinds and controls

Keybinds are customizable by modifying the settings.py file is so desired (pygame key constants are available right below the keybinds). 

Default keybinds:

* A  &rarr; Move left
* D  &rarr; Move right
* SPACE &rarr; Jump
* ESCAPE &rarr; Pause the game
* R &rarr; Reset the player's position and values
* P &rarr; Exit the game

## Requirements
Windows 10 or 11 (written and tested on Windows 10 22H2).

## Installation and execution
Python 3 required, the specific version of python used to write this project is Python 3.12 64 bit.
All the necessary pip packages can be installed through this command in the windows command prompt or any other equivalent command line tool.

```
pip3 install pygame numpy pillow comtypes pycaw
```

Written with Pygame 2.6.0, Numpy 2.0.1 and Pillow 10.4.0.  
After doing this the program can be launched from any IDE or CLI by starting game.py.  

When you are finished playing the game you can delete all the packages by using this command: 

```
pip3 uninstall pygame numpy pillow comtypes pycaw
```

## Assets credits

* Player spritesheet: https://dani-maccari.itch.io/player-animations-tim  
* Font in lower left of first level: https://poppyworks.itch.io/silver
* Enviroment: https://octoshrimpy.itch.io/tranquil-tunnels 
* Portal sprite: https://pixelnauta.itch.io/pixel-dimensional-portal-32x32 
* Font in pause menu, first level and end screen: https://joebrogers.itch.io/bitpotion
* Pixel speakers in level three: https://gamebanana.com/mods/319025 
* Bouncing blob in level 2: https://cactusturtle.itch.io/bouncing-blue-blob  (resized)
* Smoke effects: https://bdragon1727.itch.io/free-smoke-fx-pixel-2 
* UI Menu Sounds: https://souptonic.itch.io/souptonic-sfx-pack-1-ui-sounds 
* World sounds (player jump, death and portal entry): https://brackeysgames.itch.io/brackeys-platformer-bundle 
* Music by DOS-88 on Youtube: https://www.youtube.com/channel/UC9VhwXkGozOjxLjg72-_W5g (Tracks: Flow State, Rest Easy, Times Enjoyed, HOME BASE)