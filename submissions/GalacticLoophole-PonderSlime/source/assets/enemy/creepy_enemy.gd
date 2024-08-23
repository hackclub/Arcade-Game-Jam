extends CharacterBody3D

var random_timer
var spawn : Vector3
const speed = 5.0
const JUMP_VELOCITY = 4.5
var is_moving = 1
var move_speed = speed
@export var root = CharacterBody3D
func _ready() -> void:
	$Timer.start()
	spawn = global_position
func _physics_process(delta: float) -> void:
	var input = Input.get_vector("left", "right", "forward", "back")
	var movement_dir = transform.basis * Vector3(0, 0, 1)
	velocity.x = movement_dir.x * move_speed
	velocity.z = movement_dir.z * move_speed
	# Add the gravity.
	if not is_on_floor():
		velocity += get_gravity() * delta
	
	move_and_slide()
	if global_position.y <= -100:
		global_position = spawn
		print("dead")
	if is_moving >= 60:
		move_speed = speed
	else:
		move_speed = 0

func _on_timer_timeout() -> void:
	rotation.y += randi_range(-45, 45)
	random_timer = randi_range(4, 6)
	is_moving = randi_range(0, 100)
	print(is_moving)
	$Timer.wait_time = random_timer
	$Timer.start()
