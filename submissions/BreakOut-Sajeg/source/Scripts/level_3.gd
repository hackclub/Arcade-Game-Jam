extends Node2D

func _ready():
	if !vars.played_voice_3:
		vars.played_voice_3 = true
		$Player/MultipleSkeletons.play()
	