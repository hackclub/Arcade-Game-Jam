extends Control


func _ready():
	$".".modulate = Color(1, 1, 1, 0)
	var tween = get_tree().create_tween()
	tween.tween_property($".", "modulate", Color(1, 1, 1, 1), 0.1)
	tween.tween_callback(_show_animation_finished)
	
	$VBoxContainer/Unpause.grab_focus()

func _show_animation_finished():
	get_tree().paused = true

func _on_close_pressed():
	var tween = get_tree().create_tween()
	tween.tween_property($".", "modulate", Color(1, 1, 1, 0), 0.1)
	tween.tween_callback(_close_animation_finished)
	get_tree().paused = false

func _close_animation_finished():
	get_tree().root.remove_child(self)

func _on_return_to_level_select_pressed():
	get_tree().paused = false
	get_tree().change_scene_to_file("res://menu/levelSelect.tscn")
	get_tree().root.remove_child(self)
