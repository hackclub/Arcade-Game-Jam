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
	get_parent().text= InputMap.action_get_events(inputName)[0].as_text().replace(" (Physical)","")
	button_pressed = false

func _ready():
	set_process_unhandled_key_input(false)
	get_parent().text= InputMap.action_get_events(inputName)[0].as_text().replace(" (Physical)","")

func _on_toggled(toggled_on):
	set_process_unhandled_key_input(toggled_on)
	if toggled_on:
		get_parent().text = '...'
		release_focus()
	else: get_parent().text= InputMap.action_get_events(inputName)[0].as_text().replace(" (Physical)","")
