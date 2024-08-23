extends Control


# Called when the node enters the scene tree for the first time.
func _ready():
	var levels = $"/root/LevelLogic".get_level_data()
	
	var i = 0
	var first_unbeaten = -1
	for level in levels:
		var level_child: PanelContainer = $"LevelContainer/LevelTemplate".duplicate()
		
		level_child.find_child("LevelNumber", true, false).text = "Level " + str(i + 1)
		level_child.find_child("LevelName", true, false).text = level["name"]
		level_child.find_child("LevelData", true, false).text = \
			"[color=#ddd]Beaten: [color=#" + ("6e6" if level["complete"] else "e66") + "]" + \
				("yes" if level["complete"] else "no") + "[/color]
Laws: [color=#eee]" + str(level["laws"]) + "[/color]"
		level_child.find_child("PlayButton", true, false).pressed.connect(func(): _pressed_play(i))
		
		$"LevelContainer".add_child(level_child)
		
		if first_unbeaten == -1 && !level["complete"]:
			first_unbeaten = i
		i += 1
	
	if first_unbeaten == -1:
		first_unbeaten = 0
	
	# Index 0 is the template, so we add 1 to first_unbeaten
	$"LevelContainer" \
		.get_child(first_unbeaten + 1) \
		.find_child("PlayButton", true, false) \
		.grab_focus()
	
	$"LevelContainer/LevelTemplate".visible = false

func _pressed_play(level_index: int):
	$"/root/LevelLogic".load_level(level_index)

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass


func _on_back_button_pressed():
	get_tree().change_scene_to_file("res://menu/mainMenu.tscn")


func _on_reset_button_pressed():
	$"/root/LevelLogic".reset_beaten_levels()
