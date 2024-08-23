from settings import pg, WORLD_SOUNDS_VOLUME
from random import randint

class Interactibles:
    def __init__(self, game, sprite = None, rect = None, action = None):
        self.game = game
        self.sprite = sprite
        self.rect = rect
        self.action = action

class JumpBlob(Interactibles):
    def __init__(self, game, bottom_left_coords):
        super().__init__(game)

        #Graphical representation
        self.current_frame = 0
        self.switching_delay = 5 #Variable to keep track of when to progress the animation (with 6 the delay is 96 ms at 60 fps, with 10 the delay is 160 ms at 60 fps)
        self.updating_delay = 5 #Variable to keep track of when to progress the position of the jump blob
        self.frames = [pg.image.load(f"graphics/assets/interactibles/jump blob/{i}.png").convert_alpha() for i in range(1, 24)]
        self.sprite = self.frames[self.current_frame]

        #Logic
        self.rect = self.sprite.get_rect(bottomleft = bottom_left_coords)
        self.action = "game.player.velocity[1] = -16" #Exec strings have to be written through the perspective of the name space in which they will be executed (in this case level_1.py)
        self.vertical_velocity = -16

    def update(self):
        """Function that updates the jump blob"""

        self.updating_delay -= 1
        if self.updating_delay == 0:
            self.updating_delay = 5
       
            self.rect.bottomleft = self.game.clamp_to_screen(self.rect.bottomleft[0], self.rect.bottomleft[1] + self.vertical_velocity)  #Move the jump blob

            # Reduce vertical velocity
            if self.vertical_velocity > 1:
                self.vertical_velocity -= 1
            elif self.vertical_velocity < 1:
                self.vertical_velocity += 1

            if self.vertical_velocity == 1: self.vertical_velocity = -16
            elif self.vertical_velocity == -1: self.vertical_velocity = 16
            
            # Update the action string
            self.action = f"game.player.velocity[1] = {self.vertical_velocity}"

    def update_animation(self):
        """Function that updates the animation of the jump blob"""

        self.switching_delay -= 1
        if self.switching_delay == 0:
            self.switching_delay = 5

            self.current_frame += 1
            if self.current_frame == 23:
                self.current_frame = 0

            self.sprite = self.frames[self.current_frame]

class Speaker(Interactibles):
    def __init__(self, game, coords):
        super().__init__(game)

        #Logic
        self.sprite = pg.image.load("graphics/assets/interactibles/speaker.png").convert_alpha()
        self.rect = self.sprite.get_rect(midbottom = coords)
        self.action = f"game.player.init_death_sequence(); game.death_sound.set_volume({WORLD_SOUNDS_VOLUME} * 5); game.death_sound.play()"
        self.status = 'on'

    def is_player_below(self):
        return self.game.player.rect.midtop[1] >= self.rect.midtop[1]
    
    def is_on(self):
        return self.status == 'on'
    
    def switch_status(self):
        self.status = 'off' if self.status == 'on' else 'on'

class BouncePad(Interactibles):
    def __init__(self, game, direction, coords):
        super().__init__(game)

        #Logic
        self.sprite = pg.image.load("graphics/assets/interactibles/bounce pad.png").convert_alpha()
        self.rect = self.sprite.get_rect(center = coords)
        match direction:
            case 'up' | 'down':
                self.action = 'game.player.velocity[1] *= -1'
            case 'left' | 'right':
                self.action = 'game.player.velocity[0] *= -1'
            case 'up right':
                self.action = 'game.player.velocity[1] = -5; game.player.velocity[0] = 10'
            case 'up left':
                self.action = 'game.player.velocity[1] = -5; game.player.velocity[0] = -10'
            case 'down right':
                self.action = 'game.player.velocity[1] = 5; game.player.velocity[0] = 10'
            case 'down left':
                self.action = 'game.player.velocity[1] = 5; game.player.velocity[0] = -10'

class GravityController(Interactibles):
    def __init__(self, game, coords, direction):
        super().__init__(game)

        #Graphical representation
        self.frames = [pg.image.load(f"graphics/assets/interactibles/grav controller/version {randint(1,2)}/{direction}/{i}.png").convert_alpha() for i in range(1, 12)]
        self.current_frame = 0
        self.switching_delay = 10 #Variable to keep track of when to progress the animation (with 6 the delay is 96 ms at 60 fps, with 10 the delay is 160 ms at 60 fps)
        self.sprite = self.frames[self.current_frame]
        
        #Logic
        self.rect = self.sprite.get_rect(topleft = coords)
        self.direction = direction
        self.action = "game.player.should_float = not game.player.should_float; game.player.controls_enabled = not game.player.controls_enabled" #Exec strings have to be written through the perspective of the name space in which they will be executed (in this case level_1.py)
        self.last_activation_time = 0

    def update_animation(self):
        """Function that updates the animation of the gravity controller"""

        self.switching_delay -= 1
        if self.switching_delay == 0: #If the delay is over
            self.switching_delay = 10 #Reset the delay
        
            self.current_frame += 1 #Progress the frame index
            if self.current_frame == 11: 
                self.current_frame = 0 #Reset the frame index if it exceeds the length of the animation

            self.sprite = self.frames[self.current_frame] #Update the current sprite

    def can_be_actived(self):
        current_time = pg.time.get_ticks()
        if current_time - self.last_activation_time > 3000 or self.last_activation_time == 0: #If three seconds have passed since the last activation
            self.last_activation_time = current_time
            return True
        return False