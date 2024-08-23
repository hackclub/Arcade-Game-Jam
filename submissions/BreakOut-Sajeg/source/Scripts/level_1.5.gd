extends Node2D

func _ready():
	if !vars.played_voice_2:
		vars.played_voice_2 = true
		$Player/Skeletons.play()