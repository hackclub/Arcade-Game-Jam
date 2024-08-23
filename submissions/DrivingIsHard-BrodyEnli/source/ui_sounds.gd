extends Node


var playback:AudioStreamPlaybackPolyphonic


func _enter_tree() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	
	# Create an audio player
	var player = AudioStreamPlayer.new()
	add_child(player)

	# Create a polyphonic stream so we can play sounds directly from it
	var stream = AudioStreamPolyphonic.new()
	stream.polyphony = 32
	player.stream = stream
	player.play()
	# Get the polyphonic playback stream to play sounds
	playback = player.get_stream_playback()

	get_tree().node_added.connect(_on_node_added)
	get_tree().node_removed.connect(_on_node_removed)


func _on_node_added(node: Node) -> void:
	if node is Button:
		node.mouse_entered.connect(_play_hover)
		node.pressed.connect(_play_pressed)
		node.focus_entered.connect(_play_hover)

func _on_node_removed(node: Node) -> void:
	if node is Button:
		node.mouse_entered.disconnect(_play_hover)
		node.pressed.disconnect(_play_pressed)
		node.focus_entered.disconnect(_play_hover)

var _hover_sound = preload('res://assets/sounds/ui_hover.wav');
func _play_hover() -> void:
	playback.play_stream(_hover_sound, 0, 0, randf_range(0.9, 1.1))

var _press_sound = preload('res://assets/sounds/ui_click.wav');
func _play_pressed() -> void:
	playback.play_stream(_press_sound, 0, 0, randf_range(0.9, 1.1))

var _level_start_sound = preload('res://assets/sounds/level_start.ogg')
func play_level_start() -> void:
	playback.play_stream(_level_start_sound, 0, 0, randf_range(0.9, 1.1))

var _broke_law_sound = preload('res://assets/sounds/broke_law.ogg')
func play_broke_law() -> void:
	playback.play_stream(_broke_law_sound, 0, 0, randf_range(0.9, 1.1))

var _satisfied_law_sound = preload('res://assets/sounds/satisfied_law.ogg')
func play_satisfied_law() -> void:
	playback.play_stream(_satisfied_law_sound, 0, 0, randf_range(0.9, 1.1))

var _win_sound = preload('res://assets/sounds/win_level.wav')
func play_win() -> void:
	playback.play_stream(_win_sound, 0, 0, randf_range(0.9, 1.1))

var _lose_sound = preload('res://assets/sounds/lose_level.wav')
func play_lose() -> void:
	playback.play_stream(_lose_sound, 0, 0, randf_range(0.9, 1.1))

var _fire_hydrant_collision_sound = preload('res://assets/sounds/fire_hydrant_collision.ogg')
func play_fire_hydrant_collision() -> void:
	playback.play_stream(_fire_hydrant_collision_sound, 0, 0, randf_range(0.9, 1.1))

var _picnic_table_collision_sound = preload('res://assets/sounds/picnic_table_collision.ogg')
func play_picnic_table_collision() -> void:
	playback.play_stream(_picnic_table_collision_sound, 0, 0, randf_range(0.9, 1.1))

var _trash_can_collision_sound = preload('res://assets/sounds/trash_can_collision.ogg')
func play_trash_can_collision() -> void:
	playback.play_stream(_trash_can_collision_sound, 0, 0, randf_range(0.9, 1.1))

var _vehicle_collision_sound = preload("res://assets/sounds/car_collision.ogg")
func play_vehicle_collision() -> void:
	playback.play_stream(_vehicle_collision_sound, 0, 0, randf_range(0.9, 1.1))

var _building_collision_sound = preload("res://assets/sounds/building_collision.ogg")
func play_building_collision() -> void:
	playback.play_stream(_building_collision_sound, 0, 0, randf_range(0.9, 1.1))
