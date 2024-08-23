from settings import pg, QUICK_EXIT_KEY
from random import randint

strings = ['Thank you for playing my game!', 'I hope you enjoyed it!', 'xoxo <3',
           'I love you!', 'I hope you had fun!', 'I hope you had a good time!', 
           'I hope you had a blast!', 'I hope you had a great time!', 'I hope you had a wonderful time!',
           ]
num_strings = len(strings) - 1

def handle_end_screen_events(game, event):
    pass

def update_end_screen(game):
    string_index = randint(0, num_strings)
    print(strings[string_index])
    print(f"Press '{pg.key.name(QUICK_EXIT_KEY).upper()}' to exit the game.\n")

def render_end_screen(game):
    screen = game.screen

    screen.blit(game.end_screen_surf, (0,0)) #Draw the end of screen

def init_end_screen(game):
    game.final_screen = pg.display.set_mode(game.final_screen.get_size(), flags = pg.RESIZABLE | pg.NOFRAME)