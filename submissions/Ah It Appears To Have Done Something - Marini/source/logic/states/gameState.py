from enum import Enum

class GameState(Enum):
    START_MENU = 0
    LEVEL_1 = 1
    LEVEL_2 = 2
    LEVEL_3 = 3
    PAUSE_MENU = 4
    END_SCREEN = -1