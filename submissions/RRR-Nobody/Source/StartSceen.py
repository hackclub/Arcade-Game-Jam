from kivy.uix.boxlayout import BoxLayout
from kivy.uix.anchorlayout import AnchorLayout
from kivy.uix.gridlayout import GridLayout
from kivy.app import App
from kivy.graphics.vertex_instructions import Rectangle
from kivy.graphics.context_instructions import Color
from kivy.properties import ObjectProperty
from kivy.uix.widget import Widget
from kivy.core.window import Window
from kivy.uix.button import Button

def Navigate_to_Page(Page):
    app = App.get_running_app()
    app.root.clear_widgets()
    app.root.add_widget(Page)

class BrightnessLevel(Widget):
    _instance = None
    brightness = ObjectProperty()

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(BrightnessLevel, cls).__new__(cls, *args, **kwargs)
            cls._instance.brightness = cls.brightness
            cls._instance.brightness = 100
        return cls._instance # The __new__ part was made by ai but everything else was made by me. I needed help makig sure the brightness level transfered over to every Widget

    def set_brightness(self, value):
        self.brightness = int(value)
    
    def return_brightness(self): 
        return self.brightness
   
class TitleScreenWidget(AnchorLayout):
    Brightness_Manager = BrightnessLevel()
    def __init__(self,**kwargs):
        super().__init__(**kwargs)
        self.Get_brightness(self.Brightness_Manager.return_brightness())

    def Goto_controls_page(self):
        Navigate_to_Page(ControlsWidget())
    def Goto_settings_page(self):
        Navigate_to_Page(SettingsWidget())
    def Get_brightness(self,Brightness):
        if len(self.canvas.children) > 0:
            self.canvas.children = self.canvas.children[:8]
        with self.canvas:
            Brightness = (100 - Brightness)/100
            Color(0,0,0,Brightness)
            Rectangle(pos=(0,0),size=(Window.width,Window.height))  

class ControlsWidget(BoxLayout):
    Brightness_Manager = BrightnessLevel()
    def __init__(self,**kwargs):
        super().__init__(**kwargs)
        self.Get_brightness(self.Brightness_Manager.return_brightness())
    
    def Back(self):
        Navigate_to_Page(TitleScreenWidget())

    def Get_brightness(self,Brightness):
        if len(self.canvas.children) > 0:
            self.canvas.children = self.canvas.children[:8]
        with self.canvas:
            Brightness = (100 - Brightness)/100
            Color(0,0,0,Brightness)
            Rectangle(pos=(0,0),size=(Window.width,Window.height))

class SettingsWidget(GridLayout):
    Brightness_Manager = BrightnessLevel()
    def __init__(self,**kwargs):
        super().__init__(**kwargs)
        self.Get_brightness(self.Brightness_Manager.return_brightness())
        self.Show_Brightness()
    def Back(self):
        Navigate_to_Page(TitleScreenWidget())
        self.Get_brightness(self.Brightness_Manager.return_brightness())
    
    def Change_brightness(self,widget):
        self.Brightness_Manager.set_brightness(int(widget.value))
        self.Get_brightness(self.Brightness_Manager.return_brightness())
    
    def Get_brightness(self,Brightness):
        if len(self.canvas.children) > 0:
            self.canvas.children = self.canvas.children[:8]
        with self.canvas:
            Brightness = (100 - Brightness)/100
            Color(0,0,0,Brightness)
            Rectangle(pos=(0,0),size=(Window.width,Window.height))
    
    def Show_Brightness(self):
        for instruction in self.canvas.children:
            if isinstance(instruction, Color):
                alpha = instruction.rgba[-1]
                alpha = alpha * 100
                alpha = 100 - round(alpha)
                self.ids.Brightness_Slider.value = alpha
            
class HoverButtons(Button):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        Window.bind(mouse_pos=self.on_hover)

    def on_hover(self, window, pos):
        if self.collide_point(*pos):
            self.background_normal = ""
            self.background_color = (1.0,1.0,1.0,1)
            self.color = (0,0,0,1)
        else:
            self.background_color = (0,0,0,0)
            self.color = (1,1,1,1)
            self.background_normal = ""

if __name__ == "__main__":
    class TitleScreenApp(App):
        def build(self):
            Brightness_Manager = BrightnessLevel()
            return TitleScreenWidget()






    TitleScreenApp().run()
