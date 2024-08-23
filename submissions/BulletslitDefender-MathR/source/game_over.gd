extends Control

func _on_texture_button_pressed():
	process_mode = Node.PROCESS_MODE_DISABLED
	$"../AnimationPlayer".play("retry")
	$"../CloseSound".play()

func _ready():
	if Status.level == 0:
		$TextureRect.material = null
		$Replay.show()
		$HBoxContainer.hide()
	
