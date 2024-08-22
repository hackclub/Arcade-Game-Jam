extends Node2D

@onready var label = %Label
@onready var result_label = %ResultLabel
@onready var background = %TextureRect

const red = Color(1.0,0.0,0.0,1.0)
const green = Color(0.0, 1.0, 0.0, 1.0)
const target_time = 20
var stopwatch = 0.0

func _ready():
	if (get_tree().paused):
		get_tree().paused = false

func _process(delta):
	stopwatch += delta
	
func _physics_process(delta):
	if (stopwatch > target_time):
		label.set("theme_override_colors/font_color", red)
		result_label.set("theme_override_colors/font_color", red)
		background.modulate = red
		result_label.text = "Result: Loss"
		get_tree().paused = true
		await get_tree().create_timer(2).timeout
		get_tree().reload_current_scene()
	else:
		label.set("theme_override_colors/font_color", green)
	label.text = "Your Time: " + str(round(stopwatch)) + " seconds"

