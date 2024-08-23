extends TextureButton

@export var inputName : StringName
var oldInput : InputEvent

func _unhandled_key_input(event):
	InputMap.action_erase_events(
		inputName,
	)
	InputMap.action_add_event(
		inputName,
		event,
	)
	get_parent().text= InputMap.action_get_events(inputName)[0].as_text()
	button_pressed = false

func _ready():
	set_process_unhandled_key_input(false)
	get_parent().text= InputMap.action_get_events(inputName)[0].as_text()

func _on_pressed():
	if not Status.is_choosing:
		Input.mouse_mode = Input.MOUSE_MODE_CAPTURED
		Status.is_choosing = true
		oldInput = InputMap.action_get_events(inputName)[0]


func _on_toggled(toggled_on):
	set_process_unhandled_key_input(toggled_on)
	if toggled_on:
		get_parent().text = '...'
		release_focus()
	else: get_parent().text= InputMap.action_get_events(inputName)[0].as_text()
