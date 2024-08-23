import os
import pygame as pg
from settings import BASE_GRAVITY_PULL, BASE_JUMP_SPEED, FALLING_SPEED_INCR, MAX_DOWN_VELOCITY, MAX_ENTITY_SPEED, PLAYER_ANIMATION_SWITCHING_DELAY, PLAYER_GRAVITY_PULL_DELAY, \
                     PLAYER_LEFT_KEY, PLAYER_RIGHT_KEY, PLAYER_SPEED, PLAYER_SPEED_MID_AIR, QUICK_RESTART_KEY, INITIAL_COORDS_PLAYER, PLAYER_JUMP_KEY, MAX_FPS, HOR_KNOCKBACK_STRENGTH, VERT_KNOCKBACK_STRENGTH, MAX_UP_VELOCITY
from logic.collisionManager import CollisionManager, PlayerCollisionManager
from logic.effects import SmokeEffect

class PhysicsEntity:
    def __init__(self, game, mass, sprite = None, rect = None):
        
        #Graphical representation of the entity
        self.sprite: pg.Surface = sprite
        self.rect: pg.Rect = rect
        
        #Physics variables
        self.mass: int = mass #The mass of the entity
        self.velocity: list[int] = [0, BASE_GRAVITY_PULL * mass] #The velocity of the entity in the x and y axis
        self.screen_rect: pg.Rect = game.screen.get_rect() #The screen rect
        self.collision_manager: CollisionManager = CollisionManager(game)
       
        #Miscellaneous variables
        self.game = game

    def move(self):
        self.apply_gravity()

        #Clamp the player rect to the screen rect to ensure that the player doesn't go off screen
        self.rect.clamp_ip(self.screen_rect)

    def apply_gravity(self):
        desired_x, desired_y = self.rect.midbottom[0], self.rect.midbottom[1] + self.velocity[1]
        result = self.collision_manager.allow_movement(desired_x, desired_y)

        match result:
            case 'allowed': 
                if not self.collides_with_other_entities: self.rect.midbottom = (desired_x, desired_y)
            case 'collision': self.velocity[1] = BASE_GRAVITY_PULL

    @property
    def collides_with_other_entities(self):
        for entity in self.game.entities:
            if entity != self and entity.rect.colliderect(self.rect):
                return True
        return False

class Player(PhysicsEntity):
    def __init__(self, game):
        super().__init__(game, mass=1)

        #Variables to keep track of animations
        self.current_animation_frame: int = 0
        self.animation_switching_delay: int = PLAYER_ANIMATION_SWITCHING_DELAY
        self.landing_sprite: pg.Surface = pg.image.load('graphics/assets/player/landing.png').convert_alpha()
        left_running_frames = self.load_animation_frames('graphics/assets/player/running/left')
        right_running_frames = self.load_animation_frames('graphics/assets/player/running/right')
        self.frame_mapping: dict[list[pg.Surface]] = {
        'left':left_running_frames,
        'left airborne': left_running_frames, 
        'right': right_running_frames,
        'right airborne': right_running_frames,
        'airborne': self.load_animation_frames('graphics/assets/player/airborne'),
        'standing': self.load_animation_frames('graphics/assets/player/standing'),
        'asleep': self.load_animation_frames('graphics/assets/player/asleep'),
        'damaged': self.load_animation_frames('graphics/assets/player/damaged')
        }

        #Variables to keep track of the player's physics
        self.collision_manager: PlayerCollisionManager = PlayerCollisionManager(game) #Create a collision manager for the player
        self.gravity_delay_counter: int = PLAYER_GRAVITY_PULL_DELAY #Counter to delay the gravity pull
        self.status: str = 'standing' #Variable to keep track of the player's status (standing, left, right, airborne)
        self.should_float: bool = False #Variable to keep track of whether the player's should float or not
        self.controls_enabled: bool = False #Variable to keep track of whether the player's controls are enabled or not (initially false because in the level disguised as a start menu the player should be able to move only after spawning at least one physics entity)
        self.sideways_controls_status = [False, False] #Variable to keep track of the status of sideways player controls (if both are true the player should not move as both keys are pressed)

        #Variables to keep track of the player's graphical representation
        self.sprite: pg.Surface = self.frame_mapping.get(self.status)[self.current_animation_frame] #Initial sprite
        self.rect: pg.Rect = self.sprite.get_rect(midbottom = INITIAL_COORDS_PLAYER[game.current_level_num]) #Rect of the player

    def handle_input_event_based(self, event): #EXPERIMENTAL MID AIR MOVEMENT WORKS BADLY AND MOVEMENT IS NOT SMOOTH ESPECIALLY AFTER LANDING
        """Function that manages player related input by altering player's velocity list based on the event passed to the function."""

        if self.controls_enabled and not self.status == 'asleep': #If the player's controls are enabled and the player is not asleep
            CURRENT_SPEED_VALUE: int = PLAYER_SPEED_MID_AIR if self.is_in_air else PLAYER_SPEED #Set the speed value based on the player's vertical velocity
            if event.type == pg.KEYDOWN:

                if event.key == PLAYER_LEFT_KEY:
                    if not self.is_in_air: self.velocity[0] = -CURRENT_SPEED_VALUE
                    elif not self.has_just_landed: self.velocity[0] -= CURRENT_SPEED_VALUE
                    self.sideways_controls_status[0] = True #Update sideways controls status

                elif event.key == PLAYER_RIGHT_KEY:
                    if not self.is_in_air: self.velocity[0] = CURRENT_SPEED_VALUE
                    elif not self.has_just_landed: self.velocity[0] += CURRENT_SPEED_VALUE
                    self.sideways_controls_status[1] = True #Update sideways controls status

                elif event.key == PLAYER_JUMP_KEY and not self.is_in_air and not self.has_just_landed:
                    self.velocity[1] = BASE_JUMP_SPEED #Set the player's vertical velocity to the jump speed

                elif event.key == QUICK_RESTART_KEY:
                    self.reset()

                if self.sideways_controls_status == [False, False] or self.sideways_controls_status == [True, True]:
                    self.velocity[0] = 0 #Reset the player's horizontal velocity if both keys are pressed or none are pressed

                self.clamp_velocity() #Clamp the player's velocity to a maximum value (maybe not necessary but it's good practice)

            elif event.type == pg.KEYUP:
                if event.key == PLAYER_LEFT_KEY:
                    self.sideways_controls_status[0] = False #Update sideways controls status
                    if self.velocity[0] < 0: self.velocity[0] += CURRENT_SPEED_VALUE

                elif event.key == PLAYER_RIGHT_KEY:
                    self.sideways_controls_status[1] = False #Update sideways controls status
                    if self.velocity[0] > 0: self.velocity[0] -= CURRENT_SPEED_VALUE

                if self.sideways_controls_status == [False, False] or self.sideways_controls_status == [True, True]:
                    self.velocity[0] = 0 #Reset the player's horizontal velocity if both keys are pressed or none are pressed

                self.clamp_velocity() #Clamp the player's velocity to a maximum value (maybe not necessary but it's good practice)

    def handle_input(self): #Input handling based on the get pressed method (There is no way to know the order of keys pressed, and rapidly pushed keys can be completely unnoticed between two calls)
        """Function that manages player related input by altering player's velocity list based on the pressed keys at the moment of the call."""

        if self.controls_enabled and not self.status == 'asleep': #If the player's controls are enabled and the player is not asleep
            keys: tuple[bool] = pg.key.get_pressed()
            CURRENT_SPEED_VALUE: int = PLAYER_SPEED_MID_AIR if self.is_in_air else PLAYER_SPEED #Set the speed value based on the player's vertical velocity

            #Manage pressed keys
            if keys[PLAYER_LEFT_KEY] and keys[PLAYER_RIGHT_KEY]: 
                self.velocity[0] = 0 #Reset the player's horizontal velocity

            elif keys[PLAYER_LEFT_KEY]:
                if not self.is_in_air: self.velocity[0] = -CURRENT_SPEED_VALUE
                elif not self.has_just_landed: self.velocity[0] -= CURRENT_SPEED_VALUE

            elif keys[PLAYER_RIGHT_KEY]:
                if not self.is_in_air: self.velocity[0] = CURRENT_SPEED_VALUE
                elif not self.has_just_landed: self.velocity[0] += CURRENT_SPEED_VALUE

            if keys[PLAYER_JUMP_KEY] and not self.is_in_air and not self.has_just_landed: 
                self.velocity[1] = BASE_JUMP_SPEED #Set the player's vertical velocity to the jump speed
                self.spawn_jumping_smoke_effect() #Spawn a smoke effect when the player jumps
                self.game.jump_sound.play() #Play the jump sound

            elif keys[QUICK_RESTART_KEY]:
                self.reset()

            #Manage not pressed keys
            if not keys[PLAYER_LEFT_KEY]: #If the player was moving left remove CURRENT_SPEED_VALUE from the player's velocity
                if self.velocity[0] < 0: self.velocity[0] += CURRENT_SPEED_VALUE

            if not keys[PLAYER_RIGHT_KEY]: #If the player was moving right remove CURRENT_SPEED_VALUE from the player's velocity
                if self.velocity[0] > 0: self.velocity[0] -= CURRENT_SPEED_VALUE
            
            self.clamp_velocity() #Clamp the player's velocity to a maximum value

    def move(self): 
        """Function that manages the player's movement complete of gravity based movement, inertia and collision detection."""

        if self.should_float or self.status == 'asleep': #If the player should float and is not asleep
            return #If the player should float end the function here

        self.check_for_desired_movement()  #Check if desired movement is possible and then update the player's position accordingly
        self.apply_gravity() #Apply movement caused by gravity
        self.update_status() #Update the player's status based on the player's velocity and previous status

    def check_for_desired_movement(self):
        """Function that checks if the player can move to the desired position based on the player's status and velocity and then updates the player's position accordingly."""
        clamp_to_screen = self.game.clamp_to_screen #Reference to the clamp_to_screen function in game to make code more readable

        match self.status:
            case 'damaged':
                #Vertical component of movement
                desired_x, desired_y = clamp_to_screen(self.rect.midtop[0], self.rect.midtop[1] + self.velocity[1])
                result = self.collision_manager.allow_movement(desired_x, desired_y)
                match result:
                    case 'allowed' | 'death' | 'changing level':
                        if not self.collides_with_other_entities(desired_x, desired_y): self.rect.midtop = desired_x, desired_y
                    case 'collision': 
                        initial_desired_y = desired_y
                        for i in range(MAX_DOWN_VELOCITY, -1, -1):
                            desired_y = initial_desired_y + i
                            ver_result = self.collision_manager.allow_movement(desired_x, desired_y)
                            if ver_result == 'allowed' and not self.collides_with_other_entities(desired_x, desired_y):
                                self.rect.midtop = desired_x, desired_y
                                break

                        self.velocity[1] = BASE_GRAVITY_PULL #Reset the player's vertical velocity
                
                #Horizontal component of movement
                if self.velocity[1] < 0: #Moving left
                    desired_x, desired_y = clamp_to_screen(self.rect.midleft[0] - abs(self.velocity[0]), self.rect.midleft[1])
                    hor_result = self.collision_manager.allow_movement(desired_x, desired_y)
                    match hor_result:
                        case 'allowed' | 'death' | 'changing level':
                            if not self.collides_with_other_entities(desired_x, desired_y): self.rect.midleft = desired_x, desired_y
                        case 'collision': 
                            initial_desired_x = desired_x
                            for i in range(MAX_ENTITY_SPEED, -1, -1):
                                desired_x = initial_desired_x - i
                                hor_result = self.collision_manager.allow_movement(desired_x, desired_y)
                                if hor_result == 'allowed' and not self.collides_with_other_entities(desired_x, desired_y):
                                    self.rect.midleft = desired_x, desired_y
                                    break

                            self.velocity[0] = 0 #Stop the player's horizontal movement
                            
                elif self.velocity[1] > 0: #Moving right
                    desired_x, desired_y = clamp_to_screen(self.rect.midright[0] + abs(self.velocity[0]), self.rect.midright[1])
                    hor_result = self.collision_manager.allow_movement(desired_x, desired_y)
                    match hor_result:
                        case 'allowed' | 'death' | 'changing level':
                            if not self.collides_with_other_entities(desired_x, desired_y): self.rect.midright = desired_x, desired_y
                        case 'collision': 
                            initial_desired_x = desired_x
                            for i in range(MAX_ENTITY_SPEED, -1, -1):
                                desired_x = initial_desired_x + i
                                hor_result = self.collision_manager.allow_movement(desired_x, desired_y)
                                if hor_result == 'allowed' and not self.collides_with_other_entities(desired_x, desired_y):
                                    self.rect.midright = desired_x, desired_y
                                    break

                            self.velocity[0] = 0 #Stop the player's horizontal movement

                self.clamp_velocity()  # Clamp the player's velocity
                
            case 'left':
                desired_x, desired_y = clamp_to_screen(self.rect.midleft[0] - abs(self.velocity[0]), self.rect.midleft[1])
                result = self.collision_manager.allow_movement(desired_x, desired_y)
                match result:
                    case 'allowed': 
                        if not self.has_just_landed and not self.collides_with_other_entities(desired_x, desired_y): 
                            self.rect.midleft = desired_x, desired_y
                    case 'death':
                        self.init_death_sequence()
                    case 'changing level': self.advance_level()
                    case 'collision': self.velocity[0] = 0 #Stop the player's horizontal movement
                
            case 'right':
                desired_x, desired_y = clamp_to_screen(self.rect.midright[0] + abs(self.velocity[0]), self.rect.midright[1])
                result = self.collision_manager.allow_movement(desired_x, desired_y)
                match result:
                    case 'allowed': 
                        if not self.has_just_landed and not self.collides_with_other_entities(desired_x, desired_y): 
                            self.rect.midright = desired_x, desired_y
                    case 'death':
                        self.init_death_sequence()
                    case 'changing level': self.advance_level()
                    case 'collision': self.velocity[0] = 0 #Stop the player's horizontal movement
            
            case 'left airborne':
                if self.is_moving_up:
                    #Check if horizontal component of the movement is possible
                    desired_x, desired_y = clamp_to_screen(self.rect.topleft[0] - abs(self.velocity[0]), self.rect.topleft[1] - abs(self.velocity[1])) #Has to be absolute value because in the settings values for moving updwards are negative so by subtracting a negative value the player would move downwards
                    hor_result = self.collision_manager.allow_movement(desired_x, self.rect.topleft[1])
                    match hor_result:
                        case 'allowed': 
                            if not self.collides_with_other_entities(desired_x, self.rect.topleft[1]): 
                                self.rect.topleft = desired_x, self.rect.topleft[1]
                        case 'death':
                            self.init_death_sequence()
                        case 'changing level': self.advance_level()
                        case 'collision': self.velocity[0] = 0

                    #Check if vertical component of the movement is possible
                    ver_result = self.collision_manager.allow_movement(self.rect.topleft[0], desired_y)
                    match ver_result:
                        case 'allowed': 
                            if self.collides_with_other_entities(self.rect.topleft[0], desired_y): self.velocity[1] = BASE_GRAVITY_PULL
                            else: self.rect.topleft = self.rect.topleft[0], desired_y
                        case 'death': 
                            self.init_death_sequence()
                        case 'changing level': self.advance_level()
                        case 'collision':
                            initial_desired_y = desired_y
                            for i in range(MAX_DOWN_VELOCITY, -1, -1):
                                desired_y = initial_desired_y - i
                                ver_result = self.collision_manager.allow_movement(desired_x, desired_y)
                                if ver_result == 'allowed' and not self.collides_with_other_entities(desired_x, desired_y):
                                    self.rect.topleft = desired_x, desired_y
                                    break

                            self.velocity[1] = BASE_GRAVITY_PULL #Reset the player's vertical velocity

            case 'right airborne':
                if self.is_moving_up:
                    desired_x, desired_y = clamp_to_screen(self.rect.topright[0] + abs(self.velocity[0]), self.rect.topright[1] - abs(self.velocity[1])) #Has to be absolute value because in the settings values for moving updwards are negative so by subtracting a negative value the player would move downwards")
                    #Check if horizontal component of the movement is possible
                    hor_result = self.collision_manager.allow_movement(desired_x, self.rect.topright[1])
                    match hor_result:
                        case 'allowed': 
                            if self.collides_with_other_entities(desired_x, self.rect.topright[1]): self.velocity[1] = BASE_GRAVITY_PULL
                            else: self.rect.topright = desired_x, self.rect.topright[1]
                        case 'death': 
                            self.init_death_sequence()
                        case 'changing level': self.advance_level()
                        case 'collision': self.velocity[0] = 0

                    #Check if vertical component of the movement is possible
                    ver_result = self.collision_manager.allow_movement(self.rect.topright[0], desired_y)
                    match ver_result:
                        case 'allowed':
                            if self.collides_with_other_entities(self.rect.topright[0], desired_y): self.velocity[1] = BASE_GRAVITY_PULL
                            else: self.rect.topright = self.rect.topright[0], desired_y
                        case 'death':
                            self.init_death_sequence()
                        case 'changing level': self.advance_level()
                        case 'collision':
                            initial_desired_y = desired_y
                            for i in range(MAX_DOWN_VELOCITY, -1, -1):
                                desired_y = initial_desired_y - i
                                ver_result = self.collision_manager.allow_movement(desired_x, desired_y)
                                if ver_result == 'allowed' and not self.collides_with_other_entities(desired_x, desired_y): 
                                    self.rect.topright = desired_x, desired_y
                                    break

                            self.velocity[1] = BASE_GRAVITY_PULL #Reset the player's vertical velocity

            case 'airborne':
                if self.is_moving_up:
                    desired_x, desired_y = clamp_to_screen(self.rect.midtop[0], self.rect.midtop[1] - abs(self.velocity[1])) #Has to be absolute value because in the settings values for moving updwards are negative so by subtracting a negative value the player would move downwards
                    result = self.collision_manager.allow_movement(desired_x, desired_y)
                    match result:
                        case 'allowed': 
                            if self.collides_with_other_entities(desired_x, desired_y): self.velocity[1] = BASE_GRAVITY_PULL
                            else: self.rect.midtop = desired_x, desired_y
                        case 'death': 
                            self.init_death_sequence()
                        case 'changing level': self.advance_level()
                        case 'collision':
                            initial_desired_y = desired_y
                            for i in range(MAX_DOWN_VELOCITY, -1, -1): #Iterate over the player's vertical velocity to find the first position where the player can move to
                                desired_y = initial_desired_y - i #without this loop the player would stop n pixels before the ceiling with n being the player's vertical velocity
                                result = self.collision_manager.allow_movement(desired_x, desired_y)
                                if result == 'allowed' and not self.collides_with_other_entities(desired_x, desired_y): #If the player can move to the desired position
                                    self.rect.midtop = (desired_x, desired_y)
                                    break

                            self.velocity[1] = BASE_GRAVITY_PULL #Reset the player's vertical velocity

                    if self.velocity[1] == 0: #If the player has reached the apex of the jump
                        self.velocity[1] = BASE_GRAVITY_PULL #Reset the vertical velocity

    def apply_gravity(self):

        """Function that manages gravity based movement complete of sideways movement and collision detection."""
        
        clamp_to_screen = self.game.clamp_to_screen #Reference to the clamp_to_screen function in game to make code more readable

        self.gravity_delay_counter -= 1 #Decrease the delay
        if self.gravity_delay_counter == 0: #If the delay has passed
            self.gravity_delay_counter = PLAYER_GRAVITY_PULL_DELAY #Reset the delay

            self.velocity[1] = min(self.velocity[1] + FALLING_SPEED_INCR, MAX_DOWN_VELOCITY) #Apply the gravity pull to the player's vertical velocity

            #Horizontal mid air movement
            match self.status:
                case 'left airborne': #The checks need to be separated to avoid the situation where a side collision could stop the player's vertical movement
                    desired_x, desired_y = clamp_to_screen(self.rect.midleft[0] - abs(self.velocity[0]), self.rect.midleft[1])
                    hor_result = self.collision_manager.allow_movement(desired_x, self.rect.midleft[1])
                    match hor_result:
                        case 'allowed': 
                            if not self.collides_with_other_entities(desired_x, desired_y): self.rect.midleft = (desired_x, desired_y)
                        case 'death': 
                            self.init_death_sequence()
                        case 'changing level': self.advance_level()
                        case 'collision': self.velocity[0] = 0 #Stop the player's horizontal movement

                case 'right airborne':
                    desired_x, desired_y = clamp_to_screen(self.rect.midright[0] + abs(self.velocity[0]), self.rect.midright[1])
                    hor_result = self.collision_manager.allow_movement(desired_x, desired_y)
                    match hor_result:
                        case 'allowed':
                            if not self.collides_with_other_entities(desired_x, desired_y): self.rect.midright = (desired_x, desired_y)
                        case 'death': 
                            self.init_death_sequence()
                        case 'changing level': self.advance_level()
                        case 'collision': self.velocity[0] = 0 #Stop the player's horizontal movement

            #Vertical movement
            desired_x, desired_y = clamp_to_screen(self.rect.midbottom[0], self.rect.midbottom[1] + (self.velocity[1] * FALLING_SPEED_INCR))
            vert_result = self.collision_manager.allow_movement(desired_x, desired_y)
            match vert_result:
                case 'allowed':
                    if not self.collides_with_other_entities(desired_x, desired_y): self.rect.midbottom = (desired_x, desired_y)
                    elif self.is_in_air: #If the player is in air and does not collide with other entities
                        self.velocity[1] = BASE_GRAVITY_PULL #Reset the player's vertical velocity
                        self.status = 'standing' #Set the player's status to standing
                        self.sprite = self.landing_sprite #Set the sprite to the landing frame
                        self.current_animation_frame = 0 #Reset the animation frame
                        self.animation_switching_delay = int(PLAYER_ANIMATION_SWITCHING_DELAY * (0.8 + (self.velocity[1] / 10))) #Dinamically set the delay to make so the landing seems heavy                 
                    else: self.velocity[1] = BASE_GRAVITY_PULL #If if does not collide with other entities and is not in air reset the player's vertical velocity

                case 'death': 
                    self.init_death_sequence()
                case 'changing level': self.advance_level()
                case 'collision':
                        self.velocity[1] = BASE_GRAVITY_PULL #Reset the player's vertical velocity
                        if self.is_in_air:
                            # Constants DO NOT WHY BUT IT WORKS EVEN WITH THIS LINES COMMENTED (WILL LOOK INTO IT LATER)
                            # initial_desired_y = desired_y
                            # for i in range(MAX_DOWN_VELOCITY, -1, -1): #Iterate over the player's possible y positions to find the first position where the player can land (not doing this would make the player land N pixels above the ground with N being the player's vertical velocity) 
                            #     desired_y = initial_desired_y - i
                            #     result = self.collision_manager.allow_movement(desired_x, desired_y)
                            #     if result == 'allowed' and not self.collides_with_other_entities(desired_x, desired_y): # If the player can move to the desired position
                            #         self.rect.midbottom = (desired_x, desired_y + 1)  # Update the player's position to the desired position (+ 1 to account for the loop decreasing the y position by 1)
                            #         break
                            
                            self.status = 'standing' #Set the player's status to standing
                            self.spawn_landing_smoke_effect() #Spawn a landing effect
                            self.sprite = self.landing_sprite #Set the sprite to the landing frame
                            self.velocity = [0, BASE_GRAVITY_PULL] #Reset the player's velocity
                            self.current_animation_frame = 0 #Reset the animation frame
                            self.animation_switching_delay = MAX_FPS // 5

    def update_status(self):
        """Function that takes care of updating the player's status based on its velocity and previous status."""

        if self.status == 'damaged' or self.status == 'asleep': return #If the player is damaged end the function here

        elif self.velocity[0] < 0: #If the player is moving left
            if self.velocity[1] != BASE_GRAVITY_PULL: self.status = 'left airborne' 
            elif not self.is_in_air: self.status = 'left' #Extra check to prevent the player from slightly moving sideways at the apex of a jump, thus changing the status to left and being then able to jump again
        
        elif self.velocity[0] > 0: #If the player is moving right
            if self.velocity[1] != BASE_GRAVITY_PULL: self.status = 'right airborne'
            elif not self.is_in_air: self.status = 'right' #Extra check to prevent the player from slightly moving sideways at the apex of a jump, thus changing the status to right and being then able to jump again
        
        elif self.velocity[1] != BASE_GRAVITY_PULL and not self.is_in_air: self.status = 'airborne' #If the player is moving upwards set the status to airborne (could have used self.is_moving_up but this is more uniform with the other checks)
        
        elif self.velocity[0] == 0 and self.velocity[1] == BASE_GRAVITY_PULL and not self.is_in_air: self.status = 'standing'

    def update_animation(self):
        """"Function that takes care of updating the player's sprite to follow an animation loop based on the player's status."""

        # Animation frame switching
        self.animation_switching_delay -= 1
        if self.animation_switching_delay == 0: # If the delay has passed
            self.animation_switching_delay = PLAYER_ANIMATION_SWITCHING_DELAY  # Reset the delay

            # Update the current animation frame
            if (self.current_animation_frame < len(self.frame_mapping[self.status]) - 1):
                self.current_animation_frame += 1
            else:
                self.current_animation_frame = 0
            
            self.sprite = self.frame_mapping[self.status][self.current_animation_frame] # Update the sprite based on the current animation frame

    def load_animation_frames(self, path):
        """#Function that returns an array containing all the frames of an animation loaded as pygame surfaces"""

        frames_surfs = []
        frames = sorted(os.listdir(path))
        for frame_path in frames:
            final_path = os.path.join(path, frame_path)
            frames_surfs.append(pg.image.load(final_path).convert_alpha())
        
        return frames_surfs

    @property
    def has_just_landed(self): 
        """Function that returns whether the player has just landed or not based on the player's sprite, used to determine whether the player can move or not after landing, by not allowing the player to move for a few frames after landing to simulate a heavy landing."""
        return self.sprite == self.landing_sprite 

    @property
    def is_moving_up(self):
        """Function that returns whether the player is moving upwards or not based on the player's vertical velocity."""
        return self.velocity[1] < BASE_GRAVITY_PULL

    @property
    def is_in_air(self):
        """Function that returns whether the player is in the air or not based on the player's status."""
        return self.status in ['airborne', 'left airborne', 'right airborne']

    def clamp_velocity(self):
        """Function that clamps the player's velocity to a maximum value."""
        #Could have used pygame built in clamp function but it this still in experimental phase
        #Formula: max(min_value, min(value, max_value))

        self.velocity[0] = max(-MAX_ENTITY_SPEED, min(self.velocity[0], MAX_ENTITY_SPEED))
        self.velocity[1] = max(MAX_UP_VELOCITY, min(self.velocity[1], MAX_DOWN_VELOCITY))
    
    def spawn_landing_smoke_effect(self):
        """Function that spawns a landing effect when the player lands."""

        spawn_coords = self.rect.midbottom[0], self.rect.midbottom[1] + 5  # Spawn the effect slightly below the player's feet
        x_interval = 10  # Define the interval within which no other effect should spawn

        for effect in self.game.effects:
            # If there is already a landing effect spawned by the player within the x interval, end the function here
            if effect.maker == self and (effect.coords[0] - x_interval <= spawn_coords[0] <= effect.coords[0] + x_interval):
                return

        self.game.effects.append(SmokeEffect(type='landing', coords=spawn_coords, game=self.game, maker=self))

    def spawn_jumping_smoke_effect(self):
        """Function that spawns a landing effect when the player jumps."""

        spawn_coords = self.rect.midbottom  # Spawn the effect at the player's feet
        x_interval = 10  # Define the interval within which no other effect should spawn

        for effect in self.game.effects:
            # If there is already a jumping effect spawned by the player within the x interval, end the function here
            if effect.maker == self and effect.type == 'jumping' and (effect.coords[0] - x_interval <= spawn_coords[0] <= effect.coords[0] + x_interval):
                return

        self.game.effects.append(SmokeEffect(type='jumping', coords=spawn_coords, game=self.game, maker=self))

    def spawn_bouncing_smoke_effect(self):
        """Function that spawns a bouncing effect when the player bounces."""

        spawn_coords = self.rect.midbottom
        x_interval = 10

        for effect in self.game.effects:
            if effect.maker == self and effect.type == 'bouncing' and (effect.coords[0] - x_interval <= spawn_coords[0] <= effect.coords[0] + x_interval):
                return
            
        self.game.effects.append(SmokeEffect(type='bouncing', coords=spawn_coords, game=self.game, maker=self))


    def spawn_death_smoke_effect(self):
        """Function that spawns a death effect when the player dies."""

        spawn_coords = self.rect.midbottom  # Spawn the effect at the player's feet
        x_interval = 10  # Define the interval within which no other effect should spawn

        for effect in self.game.effects:
            # If there is already a death effect spawned by the player within the x interval, end the function here
            if effect.maker == self and effect.type == 'dying' and (effect.coords[0] - x_interval <= spawn_coords[0] <= effect.coords[0] + x_interval):
                return
            
        self.game.effects.append(SmokeEffect(type='dying', coords=spawn_coords, game=self.game, maker=self))

    def advance_level(self):
        """Function that advances the player to the next level by increasing the current level number and resetting the player's position."""
        self.game.advance_level()
        self.reset()

    def init_death_sequence(self):
        """Function that initializes the player's death sequence."""

        if self.status != 'damaged':
        
            self.game.death_sound.play() #Play the death sound
            self.controls_enabled = False #Disable the player's controls
            self.current_animation_frame = -1 #Reset the animation frame counter
            self.spawn_death_smoke_effect() #Spawn a death effect
            
            #Set the player's velocity to simulate knockback
            if self.status in ['right', 'right airborne']: self.velocity = [-HOR_KNOCKBACK_STRENGTH, -VERT_KNOCKBACK_STRENGTH]
            elif self.status in ['left', 'left airborne']: self.velocity = [HOR_KNOCKBACK_STRENGTH, -VERT_KNOCKBACK_STRENGTH]
            elif self.status in ['standing', 'airborne'] and self.velocity[1] >= 0: self.velocity = [-HOR_KNOCKBACK_STRENGTH, -VERT_KNOCKBACK_STRENGTH]
            elif self.status in ['standing', 'airborne'] and self.velocity[1] < 0: self.velocity = [HOR_KNOCKBACK_STRENGTH, VERT_KNOCKBACK_STRENGTH]

            self.status = 'damaged' #Update the player's status to damaged

    def reset(self):
        """Function that resets the player's value to default.""" 
        self.current_animation_frame = -1 #Reset the animation frame counter
        self.status = 'standing' #Reset the player's status
        self.rect.midbottom = INITIAL_COORDS_PLAYER[self.game.current_level_num] #Reset the player's position to the initial values
        self.velocity = [0, BASE_GRAVITY_PULL] #Reset the player's velocity
        self.controls_enabled = True #Enable the player's controls
        self.should_float = False #Disable the player's floating

    def collides_with_other_entities(self, x, y):
        """Function that checks if the player collides with any other entity in the game."""
        point = x, y
        for entity in self.game.entities:
            if entity != self and entity.rect.collidepoint(point):
                return True

        return False

    def wake_up(self):
        self.status = 'standing' #Set the player status to standing
        self.controls_enabled = True #Enable player controls

class DeathEntity(PhysicsEntity):
    def __init__(self, game, mass, sprite = None, rect = None):
        super().__init__(game, mass, sprite, rect)

        self.should_die = False #Whether the entity should die or not
        self.death_timer_amount = 1500 #After how many milliseconds the entity should die when in contact with a death portion of the collision map

    def move(self):
        self.apply_gravity()

        #Clamp the player rect to the screen rect to ensure that the player doesn't go off screen
        self.rect.clamp_ip(self.screen_rect)

        if self.should_die and self.is_death_timer_finished():
            self.game.entities.remove(self)
            del self
        
    def apply_gravity(self):
        desired_x, desired_y = self.rect.midbottom[0], self.rect.midbottom[1] + self.velocity[1]
        result = self.collision_manager.allow_movement(desired_x, desired_y)

        match result:
            case 'allowed': 
                if not self.collides_with_other_entities: self.rect.midbottom = (desired_x, desired_y)
            case 'collision': self.velocity[1] = BASE_GRAVITY_PULL
            case 'death': 
                if not self.should_die: self.init_death() #If the entity has not started the death sequence yet, start it

    def init_death(self):
        self.should_die = True
        self.death_contact_time = pg.time.get_ticks()

    def is_death_timer_finished(self):
        current_time = pg.time.get_ticks()
        if current_time - self.death_contact_time >= self.death_timer_amount:
            return True
        return False