extends CharacterBody2D
class_name Outside

@export var z: float
@export var main_scale: float
const MAX_Z = 100

func _input_event(_viewport, event, _shape_idx):
	if event is InputEventMouseButton:
		get_viewport().set_input_as_handled()

func _ready():
	scale.y = 0.2+1.4 * z/MAX_Z
	scale.x = scale.y
	scale *= main_scale
	position.y = 40+sign(z)*310*z/MAX_Z
