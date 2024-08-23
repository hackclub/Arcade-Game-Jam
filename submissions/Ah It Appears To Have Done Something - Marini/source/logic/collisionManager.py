import os
from PIL import Image
import numpy as np

maps = []
collision_maps_folder_path = 'graphics/collision_maps'
num_collision_maps = len(os.listdir(collision_maps_folder_path))

for i in range(num_collision_maps):
    # Load the image
    image = Image.open(f'{collision_maps_folder_path}/level_{i}.png').convert("RGBA")
    
    # Convert the image to a numpy array
    image_array = np.array(image)
    #Convert the image to a matrix
    image_array = image_array.tolist()
    #Append the matrix to the maps list
    maps.append(image_array)

class CollisionManager:
    def __init__(self, game):
        self.game = game

    def allow_movement(self, x, y):
        """" Function that given coordinates of a point on a 2D plane looks at the value of a matrix representing a collision maps and returns whether the player can move to that point or not, based on the color of the pixel at that point. """

        try: #TODO: Fix this (remove try except)
            pixel_color: list[int] = maps[self.level_num][y][x]
        except IndexError:
            return 'collision'
        
        if pixel_color[-1] == 0: #Transparent pixel
            return 'allowed'
        elif pixel_color == [0, 0, 0, 255]: #Fully opaque black
            return 'collision'
        elif pixel_color == [255, 0, 0, 255]: #Fully opaque red
            return 'death'

    @property
    def level_num(self):
        return self.game.current_level_num

class PlayerCollisionManager(CollisionManager):
    def __init__(self, game):
        super().__init__(game)

    def allow_movement(self, x, y):
        """" Function that given coordinates of a point on a 2D plane looks at the value of a matrix representing a collision maps and returns whether the player can move to that point or not, based on the color of the pixel at that point. """

        try: #TODO: Fix this (remove try except)
            pixel_color: list[int] = maps[self.level_num][y][x]
        except IndexError:
            return 'collision'

        if pixel_color[-1] == 0: #Transparent pixel
            return 'allowed'
        elif pixel_color == [0, 0, 0, 255]: #Fully opaque black
            return 'collision'
        elif pixel_color == [0, 0, 255, 255]: #Fully opaque blue
            return 'changing level'
        elif pixel_color == [255, 0, 0, 255]: #Fully opaque red
            return 'death'