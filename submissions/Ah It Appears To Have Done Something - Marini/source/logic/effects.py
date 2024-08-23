from settings import pg, EFFECTS_ANIMATION_SWITCHING_DELAY

class SmokeEffect:
    def __init__(self, type, coords, game, maker):

        self.animation_switching_delay = EFFECTS_ANIMATION_SWITCHING_DELAY #The delay between switching frames
        self.game = game #The game object
        self.current_frame = 0 #The current frame of the animation
        self.maker = maker #The object that created the effect (used to limit how many effects can be created by the same object)
        self.coords = coords #The coordinates of the effect
        self.type = type #The type of the effect
        self.frames = [] #The frames of the effect

        match type:
            case 'landing':
                [self.frames.append(pg.image.load(f"graphics/assets/effects/landing/{i}.png").convert_alpha()) for i in range(1, 10)]
                self.num_frames = 8 #Number of frames in the animation (written here to avoid having to call len(self.frames) every frame)
                self.sprite = self.frames[self.current_frame] #The current sprite of the effect
                self.rect = self.sprite.get_rect(center = coords) #The rect of the effect
            case 'jumping':
                [self.frames.append(pg.image.load(f"graphics/assets/effects/jumping/{i}.png").convert_alpha()) for i in range(1, 10)]
                self.num_frames = 8
                self.sprite = self.frames[self.current_frame] #The current sprite of the effect
                self.rect = self.sprite.get_rect(center = coords) #The rect of the effect
            case 'dying':
                [self.frames.append(pg.image.load(f"graphics/assets/effects/dying/{i}.png").convert_alpha()) for i in range(1, 17)]
                self.num_frames = 15
                self.sprite = self.frames[self.current_frame] #The current sprite of the effect
                self.rect = self.sprite.get_rect(midbottom = coords) #The rect of the effect
            case 'bouncing':
                [self.frames.append(pg.image.load(f"graphics/assets/effects/bouncing/{i}.png").convert_alpha()) for i in range(1, 17)]
                self.num_frames = 15
                self.sprite = self.frames[self.current_frame] #The current sprite of the effect
                self.rect = self.sprite.get_rect(center = coords) #The rect of the effect
        
    def update_animation(self):
        """Function that updates the animation of the smoke effect"""

        self.animation_switching_delay -= 1
        if self.animation_switching_delay == 0: #If the delay is over
            self.animation_switching_delay = EFFECTS_ANIMATION_SWITCHING_DELAY #Reset the delay

            self.current_frame += 1 #Progress the frame index
            if self.current_frame == self.num_frames: self.destroy()

            try:
                self.sprite = self.frames[self.current_frame] #Update the current sprite
            except IndexError:
                print(f"IndexError: {self.current_frame}")

    def destroy(self):
        """Function that destroys the smoke effect"""

        self.game.effects.remove(self)
        #No del self because that would only delete that reference to the effect inside this method
