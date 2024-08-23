extends Interactive

var tcount = 0

func act():
	$Timer.start()
	$"../../CanvasLayer".show()
	get_tree().paused = true
	$AudioStreamPlayer.play()
	stats_random()

func stats_random():
	Status.player.get_node('CanvasLayer/Counters/Bullets').text = ''
	for i in range(12):
		Status.player.get_node('CanvasLayer/Counters/Bullets').text+= '0123456789ABCDEF'[randi()%16]
	Status.player.get_node('CanvasLayer/Counters/Level').text = ''
	for i in range(12):
		Status.player.get_node('CanvasLayer/Counters/Level').text+= '0123456789ABCDEF'[randi()%16]

func _on_timer_timeout():
	tcount += 1
	if tcount % 5:
		get_window().position += Vector2i(randi()%100-50,randi()%100-50)
	stats_random()
	if tcount > 80:
		Status.level = 1
		Status.dialog = 0
		Status.bullets = 5
		get_tree().paused = false
		Status.interacting = false
		Music.stream = load("res://sound/winds.mp3")
		Music.play()
		get_tree().change_scene_to_file("res://levels/level1.tscn")
