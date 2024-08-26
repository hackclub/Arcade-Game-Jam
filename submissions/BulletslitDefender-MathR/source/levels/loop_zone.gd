extends Area2D


func _on_body_entered(player):
	if player.name != "Player": return
	Status.level = 2
	Status.loop += 1
	Music.stream = load("res://sound/winds.mp3")
	Status.show_end5 = true
	Music.play()
	get_tree().change_scene_to_file.call_deferred("res://levels/level2.tscn")
