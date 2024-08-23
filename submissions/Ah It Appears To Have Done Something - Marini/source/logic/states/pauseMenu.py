from logic.states.gameState import GameState
from settings import PAUSE_KEY, pg

def handle_pause_menu_events(game, event):
    """Function that handles events for the pause menu game state"""
    if event.type == pg.KEYDOWN and event.key == PAUSE_KEY:
        game.resume_sound.play() #Play the resume sound
        game.game_state = game.paused_game_state
        pg.mixer.music.unpause() #Unpause the music

    if event.type == pg.MOUSEBUTTONDOWN and event.button == 1:
        if game.pause_menu_resume_rect.collidepoint(event.pos): 
            game.resume_sound.play() #Play the resume sound
            game.game_state = game.paused_game_state
        elif game.pause_menu_quit_rect.collidepoint(event.pos): 
            game.exit_sound.play() #Play the exit sound
            game.quit_game()

def update_pause_menu(game):
    """Function that updates the pause menu game state"""
    match game.paused_game_state:
        case GameState.START_MENU | GameState.LEVEL_1 | GameState.LEVEL_2 | GameState.LEVEL_3:
            game.update_portal_animation() #Update the portal animation
            game.player.update_animation() #Update the player animation
            [effect.update_animation() for effect in game.effects] #Update all the effects

def render_pause_menu(game):
    """Function that renders the pause menu game state"""
    screen = game.screen #Rename screen to make draw calls easier to read
    
    match game.paused_game_state:
        case GameState.START_MENU:
            #render_start_menu(game) #Could also do this but it would also draw the cursor (a fix could be moving the cursor drawing to the main render function in game.py)
            screen.blit(game.start_menu_ground_surf, game.start_menu_ground_rect) #Draw the ground
            screen.blit(game.level_button_surf, game.level_button_rect) #Draw the level button
            screen.blit(game.start_button_surf, game.start_button_rect) #Draw the start button
            [screen.blit(entity.sprite, entity.rect) for entity in game.entities] #Draw all the entities
            [screen.blit(effect.sprite, effect.rect) for effect in game.effects] #Draw all the effects
            screen.blit(game.player.sprite, game.player.rect) #Draw the player
            screen.blit(game.current_portal_sprite, game.portal_rect) #Draw the end of level portal

        case GameState.LEVEL_1:    
            screen.blit(game.level_one_ground_surf, game.level_one_ground_rect) #Draw the ground
            [screen.blit(effect.sprite, effect.rect) for effect in game.effects] #Draw all the effects
            screen.blit(game.player.sprite, game.player.rect) #Draw the player
            screen.blit(game.current_portal_sprite, game.portal_rect) #Draw the end of level portal

        case GameState.LEVEL_2:
            screen.blit(game.level_two_ground_surf, game.level_two_ground_rect) #Draw the ground
            [screen.blit(effect.sprite, effect.rect) for effect in game.effects] #Draw all the effects
            screen.blit(game.player.sprite, game.player.rect) #Draw the player
            screen.blit(game.current_portal_sprite, game.portal_rect) #Draw the end of level portal
            screen.blit(game.level_two_blob.sprite, game.level_two_blob.rect) #Draw jump pad

            if game.player.status == 'asleep': screen.blit(game.level_two_env_mask, (0, 0)) #Draw the environment mask if the player is still asleep

        case GameState.LEVEL_3:
            screen.fill((37, 30, 38)) #Fill the screen with a dark purple color (background color)
            screen.blit(game.level_three_ground_surf, game.level_three_ground_rect) #Draw the ground
            [screen.blit(pad.sprite, pad.rect) for pad in game.level_three_bounce_pads] #Draw the bounce pads
            screen.blit(game.current_portal_sprite, game.portal_rect) #Draw the end of level portal
            [screen.blit(effect.sprite, effect.rect) for effect in game.effects] #Draw all the effects
            screen.blit(game.player.sprite, game.player.rect) #Draw the player

    screen.blit(game.darken_surf, (0, 0)) #Darken the screen
    screen.blit(game.pause_menu_pause_text, game.pause_menu_pause_rect) #Draw the pause text
    screen.blit(game.pause_menu_resume_text, game.pause_menu_resume_rect) #Draw the resume text
    screen.blit(game.pause_menu_quit_text, game.pause_menu_quit_rect) #Draw the restart text
    if game.should_draw_cursor: screen.blit(game.cursor_surf, pg.mouse.get_pos()) #Draw the cursor
