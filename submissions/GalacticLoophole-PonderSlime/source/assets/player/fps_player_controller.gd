extends CharacterBody3D

@export var gravity = 9.8
var speed
@export var sprint_speed = 8
@export var walk_speed = 5
var jump_speed = 7
var mouse_sensitivity = 0.002
@export var cam : Camera3D
var grav : bool = false
var flip : bool = false
var is_rotating : bool = false

const bob_frequency = 2.4
const bob_ammount = 0.08
var t_bob = 0.0

const base_fov = 75.0
const fov_change = 1.5

func _ready() -> void:
	add_to_group("player")
func _physics_process(delta):
	if Input.is_action_just_pressed("grav_swap"):
		grav = !grav
		gravity = -gravity
		jump_speed = -jump_speed
		flip = !flip
		is_rotating = true
			
	if flip == true:
		rotation.z = lerp_angle(rotation.z, deg_to_rad(180), delta * deg_to_rad(180))
		if rotation.z == deg_to_rad(180):
			is_rotating = false
	elif flip== false:
		rotation.z = lerp_angle(rotation.z, deg_to_rad(0), delta * deg_to_rad(180))
		if rotation.z == deg_to_rad(0):
			is_rotating = false
	velocity.y += -gravity * delta
	
	if Input.is_action_pressed("sprint"):
		speed = sprint_speed
	else:
		speed = walk_speed
	var input = Input.get_vector("left", "right", "forward", "back")
	var movement_dir = transform.basis * Vector3(input.x, 0, input.y)
	velocity.x = movement_dir.x * speed
	velocity.z = movement_dir.z * speed
	
	if (is_on_floor() or is_on_ceiling()) and Input.is_action_just_pressed("jump"):
			velocity.y += jump_speed
	
	t_bob += delta * velocity.length() * float(is_on_floor())
	cam.position = lerp(cam.position,_headbob(t_bob), delta * 2)
	cam.fov = lerp(cam.fov, base_fov + fov_change * clamp(velocity.length(), 0.5, sprint_speed * 2), delta * 8.0)
	
	if velocity.rotated(Vector3.UP, -rotation.y).x < 0:
		cam.rotation_degrees.z = lerp(cam.rotation_degrees.z, 1.0, delta * 3)
	elif velocity.rotated(Vector3.UP, -rotation.y).x > 0:
		cam.rotation_degrees.z = lerp(cam.rotation_degrees.z, -1.0, delta * 3)
	else:
		cam.rotation_degrees.z = lerp(cam.rotation_degrees.z, 0.0, delta * 3)
	
	move_and_slide()
	
func _headbob(time) -> Vector3:
	return Vector3(sin(time * bob_frequency) * bob_ammount / 2, cos(time * bob_frequency / 2) * bob_ammount / 2 + 0.785, 0)

func _input(event):
	if event is InputEventMouseMotion and Input.mouse_mode == Input.MOUSE_MODE_CAPTURED:
		rotate_object_local(Vector3(0, 1, 0),-event.relative.x * mouse_sensitivity)
		cam.rotate_object_local(Vector3(1, 0, 0), -event.relative.y * mouse_sensitivity)
		cam.rotation.x = clampf(cam.rotation.x, -deg_to_rad(70), deg_to_rad(70))
