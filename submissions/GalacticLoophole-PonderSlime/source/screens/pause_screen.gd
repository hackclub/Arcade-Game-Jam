extends Control


# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	pass # Replace with function body.

var pause_game : bool = false
var options: bool = false
# Called every frame. 'delta' is the elapsed time since the previous frame.
@onready var exit_but = $OptionsScreen/MarginContainer/VBoxContainer/Button
func _process(delta: float) -> void:
	_is_paused()
	if get_tree().paused:
		$ScreenVisibility.visible = true
	else:
		$ScreenVisibility.visible = false
		$OptionsScreen.visible = false
		
func _is_paused():
	if Input.is_action_just_pressed("pause") and options == false:
		pause_game = !pause_game
		get_tree().paused = !get_tree().paused
	if pause_game == false:
		Input.mouse_mode = Input.MOUSE_MODE_CAPTURED
	elif pause_game == true:
		Input.mouse_mode = Input.MOUSE_MODE_VISIBLE


func _on_options_pressed() -> void:
	print("options")
	$OptionsScreen.visible = true
	$ScreenVisibility.visible = false
	options = true


func _on_resume_pressed() -> void:
	pause_game = false
	get_tree().paused = !get_tree().paused


func _on_quit_pressed() -> void:
	get_tree().quit()


func _on_exit_pressed() -> void:
	$OptionsScreen.visible = false
	$ScreenVisibility.visible = true
	options = false
