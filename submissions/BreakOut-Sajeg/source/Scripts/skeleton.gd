extends CharacterBody2D

@onready var nav_agent = $NavigationAgent2D

@export var path_follow : PathFollow2D
@export var player : CharacterBody2D
@export var blind = false
@export var h_flip_ratio_bigger = 0.5
@export var speed = 15

var follow_speed = 120

var player_detected = false

func _ready():
	$AnimationPlayer.play("run")
	nav_agent.path_desired_distance = 4.0
	nav_agent.target_desired_distance = 4.0

	
func _physics_process(delta):
	if $"Run-sheet".flip_h:
		$Skeleton/CollisionShape2D.position = Vector2(-68, -17)
	else:
		$Skeleton/CollisionShape2D.position = Vector2(68, -17)
		
	if player_detected && !blind:
		var current_agent_position: Vector2 = global_position
		var next_path_position: Vector2 = nav_agent.get_next_path_position()
	
		velocity = current_agent_position.direction_to(next_path_position) * follow_speed
		move_and_slide()
	else:
		path_follow.progress_ratio += (speed * delta) / 100
		if path_follow.progress_ratio > h_flip_ratio_bigger:
			$"Run-sheet".flip_h = false
		else:
			$"Run-sheet".flip_h = true


func create_path():
	nav_agent.target_position = player.global_position
	if player.global_position.x < global_position.x:
		$"Run-sheet".flip_h = true
	else:
		$"Run-sheet".flip_h = false

func _on_area_2d_area_entered(area:Area2D):
	if area.name == "Player":
		$RayCast2D.target_position = $RayCast2D.to_local(area.get_parent().global_position)
		if !$RayCast2D.is_colliding():
			player_detected = true
			path_follow.rotation = 0
			$Timer.start()
	pass
	


func _on_timer_timeout():
	create_path()
	if player_detected:
		$Timer.start()
