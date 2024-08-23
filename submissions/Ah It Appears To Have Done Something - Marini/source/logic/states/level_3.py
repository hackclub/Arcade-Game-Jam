from settings import pg, PAUSE_KEY, WORLD_SOUNDS_VOLUME
import threading
import time
from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume
from comtypes import CLSCTX_ALL

# Function to get the system volume on Windows
def get_system_volume():
    devices = AudioUtilities.GetSpeakers()
    interface = devices.Activate(
        IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
    volume = interface.QueryInterface(IAudioEndpointVolume)
    current_volume = volume.GetMasterVolumeLevelScalar()
    return round(current_volume * 100)  # Convert to percentage

# Daemon thread function to monitor system volume
def monitor_system_volume(game):
    while True:
        try:
            volume = get_system_volume()
            if volume == 0 or volume == 100:
                game.level_three_speaker.switch_status()
        except Exception as e:
            game.level_three_speaker.switch_status()
        time.sleep(1)  # Check every second

def handle_level_three_events(game, event):
    """Function that handles events for the level three game state"""
    
    if event.type == pg.KEYDOWN:
        if event.key == PAUSE_KEY:
            game.generic_pause_event_handler()

def update_level_three(game):
    
    player = game.player #Rename player to make code easier to read

    #Player
    player.handle_input() #Handle player input
    player.move() #Move the player
    player.update_animation() #Update the player animation
    
    #Environment
    game.update_portal_animation() #Update the portal animation
    [effect.update_animation() for effect in game.effects] #Update all the effects
    
    #Interactibles
        #Collision with the speaker
    if player.rect.colliderect(game.level_three_speaker.rect) and not game.level_three_speaker.is_player_below() and game.level_three_speaker.is_on(): #If the player is colliding with the speaker while it's on and it isn't inside of it
        exec(game.level_three_speaker.action) #Execute the speaker action
        game.death_sound.set_volume(WORLD_SOUNDS_VOLUME) #Reset the volume of the death sound

        #Bounce pads
    for pad in game.level_three_bounce_pads:
        if player.rect.colliderect(pad.rect):
            player.spawn_bouncing_smoke_effect()
            exec(pad.action)

def render_level_three(game):
    screen = game.screen

    screen.fill((37, 30, 38)) #Fill the screen with a dark purple color (background color)
    screen.blit(game.level_three_speaker.sprite, game.level_three_speaker.rect) #Draw the speakers
    [screen.blit(effect.sprite, effect.rect) for effect in game.effects] #Draw all the effects
    screen.blit(game.level_three_ground_surf, game.level_three_ground_rect) #Draw the ground
    [screen.blit(pad.sprite, pad.rect) for pad in game.level_three_bounce_pads] #Draw the bounce pads
    screen.blit(game.current_portal_sprite, game.portal_rect) #Draw the end of level portal
    screen.blit(game.player.sprite, game.player.rect) #Draw the player

    if game.should_draw_cursor: screen.blit(game.cursor_surf, pg.mouse.get_pos()) #Draw the cursor

# Start the daemon thread when the game starts
def init_level_three(game):
    volume_thread = threading.Thread(target=monitor_system_volume, args=(game,))
    volume_thread.daemon = True
    volume_thread.start()