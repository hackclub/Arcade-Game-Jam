extends Control

# Called when the node enters the scene tree for the first time.
func _ready():
	$VBoxContainer/PlayButton.grab_focus()
	Input.set_mouse_mode(Input.MOUSE_MODE_VISIBLE)

func _on_play_button_pressed():
	$"/root/LevelLogic".load_from_menu()

var levelSelectScene = preload("res://menu/levelSelect.tscn")
func _on_select_level_button_pressed():
	get_tree().change_scene_to_packed(levelSelectScene)

var settingsScene = preload("res://menu/settingsMenu.tscn").instantiate()
func _on_settings_button_pressed():
	settingsScene.request_ready()
	get_tree().root.add_child(settingsScene)

func _on_quit_button_pressed():
	get_tree().quit()
