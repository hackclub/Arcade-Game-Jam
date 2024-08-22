extends Node2D

func _ready():
	if !vars.played_voice_1:
		$Player/AudioStreamPlayer2D.play()
		get_node("./Player").intro_finished = false

func _on_audio_stream_player_2d_finished():
	get_node("./Player").intro_finished = true
	vars.played_voice_1 = true
