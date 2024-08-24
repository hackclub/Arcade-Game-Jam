from kivy.app import App
from kivy.lang import Builder
from kivy.uix.relativelayout import RelativeLayout
from kivy.graphics.vertex_instructions import Rectangle
from kivy.core.window import Window
from kivy.properties import Clock
from kivy.graphics.context_instructions import Color
#Other files
from StartSceen import TitleScreenWidget
from Player import Player
from Levels import MapWidget
from Pausemenu import PauseWidgets
from End import EndScreen
#--------

Builder.load_file("titlescreen.kv")

class MainGameWidgets(RelativeLayout):
    Game_start = False
    PMenu = None
    def __init__(self,**kwargs):
        super().__init__(**kwargs)
        self.Map = MapWidget()
        self.Old_Window_Size = [Window.width,Window.height]
        self.Player = Player()
        self.Pause = False
        self.Ended = False
        self.Sprint_Cooldown = 10
        self.Sprint_Timer = 3
        self._keyboard = Window.request_keyboard(self.keyboard_closed, self)
        self._keyboard.bind(on_key_down=self.on_keyboard_down)
        self._keyboard.bind(on_key_up=self.on_keyboard_up)
        Clock.schedule_interval(self.update,1/60)
        Window.bind(mouse_pos=self.Mouse_Motion)

    
    def on_start_click(self):
        self.clear_widgets()
        Builder.unload_file("titlescreen.kv")
        self.add_widget(self.Map)
        self.Old_Window_Size = [Window.width,Window.height]
        self.Map.Load_Level()
        self.Game_start = True
        self.Player.Borders = self.Map.Blocks
        self.Player_Spawn()
        self.Map.Player_Amno.text = f"{self.Player.Ammo}/{self.Player.FullAmmo}"
    
    def on_pause_back_click(self):
        self.Pause = False
        Builder.unload_file("PMenu.kv")
        self.remove_widget(self.PMenu)

    def Player_Spawn(self):
        with self.Map.canvas.after:
            self.Player.pos["x"] = self.Map.Spawnpoint[0]
            self.Player.pos["y"] = self.Map.Spawnpoint[1]
            self.Player.Moved = False
            self.Player.DrawnRect = Rectangle(pos=(self.Player.pos["x"],self.Player.pos["y"]),size=(self.Player.Width,self.Player.Height),texture=self.Player.Display_image)
    
    def keyboard_closed(self):
        self._keyboard.unbind(on_key_down=self.on_keyboard_down)
        self._keyboard.unbind(on_key_up=self.on_keyboard_up)
        self._keyboard = None

    def Mouse_Motion(self, window, pos):
        self.Player.mousepos = pos

    def on_keyboard_down(self, keyboard, keycode, text, modifiers):
        if self.Game_start:
            if keycode[1] == "p" and not self.Pause:
                self.Pause = True
                Builder.load_file("PMenu.kv")
                self.PMenu = PauseWidgets()
                self.add_widget(self.PMenu)
            if not self.Pause:
                self.Player.Moved = True
                self.Player.Input(keycode)
        return True

    def on_keyboard_up(self,keyboard,keycode):
        self.Player.Movement_Reset()
        try:self.Player.Movement_Keys.remove(keycode[1])
        except:pass
        return True
    
    def Rule3(self):
        if not self.Player.Movement_Keys and self.Player.Recoil.count(0) == 2 and self.Player.onground and self.Player.Moved:
            self.Player.Death = True

    def Borders(self):
        if (self.Player.pos["x"] < 0 or self.Player.pos["x"] > Window.width) or (self.Player.pos["y"] < 0 or self.Player.pos["y"] > Window.height):
            self.Player.Death = True
    
    def Sprint_Counter(self,dt):
        if not self.Ended:
            if self.Sprint_Timer > 0:
                if abs(self.Player.Direction_x) == self.Player.SprintSpeed:
                    self.Sprint_Timer -= 1
                    self.Map.Sprint_label.text = f"Sprint Timer: {self.Sprint_Timer}"
                    if self.Sprint_Timer == 0:
                        self.Map.Sprint_label.text = f"Sprint Cooldown: {self.Sprint_Cooldown}"
                        self.Player.Sprint = False
                        self.Player.Direction_x = 0
                else:
                    self.Sprint_Timer = 3
                    self.Map.Sprint_label.text = f"Sprint Timer: {self.Sprint_Timer}"
            else:
                self.Sprint_Cooldown -= 1
                self.Map.Sprint_label.text = f"Sprint Cooldown: {self.Sprint_Cooldown}"
                if self.Sprint_Cooldown == 0:
                    self.Sprint_Cooldown = 10
                    self.Player.Sprint = True
                    self.Sprint_Timer = 3

    def Death(self):
        if self.Player.Death:
            self.Player.pos["x"] = self.Map.Spawnpoint[0]
            self.Player.pos["y"] = self.Map.Spawnpoint[1]
            self.Redraw_Player()
            self.Player.Ammo = self.Player.FullAmmo
            self.Player.Moved = False
            self.Player.Death = False

    def Redraw_Player(self):
        self.Map.canvas.after.children.remove(self.Player.DrawnRect)
        with self.Map.canvas.after:
            Color(1,1,1,1)
            self.Player.DrawnRect = Rectangle(pos=(self.Player.pos["x"],self.Player.pos["y"]),size=(self.Player.Width,self.Player.Height),texture=self.Player.Display_image)

    def Window_Change(self):
        if self.Map.Map and self.Map.Window_change:
            x_ratio = self.Player.pos["x"]/self.Old_Window_Size[0]
            y_ratio = self.Player.pos["y"]/self.Old_Window_Size[1]
            self.Player.pos["x"] = int(x_ratio*Window.width)
            self.Player.pos["y"] = int(y_ratio*Window.height)
            self.Player.Borders = self.Map.Blocks
            self.Map.Window_change = False
            self.Old_Window_Size = [Window.width,Window.height]

    def Next_Level(self): 
        if self.Player.CollideWiget.collide_widget(self.Map.NextDoor):
            if self.Map.Level < 7:
                self.Map.Level += 1
                self.Gun_update()
                self.Map.Current_Level = f"Graphics\\Maps\\Level{self.Map.Level}.tmx"
                self.Map.Blocks = []
                self.Map.Load_Level()
                self.Sprint_Cooldown = 10
                self.Sprint_Timer = 3
                self.Map.Sprint_label.text = f"Sprint Timer: {self.Sprint_Timer}"
                self.Player.Borders = self.Map.Blocks
                self.Player.pos["x"] = self.Map.Spawnpoint[0]
                self.Player.pos["y"] = self.Map.Spawnpoint[1]
                self.Player.Moved = False
                self.Redraw_Player()
                if self.Map.Level == 2:Clock.schedule_interval(self.Sprint_Counter,1)
                self.Map.Player_Amno.text = f"{self.Player.Ammo}/{self.Player.FullAmmo}"
            else:
                self.Map.Cooldown_label.text = "The End"
                self.Ended = True
                self.remove_widget(self.Map)
                Builder.load_file("End.kv")
                self.End = EndScreen()
                self.add_widget(self.End)
    
    def Gun_update(self):
        if self.Map.Level < 4:
            self.Player.Ammo = 0
            self.Player.FullAmmo = 0
        elif self.Map.Level == 4:
            self.Player.Gun = "Shotgun"
            self.Player.Ammo = 10
            self.Player.FullAmmo = 10
        elif self.Map.Level == 5:
            self.Player.Gun = "Shotgun"
            self.Player.Ammo = 2
            self.Player.FullAmmo = 2
        elif self.Map.Level == 6:
            self.Player.Gun = "Shotgun"
            self.Player.Ammo = 15
            self.Player.FullAmmo = 15
        elif self.Map.Level == 7:
            self.Player.Ammo = 0
            self.Player.FullAmmo = 0

    def Change_Labels(self):
        self.Map.Cooldown_label.text = f"Cooldown: {self.Player.Cooldown}s"
        self.Map.Player_Amno.text = f"{self.Player.Ammo}/{self.Player.FullAmmo}"
        if self.Player.Cooldown == 0: self.Map.Cooldown_label.color = (0,1,0,1)
        if self.Player.Cooldown > 0: self.Map.Cooldown_label.color = (1,0,0,1)
        if self.Player.Ammo == 0: self.Map.Player_Amno.color = (1,0,0,1)
        if self.Player.Ammo > 0: self.Map.Player_Amno.color = (0,1,0,1)

    def DeathlyBlocks(self):
        for block in self.Map.DeadlyBlocks:
            if self.Player.CollideWiget.collide_widget(block):
                self.Player.Death = True

    def update(self,dt):
        if self.Game_start and not self.Pause and not self.Ended:
            self.Player.update()
            self.Window_Change()
            self.Redraw_Player()
            self.Borders()
            self.Death()
            if self.Map.Level > 2:
                if self.Map.Level != 7:
                    self.Map.Move_Blocks()
                self.Rule3()
            if self.Map.Level == 7:
                self.DeathlyBlocks()
                self.Map.Move_Blocks2()
            self.Change_Labels()
            self.Next_Level()

class RRRApp(App):
    def build(self):
        return MainGameWidgets()




RRRApp().run()