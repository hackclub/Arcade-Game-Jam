from kivy.uix.widget import Widget
from kivy.core.image import Image as CoreImage
from kivy.core.window import Window

class Player():
    def __init__(self):
        self.pos = {"x":0,"y":0}
        self.Width = 32
        self.Height = 32
        self.player_idle_Forward = "Graphics\\Sprites\\IdleF.png"
        self.player_idle_Backward = "Graphics\\Sprites\\IdleB.png"
        self.player_fjump = "Graphics\\Sprites\\FJump.png"
        self.player_bjump = "Graphics\\Sprites\\BJump.png"
        self.FCooldown = "Graphics\\Sprites\\Cooldown.png"
        self.BCooldown = "Graphics\\Sprites\\BCooldown.png"
        self.FWalking = ["FRun1","FRun3"]
        self.FRunning = ["FRun1","FRun2","FRun3","FRun4"]
        self.BWalking = ["BRun1","BRun3"]
        self.BRunning = ["BRun1","BRun2","BRun3","BRun4"]
        self.FShooting = ["FShoot1","FShoot2","FShoot3"]
        self.BShooting = ["BShoot1","BShoot2","BShoot3"]
        self.TShooting = ["TShoot1","TShoot2","TShoot3"]
        self.DShooting = ["DShoot1","DShoot2","DShoot3"]
        self.FDShooting = ["FDShoot1","FDShoot2","FDShoot3"]
        self.FTShooting = ["FTShoot1","FTShoot2","FTShoot3"]
        self.BDShooting = ["BDShoot1","BDShoot2","BDShoot3"]
        self.BTShooting = ["BTShoot1","BTShoot2","BTShoot3"]
        self.Direction_x = 0
        self.Direction_y = 0
        self.FWalkIndex = 0
        self.BWalkIndex = 0
        self.FRunningIndex = 0
        self.BRunningIndex = 0
        self.FShootingIndex = 0
        self.BShootingIndex = 0
        self.TShootingIndex = 0
        self.DShootingIndex = 0
        self.FDShootingIndex = 0
        self.FTShootingIndex = 0
        self.BDShootingIndex = 0
        self.BTShootingIndex = 0
        self.Walkspeed = 1
        self.SprintSpeed = self.Walkspeed * 2
        self.Forward = True
        self.inair = False
        self.onground = True
        self.Sprint = True
        self.image = self.player_idle_Forward
        self.Display_image = CoreImage(self.image).texture
        self.DrawnRect = ''
        self.CollideWiget = Widget(pos=(self.pos["x"],self.pos["y"]),size=(self.Width,self.Height))
        self.Borders = []
        self.Ammo = 20
        self.FullAmmo = self.Ammo
        self.Gun = "Shotgun"
        self.GunFacter = {"SMG":4,"Shotgun":12}
        self.GunCooldown = {"SMG":10,"Shotgun":30}
        self.BaseFactor = 10
        self.mousepos = ()
        self.Recoil = [0,0]
        self.Death = False
        self.Cooldown = 0
        self.Movement_Keys = set()
        self.Moved = False
    
    def Input(self,keycode):
        if keycode[1] == "left":
            self.Direction_x = -self.Walkspeed
            self.Forward = False
            self.Movement_Keys.add(keycode[1])
        elif keycode[1] == "right":
            self.Direction_x = self.Walkspeed
            self.Forward = True
            self.Movement_Keys.add(keycode[1])
        elif keycode[1] == "spacebar":
            self.Death = True
        elif keycode[1] == 'shift':
            if self.Sprint:
                self.Direction_x = -self.SprintSpeed
                self.Movement_Keys.add(keycode[1])
            self.Forward = False
            self.Movement_Keys.add(keycode[1])
        elif keycode[1] == 'rshift':
            if self.Sprint:
                self.Direction_x = self.SprintSpeed
                self.Movement_Keys.add(keycode[1])
            self.Forward = True
        elif keycode[1] == "enter":
            if self.Ammo and self.Cooldown == 0 :
                self.Movement_Keys.add(keycode[1]) 
                self.Shoot()
                self.Ammo -= 1
                self.Cooldown = self.GunCooldown[self.Gun]
    
    def Movement_Reset(self):
        self.Direction_x = 0
        self.Direction_y = 0
        if self.Cooldown > 0:
            if self.Forward:self.image = self.FCooldown
            else:self.image = self.BCooldown
        elif self.Forward:self.image = self.player_idle_Forward
        else:self.image = self.player_idle_Backward

    def Collision(self):
        #Vertical
        for border in self.Borders:
            if self.CollideWiget.collide_widget(border):
                if self.Direction_y < 0: #Falling
                    if self.pos["y"] < border.top <= self.CollideWiget.top:
                        self.pos["y"] = border.top
                        self.Direction_y = 0
                        self.onground = True
                elif self.Direction_y > 0:
                    if self.CollideWiget.top > border.y > self.pos["y"] and border.x < self.CollideWiget.center_x < border.right:
                        self.pos["y"] = border.y - self.Height
                        self.Direction_y = 0
        #Horizontal
        for border in self.Borders:
            if self.CollideWiget.collide_widget(border):
                if self.Direction_x < 0:
                    if self.CollideWiget.x < border.right <= self.CollideWiget.right and border.y < self.CollideWiget.center_y < border.top:
                        self.pos["x"] = border.right
                        self.Direction_x = 0
                elif self.Direction_x > 0:
                    if border.y < self.CollideWiget.center_y < border.top and self.CollideWiget.right > border.x >= self.CollideWiget.x:
                        self.pos["x"] = border.x - self.Width
                        self.Direction_x = 0

    def Shoot(self):
        self.onground = False
        if self.mousepos[0] < self.pos["x"]:
            self.Recoil[0] = (self.BaseFactor * self.GunFacter[self.Gun])
        if self.mousepos[0] > self.pos["x"]:
            self.Recoil[0] = -(self.BaseFactor * self.GunFacter[self.Gun])
        if self.mousepos[1] > self.pos["y"]:
            self.Recoil[1] = -(self.BaseFactor * self.GunFacter[self.Gun])
        if self.mousepos[1] < self.pos["y"]:
            self.Recoil[1] = (self.BaseFactor * self.GunFacter[self.Gun])
        self.pos["x"] += self.Recoil[0]
        self.pos["y"] += self.Recoil[1]
        self.Direction_y = 0
        self.CollideWiget = Widget(pos=(self.pos["x"],self.pos["y"]),size=(self.Width,self.Height))
        for border in self.Borders:
            if self.CollideWiget.collide_widget(border):
                if self.Recoil[1] < 0: #Falling
                    if self.pos["y"] < border.top <= self.CollideWiget.top:
                        self.pos["y"] = border.top +1
                elif self.Recoil[1] > 0:
                    if self.CollideWiget.top > border.y > self.pos["y"] and border.x < self.CollideWiget.center_x < border.right:
                        self.pos["y"] = border.y - self.Height -1
        for border in self.Borders:
            if self.CollideWiget.collide_widget(border):
                if self.Recoil[0] < 0:
                    if self.CollideWiget.x < border.right <= self.CollideWiget.right and border.y < self.CollideWiget.center_y < border.top:
                        self.pos["x"] = border.right + 1
                elif self.Recoil[0] > 0:
                    if border.y < self.CollideWiget.center_y < border.top and self.CollideWiget.right > border.x >= self.CollideWiget.x:
                        self.pos["x"] = border.x - self.Width - 1

    def Animations(self):
        if not self.inair and self.Recoil.count(0) == 2:
            if self.Direction_x == self.Walkspeed:
                self.FWalkIndex += 0.1
                if self.FWalkIndex >= len(self.FWalking): self.FWalkIndex = 0
                self.image = f"Graphics\\Sprites\\{self.FWalking[int(self.FWalkIndex)]}.png"
                self.BWalkIndex = 0
                self.FRunningIndex = 0
                self.BRunningIndex = 0
            elif self.Direction_x == -self.Walkspeed:
                self.BWalkIndex += 0.1
                if self.BWalkIndex >= len(self.BWalking): self.BWalkIndex = 0
                self.image = f"Graphics\\Sprites\\{self.BWalking[int(self.BWalkIndex)]}.png"
                self.FWalkIndex = 0
                self.FRunningIndex = 0
                self.BRunningIndex = 0
            elif self.Direction_x == self.SprintSpeed:
                self.FRunningIndex += 0.1
                if self.FRunningIndex >= len(self.FRunning): self.FRunningIndex = 0
                self.image = f"Graphics\\Sprites\\{self.FRunning[int(self.FRunningIndex)]}.png"
                self.BWalkIndex = 0
                self.FWalkIndex = 0
                self.BRunningIndex = 0
            elif self.Direction_x == -self.SprintSpeed:
                self.BRunningIndex += 0.1
                if self.BRunningIndex >= len(self.BRunning): self.BRunningIndex = 0
                self.image = f"Graphics\\Sprites\\{self.BRunning[int(self.BRunningIndex)]}.png"
                self.FWalkIndex = 0
                self.FRunningIndex = 0
                self.BWalkIndex = 0
        elif self.inair and self.Recoil.count(0) == 2:
            if self.Direction_x >= self.Walkspeed:
                self.image = self.player_fjump
                self.BWalkIndex = 0
                self.FRunningIndex = 0
                self.BRunningIndex = 0
            elif self.Direction_x <= -self.Walkspeed:
                self.image = self.player_bjump
                self.BWalkIndex = 0
                self.FRunningIndex = 0
                self.BRunningIndex = 0
        elif self.Recoil.count(0) != 2:
            if self.Recoil[0] < 0 and self.Recoil[1] == 0:
                self.FShootingIndex += 0.4
                if self.FShootingIndex >= len(self.FShooting): 
                    self.Recoil = [0,0]
                    self.image = self.FCooldown
                    self.FShootingIndex = 0
                    self.Forward = True
                else:self.image = f"Graphics\\Sprites\\{self.FShooting[int(self.FShootingIndex)]}.png"
                self.BWalkIndex = 0
                self.FRunningIndex = 0
                self.BRunningIndex = 0
                self.FWalkIndex = 0
            elif self.Recoil[0] > 0 and self.Recoil[1] == 0:
                self.BShootingIndex += 0.4
                if self.BShootingIndex >= len(self.BShooting): 
                    self.Recoil = [0,0]
                    self.image = self.BCooldown
                    self.BShootingIndex = 0
                    self.Forward = False
                else:self.image = f"Graphics\\Sprites\\{self.BShooting[int(self.BShootingIndex)]}.png"
                self.BWalkIndex = 0
                self.FRunningIndex = 0
                self.BRunningIndex = 0
                self.FWalkIndex = 0
            elif self.Recoil[1] < 0 and self.Recoil[0] == 0:
                self.TShootingIndex += 0.4
                if self.TShootingIndex >= len(self.TShooting): 
                    self.Recoil = [0,0]
                    self.TShootingIndex = 0
                else:self.image = f"Graphics\\Sprites\\{self.TShooting[int(self.TShootingIndex)]}.png"
                self.BWalkIndex = 0
                self.FRunningIndex = 0
                self.BRunningIndex = 0
                self.FWalkIndex = 0
            elif self.Recoil[1] > 0 and self.Recoil[0] == 0:
                self.DShootingIndex += 0.4
                if self.DShootingIndex >= len(self.DShooting): 
                    self.Recoil = [0,0]
                    self.DShootingIndex = 0
                else:self.image = f"Graphics\\Sprites\\{self.DShooting[int(self.DShootingIndex)]}.png"
                self.BWalkIndex = 0
                self.FRunningIndex = 0
                self.BRunningIndex = 0
                self.FWalkIndex = 0
            elif self.Recoil[0] < 0 and self.Recoil[1] > 0:
                self.FDShootingIndex += 0.4
                if self.FDShootingIndex >= len(self.FDShooting): 
                    self.Recoil = [0,0]
                    self.image = self.FCooldown
                    self.FDShootingIndex = 0
                    self.Forward = True
                else:self.image = f"Graphics\\Sprites\\{self.FDShooting[int(self.FDShootingIndex)]}.png"
                self.BWalkIndex = 0
                self.FRunningIndex = 0
                self.BRunningIndex = 0
                self.FWalkIndex = 0
            elif self.Recoil[0] < 0 and self.Recoil[1] < 0:
                self.FTShootingIndex += 0.4
                if self.FTShootingIndex >= len(self.FTShooting): 
                    self.Recoil = [0,0]
                    self.image = self.FCooldown
                    self.FTShootingIndex = 0
                    self.Forward = True
                else:self.image = f"Graphics\\Sprites\\{self.FTShooting[int(self.FTShootingIndex)]}.png"
                self.BWalkIndex = 0
                self.FRunningIndex = 0
                self.BRunningIndex = 0
                self.FWalkIndex = 0
            elif self.Recoil[0] > 0 and self.Recoil[1] > 0:
                self.BDShootingIndex += 0.4
                if self.BDShootingIndex >= len(self.BDShooting): 
                    self.Recoil = [0,0]
                    self.image = self.BCooldown
                    self.BDShootingIndex = 0
                    self.Forward = False
                else:self.image = f"Graphics\\Sprites\\{self.BShooting[int(self.BDShootingIndex)]}.png"
                self.BWalkIndex = 0
                self.FRunningIndex = 0
                self.BRunningIndex = 0
                self.FWalkIndex = 0
            elif self.Recoil[0] > 0 and self.Recoil[1] < 0:
                self.BTShootingIndex += 0.4
                if self.BTShootingIndex >= len(self.BTShooting): 
                    self.Recoil = [0,0]
                    self.image = self.BCooldown
                    self.Cooldown = self.GunCooldown[self.Gun]
                    self.BTShootingIndex = 0
                    self.Forward = False
                else:self.image = f"Graphics\\Sprites\\{self.BTShooting[int(self.BTShootingIndex)]}.png"
                self.BWalkIndex = 0
                self.FRunningIndex = 0
                self.BRunningIndex = 0
                self.FWalkIndex = 0

    def gravity(self):
        self.Direction_y -= 1
    
    def update(self):
        self.CollideWiget = Widget(pos=(self.pos["x"],self.pos["y"]),size=(self.Width,self.Height))
        self.Animations()
        self.Collision()
        self.gravity()
        self.Display_image = CoreImage(self.image).texture
        self.pos["x"] += self.Direction_x
        self.pos["y"] += self.Direction_y
        if self.Cooldown > 0:
            self.Cooldown -= 1
