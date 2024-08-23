import os
os.chdir(os.path.dirname(os.path.abspath(__file__))) #Change the working directory to the directory of the script
del os
import contextlib, ctypes
with contextlib.redirect_stdout(None): #Suppress pygame welcome message
    from settings import LEVEL_RESOLUTIONS, MUSIC_VOLUME, WORLD_SOUNDS_VOLUME, UI_SOUNDS_VOLUME, PORTAL_ANIMATION_SWITCHING_DELAY, MAX_FPS, SCREEN_HEIGHT, PAUSE_MENU_BACKGROUND_ALPHA, QUICK_EXIT_KEY, pg
del contextlib
from logic.states.gameState import GameState
from logic.states.startMenu import handle_start_menu_events, update_start_menu, render_start_menu
from logic.states.level_1 import handle_level_one_events, update_level_one, render_level_one, init_level_one
from logic.states.level_2 import handle_level_two_events, update_level_two, render_level_two, init_level_two
from logic.states.level_3 import handle_level_three_events, update_level_three, render_level_three, init_level_three
from logic.states.pauseMenu import handle_pause_menu_events, update_pause_menu, render_pause_menu
from logic.states.endScreen import handle_end_screen_events, update_end_screen, render_end_screen, init_end_screen
from logic.physicsEntities import Player
from logic.interactibles import GravityController, JumpBlob, Speaker, BouncePad
from random import shuffle, randint

#Constants
_MONITOR_DEFAULTTONEAREST = 2

class Game:
    def __init__(self):
        pg.init()

    	#Game variables
        self.game_state: GameState = GameState.START_MENU
        self.current_level_num: int = self.game_state.value
        self.should_draw_cursor: bool = True

        #Screen settings
        self.final_screen: pg.Surface = pg.display.set_mode((LEVEL_RESOLUTIONS[self.current_level_num]), flags=pg.RESIZABLE) #Final screen
        self.screen: pg.Surface = self.final_screen.copy() #Dummy screen
        pg.display.set_caption("Ah It Appears To Have Done Something")
        pg.display.set_icon(pg.image.load("graphics/loophole_icon.jpg"))
        pg.mouse.set_visible(False) #Hide the mouse cursor

        #Clock and time objects
        self.clock: pg.Clock = pg.time.Clock()

        #Game objects
        self.player = Player(self)
        self.entities = []
        self.effects = []
        self.monitor_thread = None # Thread to monitor brightness changes
        self.monitoring_brightness_event = None # Event to control the brightness monitoring thread
                
        # Load necessary DLLs
        self.user32 = ctypes.WinDLL('user32')
        self.dxva2 = ctypes.WinDLL('dxva2')

        # Get necessary window and monitor handles
        self.window_handle = pg.display.get_wm_info()['window'] # Get handle of the current window
        self.hardware_monitor = self.user32.MonitorFromWindow(self.window_handle, _MONITOR_DEFAULTTONEAREST) # Get handle of the monitor the game is running on

        #Init assets
        self.init_assets()

        init_level_three(self)

    def run(self):
        """Main game loop"""	
        while True:
            self.handle_events()
            self.update()
            self.render()

    def handle_events(self):
        """Function that handles generic events for the game which are not specific to any game state and by consulting the current game state, calls the appropriate event handling function"""
        for event in pg.event.get():
            if event.type == pg.QUIT or (event.type == pg.KEYDOWN and event.key == QUICK_EXIT_KEY):
                self.quit_game()

            elif event.type == pg.VIDEORESIZE:
                self.final_screen = pg.display.set_mode((event.w, event.h), flags=pg.RESIZABLE)

            elif event.type == pg.WINDOWLEAVE: self.handle_mouse_exit_event()
            elif event.type == pg.WINDOWENTER: self.handle_mouse_enter_event()
            
            match self.game_state:
                case GameState.START_MENU: handle_start_menu_events(self, event)
                case GameState.LEVEL_1: handle_level_one_events(self, event)
                case GameState.LEVEL_2: handle_level_two_events(self, event)
                case GameState.LEVEL_3: handle_level_three_events(self, event)
                case GameState.PAUSE_MENU: handle_pause_menu_events(self, event)
                case GameState.END_SCREEN: handle_end_screen_events(self, event)
            
    def update(self):
        """Function that updates generic values not specific to any game state and calls the appropriate update function by consulting the current game state"""

        pg.display.set_caption(f" Ah It Appears To Have Done Something - FPS: {int(self.clock.get_fps())}") #Update the window title to show the FPS

        #If the player has just finished the damaged animation reset the player
        if self.player.status == 'damaged' and self.player.current_animation_frame == 3: 
            self.player.reset()
        
        match self.game_state:
            case GameState.START_MENU: update_start_menu(self)
            case GameState.LEVEL_1: update_level_one(self)
            case GameState.LEVEL_2: update_level_two(self)
            case GameState.LEVEL_3: update_level_three(self)
            case GameState.PAUSE_MENU: update_pause_menu(self)
            case GameState.END_SCREEN: update_end_screen(self)

    def render(self):
        """Function that renders the game by calling the appropriate render function by consulting the current game state""" 
        
        match self.game_state:
            case GameState.START_MENU: render_start_menu(self)
            case GameState.LEVEL_1: render_level_one(self)
            case GameState.LEVEL_2: render_level_two(self)
            case GameState.LEVEL_3: render_level_three(self)
            case GameState.PAUSE_MENU: render_pause_menu(self)
            case GameState.END_SCREEN: render_end_screen(self)

        self.final_screen.blit(pg.transform.scale(self.screen, self.final_screen.get_rect().size), (0, 0))
        pg.display.flip()
        self.clock.tick(MAX_FPS if self.game_state != GameState.END_SCREEN else 3) 
        #Could also use tick_busy_loop() for more accurate timing but it would use more CPU and regular tick accuracy is fine for this game

    def init_assets(self):
        """Function that initializes all the assets for the game"""

        #Init general assets
        self.cursor_surf: pg.Surface = pg.image.load("graphics/assets/cursor.png").convert_alpha()

            #Music 
        self.background_tracks: list[str] = ["audio/background tracks/Flow_State.mp3", "audio/background tracks/Rest_Easy.mp3", 
                                             "audio/background tracks/Times_Enjoyed.mp3", "audio/background tracks/HOME_BASE.mp3"]
        shuffle(self.background_tracks) #Randomize the order of the background tracks    

        pg.mixer.music.load(self.background_tracks[self.current_level_num]) #Load the music
        pg.mixer.music.set_volume(MUSIC_VOLUME) #Set the volume of the music
        pg.mixer.music.play(loops=-1) #Start playing the music on loop
            # World sounds
        self.death_sound: pg.mixer.Sound = pg.mixer.Sound("audio/sounds/world/death.wav")
        self.death_sound.set_volume(WORLD_SOUNDS_VOLUME) #Set the volume of the death sound
        self.jump_sound: pg.mixer.Sound = pg.mixer.Sound("audio/sounds/world/jump.wav")
        self.jump_sound.set_volume(WORLD_SOUNDS_VOLUME) #Set the volume of the jump sound
        self.portal_sound: pg.mixer.Sound = pg.mixer.Sound("audio/sounds/world/portal entry.wav")
        self.portal_sound.set_volume(WORLD_SOUNDS_VOLUME) #Set the volume of the portal sound

            # UI sounds
        self.pause_sound: pg.mixer.Sound = pg.mixer.Sound("audio/sounds/ui/pause.wav")
        self.pause_sound.set_volume(UI_SOUNDS_VOLUME) #Set the volume of the pause sound
        self.resume_sound: pg.mixer.Sound = pg.mixer.Sound("audio/sounds/ui/resume.wav")
        self.resume_sound.set_volume(UI_SOUNDS_VOLUME)
        self.exit_sound: pg.mixer.Sound = pg.mixer.Sound("audio/sounds/ui/exit.wav")
        self.exit_sound.set_volume(UI_SOUNDS_VOLUME)

            # Portal animation and sprites
        self.portal_coords: list[tuple] = [(800, 494), (950, 334), (949, 94), (95, 687)] #Coordinates of the portal in each level (bottomright) (DO NOT CHANGE) (result may appear strange but its because the portal sprite have extra width to accomodate the particles)
        self.portal_animation_current_frame: int = 0 #Variable to keep track of the index of the current frame of the portal animation
        self.portal_animation_switching_delay: int = PORTAL_ANIMATION_SWITCHING_DELAY #Variable to keep track of when to progress the animation
        self.portal_animation: list[pg.Surface] = [pg.image.load(f"graphics/assets/portal/{i}.png").convert_alpha() for i in range(1, 7)]
        self.current_portal_sprite: pg.Surface = self.portal_animation[self.portal_animation_current_frame] #Variable to keep track of the current sprite of the portal animation
        self.portal_rect: pg.Rect = self.current_portal_sprite.get_rect(bottomright = self.portal_coords[self.current_level_num]) 

        #Init start menu

        self.level_button_surf: pg.Surface = pg.image.load("graphics/assets/start menu/level.png").convert_alpha()
        self.level_button_rect: pg.Rect = self.level_button_surf.get_rect(topleft = (102, (SCREEN_HEIGHT // 4) + 100))

        self.start_button_surf: pg.Surface = pg.image.load("graphics/assets/start menu/start.png").convert_alpha()
        self.start_button_rect: pg.Rect = self.start_button_surf.get_rect(topleft = (502, (SCREEN_HEIGHT // 4) + 100))

        self.start_menu_ground_surf: pg.Surface = pg.image.load("graphics/assets/start menu/ground.png").convert_alpha()
        self.start_menu_ground_rect: pg.Rect = self.start_menu_ground_surf.get_rect(bottomleft = (0, LEVEL_RESOLUTIONS[0][1]))

        #Level 1 assets
        self.level_one_ground_surf: pg.Surface = pg.image.load("graphics/assets/level 1/ground.png").convert_alpha()
        self.level_one_ground_rect: pg.Rect = self.level_one_ground_surf.get_rect(bottomleft = (0, LEVEL_RESOLUTIONS[1][1]))
        self.level_one_grav_controller_y: int = 150
        self.level_one_grav_controllers: list[GravityController] = (GravityController(game = self, coords = (175, self.level_one_grav_controller_y), direction='left'),
                                                                    GravityController(game = self, coords = (743, self.level_one_grav_controller_y), direction='right'))
        
        #Level 2 assets
        self.level_two_ground_surf: pg.Surface = pg.image.load("graphics/assets/level 2/ground.png").convert_alpha()
        self.level_two_ground_rect: pg.Rect = self.level_two_ground_surf.get_rect(bottomleft = (0, LEVEL_RESOLUTIONS[2][1]))
        self.level_two_env_mask: pg.Surface = pg.image.load("graphics/assets/level 2/mask.png").convert_alpha() #Half transparent black circle used to show the player in the dark
        self.level_two_blob: JumpBlob = JumpBlob(game = self, bottom_left_coords = (1, LEVEL_RESOLUTIONS[2][1]))
        
        #Level 3 assets
        self.level_three_ground_surf: pg.Surface = pg.image.load("graphics/assets/level 3/ground.png").convert_alpha()
        self.level_three_ground_rect: pg.Rect = self.level_three_ground_surf.get_rect(bottomleft = (0, LEVEL_RESOLUTIONS[3][1]))
        self.level_three_speaker: Speaker = Speaker(game = self, coords = (136, 559))
        self.level_three_bounce_pads: list[BouncePad] = [BouncePad(game = self, direction = 'up right', coords = (175, 310))]

        #Pause menu
        self.paused_game_state: GameState = self.game_state #Variable to keep track of the previous game state used to return to the previous game state when unpausing
        self.darken_surf: pg.Surface = pg.Surface(LEVEL_RESOLUTIONS[self.current_level_num]) #Create a surface to darken the screen
        self.darken_surf.set_alpha(PAUSE_MENU_BACKGROUND_ALPHA) #Set the alpha value of the darken surface

        self.pause_menu_pause_text: pg.Surface = pg.image.load("graphics/assets/pause menu/pause.png").convert_alpha()
        self.pause_menu_pause_rect: pg.Rect = self.pause_menu_pause_text.get_rect(midtop = (LEVEL_RESOLUTIONS[self.current_level_num][0] // 2, LEVEL_RESOLUTIONS[self.current_level_num][1] // 4))

        self.pause_menu_resume_text: pg.Surface = pg.image.load("graphics/assets/pause menu/resume.png").convert_alpha()
        self.pause_menu_resume_rect: pg.Rect = self.pause_menu_resume_text.get_rect(midtop = (LEVEL_RESOLUTIONS[self.current_level_num][0] // 2, LEVEL_RESOLUTIONS[self.current_level_num][1] // 2 - 50))

        self.pause_menu_quit_text: pg.Surface = pg.image.load("graphics/assets/pause menu/quit.png").convert_alpha()
        self.pause_menu_quit_rect: pg.Rect = self.pause_menu_quit_text.get_rect(midtop = (LEVEL_RESOLUTIONS[self.current_level_num][0] // 2, (LEVEL_RESOLUTIONS[self.current_level_num][1] // 4) * 3 - 100))

        #End screen
        self.end_screen_surf: pg.Surface = pg.image.load("graphics/assets/end_screen.png").convert_alpha()

    def update_portal_animation(self): #Written here so that it can be reused in all game states
        """Function that updates the portal animation"""
        self.portal_animation_switching_delay -= 1 #Decrease the delay
        if self.portal_animation_switching_delay == 0: #If the delay has reached 0
            self.portal_animation_switching_delay = PORTAL_ANIMATION_SWITCHING_DELAY #Reset the delay
            self.portal_animation_current_frame += 1 #Progress the frame index
            if self.portal_animation_current_frame == len(self.portal_animation): self.portal_animation_current_frame = 0 #Reset the frame index if it exceeds the length of the animation
            self.current_portal_sprite = self.portal_animation[self.portal_animation_current_frame] #Update the current sprite

    def advance_level(self):
        """Function that advances the level"""
        if self.game_state != GameState.LEVEL_3: #If the game state is not the end screen
            self.player.reset() #Reset the player
            self.current_level_num += 1 #Advance the level counter
            self.game_state = GameState(self.current_level_num) #Update the game state

            match self.game_state: #Level specific entry settings
                case GameState.LEVEL_1:
                    init_level_one(self)
                case GameState.LEVEL_2:
                    init_level_two(self)
                case GameState.LEVEL_3:
                    init_level_three(self)

            self.update_screen_dimensions() #Update the screen dimensions
            self.darken_surf = pg.transform.scale(self.darken_surf, LEVEL_RESOLUTIONS[self.current_level_num]) #Update the darken surface
            self.pause_menu_pause_rect.midtop = (LEVEL_RESOLUTIONS[self.current_level_num][0] // 2, LEVEL_RESOLUTIONS[self.current_level_num][1] // 4) #Update the pause text rect
            self.pause_menu_resume_rect.midtop = (LEVEL_RESOLUTIONS[self.current_level_num][0] // 2, LEVEL_RESOLUTIONS[self.current_level_num][1] // 2 - 50) #Update the resume text rect
            self.pause_menu_quit_rect.midtop = (LEVEL_RESOLUTIONS[self.current_level_num][0] // 2, (LEVEL_RESOLUTIONS[self.current_level_num][1] // 4) * 3 - 100) #Update the quit text rect
            self.portal_rect = self.current_portal_sprite.get_rect(bottomright = self.portal_coords[self.current_level_num]) #Update the portal rect
            pg.mixer.music.load(self.background_tracks[self.current_level_num]) #Load the new level music
            pg.mixer.music.play(loops=-1) #Start playing the music on loop
        else:
            self.current_level_num = -1
            self.game_state = GameState.END_SCREEN
            self.update_screen_dimensions()
            init_end_screen(self)
            pg.mixer.music.load(self.background_tracks[randint(1, len(self.background_tracks) - 1)]) #Load the new level music
            pg.mixer.music.play(loops=-1) #Start playing the music on loop

    def generic_pause_event_handler(self):
        """Function that handles the pause event"""

        self.pause_sound.play() #Play the pause sound
        if not self.player.is_in_air: self.player.status = 'standing'
        self.paused_game_state = self.game_state
        self.game_state = GameState.PAUSE_MENU
        pg.mixer.music.pause() #Pause the music

    def update_screen_dimensions(self):
        """Function that updates the screen dimensions"""
        self.screen = pg.display.set_mode(LEVEL_RESOLUTIONS[self.current_level_num])	

    def get_window_position(self):
        """Function that gets the topleft window position"""
        ctypes.windll.user32.GetWindowRect(self.window_handle, ctypes.byref(self.hardware_window_rect))
        return (self.hardware_window_rect.left, self.hardware_window_rect.top)

    def clamp_to_screen(self, x, y):
        """Function that clamps the desired x and y values to the screen dimensions to avoid IndexErrors and to keep the player on screen."""
        
        SCREEN_WIDTH, SCREEN_HEIGHT = LEVEL_RESOLUTIONS[self.current_level_num]

        clamped_x = max(0, min(x, SCREEN_WIDTH - 1))
        clamped_y = max(0, min(y, SCREEN_HEIGHT - 1))

        return clamped_x, clamped_y

    def handle_mouse_exit_event(self):
        """Function that handles the focus lost event"""
        self.should_draw_cursor = False
        if not self.game_state == GameState.LEVEL_1 and not self.game_state == GameState.END_SCREEN and not self.game_state == GameState.LEVEL_2: # If the game state is not level 1 pause the game (because the player has to exit the window to be able to move it)
            self.generic_pause_event_handler()

    def handle_mouse_enter_event(self):
        """Function that handles the focus gained event"""
        if not self.game_state == GameState.LEVEL_1 and not self.game_state == GameState.END_SCREEN and not self.game_state == GameState.LEVEL_2:
            self.should_draw_cursor = True #Show the cursor
            self.game_state = self.paused_game_state #Return to the previous game state
            pg.mixer.music.unpause() #Unpause the music

    def get_monitor_handle(self):
        """Function that gets the handle of the monitor the game is running on"""
        return self.user32.MonitorFromWindow(self.window_handle, 0)

    def quit_game(self):
        pg.quit()
        exit()
        quit()

if __name__ == "__main__":
    Game().run()