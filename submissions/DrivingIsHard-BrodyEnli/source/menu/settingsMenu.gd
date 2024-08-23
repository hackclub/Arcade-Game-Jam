extends Control


func _ready():
	$".".modulate = Color(1, 1, 1, 0)
	var tween = get_tree().create_tween()
	tween.tween_property($".", "modulate", Color(1, 1, 1, 1), 0.1)
	
	$VBoxContainer/Close.grab_focus()

func _on_close_pressed():
	var tween = get_tree().create_tween()
	tween.tween_property($".", "modulate", Color(1, 1, 1, 0), 0.1)
	tween.tween_callback(_close_animation_finished)

func _close_animation_finished():
	get_node("/root/MainMenu/VBoxContainer/PlayButton").grab_focus()
	get_tree().root.remove_child(self)
