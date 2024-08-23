from settings import PAUSE_KEY, pg
from logic.physicsEntities import DeathEntity

entity_spawn_cooldown = 1000 #Cooldown for spawning entities in milliseconds
last_entity_spawn_time = 0 #Time of the last entity spawn

def handle_start_menu_events(game, event):
    """Function that handles events for the start menu game state"""
    
    if event.type == pg.KEYDOWN:
        if event.key == PAUSE_KEY:
            game.generic_pause_event_handler()
            
    if event.type == pg.MOUSEBUTTONDOWN and event.button == 1 and has_entity_colldown_finished():
        if game.start_button_rect.collidepoint(event.pos): create_start_physics_entity(game)
        elif game.level_button_rect.collidepoint(event.pos): create_level_physics_entity(game) 

def update_start_menu(game):
    """Function that updates the start menu game state"""

    #Player
    game.player.handle_input() #Handle player input
    game.player.move() #Move the player
    game.player.update_animation() #Update the player animation

    #Environment
    [entity.move() for entity in game.entities] #Move all the entities 
    [effect.update_animation() for effect in game.effects] #Update all the effects
    game.update_portal_animation() #Update the portal animation

def render_start_menu(game):
    """Function that renders the start menu game state"""

    screen = game.screen #Rename screen to make draw calls easier to read

    screen.blit(game.start_menu_ground_surf, game.start_menu_ground_rect) #Draw the ground
    screen.blit(game.player.sprite, game.player.rect) #Draw the player
    [screen.blit(effect.sprite, effect.rect) for effect in game.effects] #Draw all the effects
    screen.blit(game.current_portal_sprite, game.portal_rect) #Draw the end of level portal

    screen.blit(game.level_button_surf, game.level_button_rect) #Draw the level button
    screen.blit(game.start_button_surf, game.start_button_rect) #Draw the start button
    [screen.blit(entity.sprite, entity.rect) for entity in game.entities] #Draw all the entities

    if game.should_draw_cursor: screen.blit(game.cursor_surf, pg.mouse.get_pos()) #Draw the cursor

def create_start_physics_entity(game):
    """Function that creates a physics entity at the player's position"""

    game.player.controls_enabled = True #Enable player controls

    game.entities.append(DeathEntity(game = game, mass = 5, sprite = game.start_button_surf, \
                                        rect = game.start_button_rect.copy()))

def create_level_physics_entity(game):
    """Function that creates a physics entity at the level button's position"""
    
    game.player.controls_enabled = True #Enable player controls

    game.entities.append(DeathEntity(game = game, mass = 5, sprite = game.level_button_surf, \
                                        rect = game.level_button_rect.copy()))
    
def has_entity_colldown_finished():
    """Function that returns whether the cooldown for creating a new entity has finished"""

    global last_entity_spawn_time

    current_time = pg.time.get_ticks()
    if current_time - last_entity_spawn_time >= entity_spawn_cooldown or last_entity_spawn_time == 0: #If the cooldown has finished or no entity has been spawned yet
        last_entity_spawn_time = current_time
        return True
    return False

