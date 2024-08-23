extends Control

const LAW_LIST_UPDATE_INTERVAL = 0.05; # In seconds

var law_update_timer := Timer.new()
func _enter_tree():
	law_update_timer.one_shot = false
	law_update_timer.autostart = true
	law_update_timer.wait_time = LAW_LIST_UPDATE_INTERVAL
	law_update_timer.connect("timeout", _update_laws)
	add_child(law_update_timer)
	
	$"/root/LevelLogic".law_verification_signal.connect(_law_verification_message)
	
func _exit_tree():
	law_update_timer.disconnect("timeout", _update_laws)
	$"/root/LevelLogic".law_verification_signal.disconnect(_law_verification_message)

var broken_law_label_settings = load("res://menu/brokenLawLabelSettings.tres")
var unbroken_law_label_settings = load("res://menu/unbrokenLawLabelSettings.tres")
var final_broken_law_label_settings = load("res://menu/finalBrokenLawLabelSettings.tres")
var final_unbroken_law_label_settings = load("res://menu/finalUnbrokenLawLabelSettings.tres")

func _law_verification_message(message):
	var type: String = message[0]
	
	if type == "laws":
		_update_law_styles(message[1])
	elif type == "law":
		var data: Dictionary = message[1]
		var label: Label = $"LawList".get_child(data["index"])
		if !label:
			return
		
		if data["broken"]:
			label.label_settings = final_broken_law_label_settings
			label.find_child("FailParticles", false, false).emitting = true
			await get_tree().create_timer(0.4).timeout
			label.find_child("FailParticles", false, false).emitting = false
		else:
			label.label_settings = final_unbroken_law_label_settings
			label.find_child("SuccessParticles", false, false).emitting = true
			await get_tree().create_timer(0.3).timeout
			label.find_child("SuccessParticles", false, false).emitting = false

var previous_law_list_length := 0
func _update_laws():
	var lawVerificationRunning = $"/root/LevelLogic".law_verification_running
	if lawVerificationRunning:
		return
	
	var law_status: Array[Dictionary] = $"/root/LevelLogic".get_law_status()
	if previous_law_list_length != law_status.size() && !lawVerificationRunning:
		var children = $"LawList".get_children()
		for child in children:
			$"LawList".remove_child(child)
		for law in law_status:
			var label = Label.new()
			label.text = "- " + law["name"]
			if law["broken"]:
				label.label_settings = broken_law_label_settings
			else:
				label.label_settings = unbroken_law_label_settings
			$"LawList".add_child(label)
			
			label.add_child($"SuccessParticles".duplicate())
			label.add_child($"FailParticles".duplicate())
		
		previous_law_list_length = law_status.size()
	else:
		_update_law_styles(law_status)

func _update_law_styles(law_status: Array[Dictionary]):
	var idx = 0
	for law in law_status:
		var label = $"LawList".get_child(idx)
		if !label:
			break
		
		if law["broken"]:
			label.label_settings = broken_law_label_settings
		else:
			label.label_settings = unbroken_law_label_settings
		idx += 1
