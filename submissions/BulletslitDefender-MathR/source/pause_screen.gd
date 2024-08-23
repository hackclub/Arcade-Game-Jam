extends Control

func _on_texture_button_pressed():
	$AudioStreamPlayer.stream = load("res://sound/unpause.mp3")
	$AudioStreamPlayer.play()
	hide()
	$Settings.hide()
	get_tree().paused = false

func _ready():
	if Status.level == 0:
		$TextureRect.material = null
		$Replay.show()
		$HBoxContainer.hide()
		

func _process(delta):
	if Input.is_action_just_pressed("pause") and not Status.is_choosing:
		if visible:
			_on_texture_button_pressed()
		elif not (Status.interacting or get_tree().paused):
			show()
			get_tree().paused = true
			$AudioStreamPlayer.stream = load("res://sound/pause.mp3")
			$AudioStreamPlayer.play()
