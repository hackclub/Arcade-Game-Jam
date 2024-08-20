extends CharacterBody3D

var movement_speed: float = 10.0
var movement_target_position: Vector3 = Vector3(0.0,6.0,0.0)
var dead: bool = false

@onready var navigation_agent: NavigationAgent3D = $NavigationAgent3D
@onready var animation_player = $AnimationPlayer
@onready var player_model = $Armature

signal navigation_finished

func _ready():
	animation_player.speed_scale = 0.35
	animation_player.play("run")
	
	# These values need to be adjusted for the actor's speed
	# and the navigation layout.
	navigation_agent.path_desired_distance = 0.5
	navigation_agent.target_desired_distance = 0.5

	# Make sure to not await during _ready.
	call_deferred("actor_setup")

func actor_setup():
	# Wait for the first physics frame so the NavigationServer can sync.
	await get_tree().physics_frame

func set_movement_target(movement_target: Vector3):
	navigation_agent.set_target_position(movement_target)

func _physics_process(_delta):
	if navigation_agent.is_navigation_finished() || dead:
		return

	var current_agent_position: Vector3 = global_position
	var next_path_position: Vector3 = navigation_agent.get_next_path_position()

	velocity = current_agent_position.direction_to(next_path_position) * movement_speed
	player_model.rotation.y = atan2(velocity.x, velocity.z)
	move_and_slide()

func die(other: Node3D) -> void:
	# Trigger death
	dead = true
	animation_player.speed_scale = 1.0
	animation_player.play("death")
	
	# Point in direction of arrow
	global_rotation.y = -other.global_rotation.y

func _on_animation_player_animation_finished(anim_name: StringName) -> void:
	if (anim_name == "death"):
		$AnimationPlayer2.play("death_fade")

func _on_navigation_agent_3d_navigation_finished() -> void:
	queue_free()
	navigation_finished.emit()
