import ctypes
from settings import PAUSE_KEY, pg

def handle_level_one_events(game, event):
    """Function that handles events for the level one game state"""
    
    if event.type == pg.KEYDOWN:
        if event.key == PAUSE_KEY:
            game.generic_pause_event_handler()

    elif event.type == pg.WINDOWMOVED:
        game.last_window_position = game.current_window_position
        game.current_window_position = game.get_window_position()
        if game.player.should_float and game.player.controls_enabled == False: move_player_relative_to_window(game) #Moves the player of a relative amount of the difference between the last and current window position

def update_level_one(game):

    player = game.player #Rename player to make code easier to read

    #Player
    player.handle_input() #Handle player input
    player.move() #Move the player
    player.update_animation() #Update the player animation
    
    #Environment
    game.update_portal_animation() #Update the portal animation
    [effect.update_animation() for effect in game.effects] #Update all the effects
    [grav_controller.update_animation() for grav_controller in game.level_one_grav_controllers] #Update the gravity controllers animations
    for grav_controller in game.level_one_grav_controllers: #Check for collision between the gravity controllers and the player
        if player.rect.colliderect(grav_controller.rect) and grav_controller.can_be_actived():
            exec(grav_controller.action)

def render_level_one(game):
    screen = game.screen

    screen.blit(game.level_one_ground_surf, game.level_one_ground_rect) #Draw the ground
    [screen.blit(grav_controller.sprite, grav_controller.rect) for grav_controller in game.level_one_grav_controllers] #Draw the gravity controllers
    screen.blit(game.current_portal_sprite, game.portal_rect) #Draw the end of level portal
    [screen.blit(effect.sprite, effect.rect) for effect in game.effects] #Draw all the effects
    screen.blit(game.player.sprite, game.player.rect) #Draw the player

    if game.should_draw_cursor: screen.blit(game.cursor_surf, pg.mouse.get_pos()) #Draw the cursor

def init_level_one(game):
    game.should_draw_cursor = False #Set the cursor to be drawn

    # Get the window handle on Windows
    game.window_handle = pg.display.get_wm_info()['window']
    game.hardware_window_rect = RECT()
    game.current_window_position = game.get_window_position()
    game.last_window_position = None


def move_player_relative_to_window(game):
    """Function that moves the player of a relative amount of the difference between the last and current window position"""

    player = game.player

    if game.last_window_position is not None:
        x_diff = int((game.current_window_position[0] - game.last_window_position[0]) * 1.15) #Multiply by 1.15 to make the player move slightly faster than the window
        y_diff = int((game.current_window_position[1] - game.last_window_position[1]) * 1.15) #Multiply by 1.15 to make the player move slightly faster than the window

    if game.level_one_grav_controller_y <= game.player.rect.centery - y_diff <= game.level_one_grav_controller_y + 128:  #If the player is in the y range of the gravity controller
    
        start_x = player.rect.centerx
        end_x = player.rect.centerx - x_diff

        for grav_controller in game.level_one_grav_controllers:
            if start_x <= grav_controller.rect.centerx <= end_x and grav_controller.can_be_actived(): #If the line traced between start_x and end_x intersects with the gravity controller and it can be activated
                exec(grav_controller.action) #Execute the action of the gravity controller
                player.rect.center = (player.rect.centerx - x_diff, player.rect.centery - y_diff) #Move the player
                player.velocity[0] = 3 if x_diff > 0 else -3 #Set the player's velocity to 3 if the player is the window has moved right, otherwise to -3 to make exiting the portal easier for the player
                return
        
        # Move the player if no gravity controller is found within the range
        player.rect.center = (player.rect.centerx - x_diff, player.rect.centery - y_diff) 

    else:  # Move the player if not in the y range of the gravity controller
        player.rect.center = (player.rect.centerx - x_diff, player.rect.centery - y_diff)

# Define the RECT structure
class RECT(ctypes.Structure):
    _fields_ = [("left", ctypes.c_long),
                ("top", ctypes.c_long),
                ("right", ctypes.c_long),
                ("bottom", ctypes.c_long)]
