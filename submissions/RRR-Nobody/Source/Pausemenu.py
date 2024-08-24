from kivy.uix.relativelayout import RelativeLayout
from kivy.uix.widget import Widget
from kivy.uix.boxlayout import BoxLayout
from kivy.app import App
from kivy.core.window import Window
from kivy.uix.button import Button
from StartSceen import BrightnessLevel
from kivy.uix.gridlayout import GridLayout
from kivy.graphics.vertex_instructions import Rectangle
from kivy.graphics.context_instructions import Color

def Navigate_to_Page(self,Page): #Temp function
    app = App.get_running_app()
    app.root.remove_widget(self)
    app.root.add_widget(Page)

class PauseWidgets(RelativeLayout):
    Brightness_Manager = BrightnessLevel()
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.Get_brightness(self.Brightness_Manager.return_brightness())
    def Goto_Settings(self):
        Navigate_to_Page(self,SettingsWidget())
    
    def Goto_Controls(self):
        Navigate_to_Page(self,ControlsWidget())
    
    def Get_brightness(self,Brightness):
        if len(self.canvas.children) > 0:
            self.canvas.children = self.canvas.children[:8]
        with self.canvas:
            Brightness = (100 - Brightness)/100
            Color(0,0,0,Brightness)
            Rectangle(pos=(0,0),size=(Window.width,Window.height))

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


class SettingsWidget(Widget):
    Brightness_Manager = BrightnessLevel()
    def __init__(self,**kwargs):
        super().__init__(**kwargs)
        self.Get_brightness(self.Brightness_Manager.return_brightness())
        self.Show_Brightness()
    
    def Back(self):
        Navigate_to_Page(self,PauseWidgets())
        self.Get_brightness(self.Brightness_Manager.return_brightness())
    
    def Change_brightness(self,widget):
        self.Brightness_Manager.set_brightness(int(widget.value))
        self.canvas.children = self.canvas.children[:-3]
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

class ControlsWidget(BoxLayout):
    Brightness_Manager = BrightnessLevel()
    def __init__(self,**kwargs):
        super().__init__(**kwargs)
        self.Get_brightness(self.Brightness_Manager.return_brightness())
    
    def Back(self):
        Navigate_to_Page(self,PauseWidgets())

    def Get_brightness(self,Brightness):
        if len(self.canvas.children) > 0:
            self.canvas.children = self.canvas.children[:8]
        with self.canvas:
            Brightness = (100 - Brightness)/100
            Color(0,0,0,Brightness)
            Rectangle(pos=(0,0),size=(Window.width,Window.height))


if __name__ == "__main__":
    class PMenuApp(App):
        pass
    PMenuApp().run()