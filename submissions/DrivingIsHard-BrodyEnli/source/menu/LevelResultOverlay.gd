extends Control


func _enter_tree():
	modulate = Color.TRANSPARENT
	visible = false
	$"/root/LevelLogic".law_verification_signal.connect(_law_verification_message)

func _exit_tree():
	$"/root/LevelLogic".law_verification_signal.disconnect(_law_verification_message)

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass

var broke_laws: bool = false

var final_broken_law_label_settings = load("res://menu/finalBrokenLawLabelSettings.tres")
func _law_verification_message(message):
	var type: String = message[0]
	
	if type == "finish":
		var success: bool = message[1]["success"]
		broke_laws = !success
		
		visible = true
		var tween = get_tree().create_tween()
		tween.tween_property(self, "modulate", Color.WHITE, 0.5)
		
		$"ColorRect/FailTitle".visible = !success
		$"ColorRect/SuccessTitle".visible = success
		
		if success:
			var last_level = message[1]["lastLevel"]
			$"ColorRect/SuccessTitle/PressAnyKeyWin".visible = last_level
			$"ColorRect/SuccessTitle/PressAnyKey".visible = !last_level
		
		if !success:
			var failedLaws = message[1]["brokenLaws"]
			var children = $"ColorRect/FailTitle/FailedLaws".get_children()
			for child in children:
				$"ColorRect/FailTitle/FailedLaws".remove_child(child)
			
			for law in failedLaws:
				var label = Label.new()
				label.text = law
				label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
				label.label_settings = final_broken_law_label_settings
				$"ColorRect/FailTitle/FailedLaws".add_child(label)

func _unhandled_input(event):
	if !event.is_released():
		return
	
	if visible && (event is InputEventKey || event is InputEventJoypadButton):
		$"/root/LevelLogic".level_result_continue(broke_laws)
