extends Node

var player_health = 100
var cans_count = 0
var current_scene = null
var power_off : bool = false
var random10 = randi_range(0, 10)
var select : bool = false
func _ready() -> void:
	var root = get_tree().root
	current_scene = root.get_child(root.get_child_count() - 1)
	var saveFile = FileAccess.open("user://game_stats.save", FileAccess.READ)
	if(FileAccess.get_open_error() != OK):
		return
	else:
		while saveFile.get_position() < saveFile.get_length():
			var json_string = saveFile.get_line()
			var json = JSON.new()
			var parse_result = json.parse(json_string)
			if not parse_result == OK:
				print("JSON Parse Error: ", json.get_error_message(), " in ", json_string, " at line ", json.get_error_line())
				continue
			var node_data = json.get_data()
			var health = node_data["health"]
func _process(delta: float) -> void:
	save_game()
	if Input.is_action_just_pressed("light"):
		_random_event()
		random10 = randi_range(0, 10)
		
func _random_event():
	if random10 <= 5:
		power_off = true
	else:
		power_off = false
func _deferred_goto_scene(path):
	current_scene.free()
	var s = ResourceLoader.load(path)
	current_scene = s.instantiate()
	get_tree().root.add_child(current_scene)
	get_tree().current_scene = current_scene

func save_game():
	var saveStats = FileAccess.open("user://game_stats.save", FileAccess.WRITE)
	if(FileAccess.get_open_error() != OK):
		return false
	var cans : int = cans_count
	var current_health : int = player_health
	var save_dict = {"cans" : cans, "health" : current_health}
	
	var json_string = JSON.stringify(save_dict)
	saveStats.store_line(json_string)
