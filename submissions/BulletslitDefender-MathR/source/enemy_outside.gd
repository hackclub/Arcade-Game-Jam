extends CharacterBody2D

const MAX_Z = 100
var z = -10
@export var phase = 0.
@export var amplitude = 5
@export var frequency = 1.
@onready var base_x = position.x

var dead = false
@export var speed = 1

func _on_input_event(_viewport, event, _shape_idx):
	if dead: return
	if event is InputEventMouseButton and event.pressed and Status.aiming and Status.shot:
		Status.kills += 1
		dead = true
		$AnimationTree['parameters/die/request'] = AnimationNodeOneShot.ONE_SHOT_REQUEST_FIRE

func _process(delta):
	if dead: return
	if $AnimationTree['parameters/breaking/current_state'] == 'no':
		scale.y = 0.2+1.4 * z/MAX_Z
		scale.x = scale.y
		position.y = 40+sign(z)*310*z/MAX_Z
		z += speed*delta
		position.x = amplitude*sin(z*frequency+phase)+base_x
		if z >= MAX_Z and position.x < 100 and position.x > -100:
			$AnimationTree['parameters/breaking/transition_request'] = 'yes'

func hit():
	get_parent().hit()
