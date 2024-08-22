extends CharacterBody2D
signal died
var jumping = false
var coyote_frames = 60
var coyote = false
var last_floor = false
@export var SPEED = 550.0
var JUMP_VELOCITY = -500.0
@export_range(0,20) var grav_transition
# Get the gravity from the project settings to be synced with RigidBody nodes.
var gravity = ProjectSettings.get_setting("physics/2d/default_gravity")
var gravity_normal = gravity
var grav_num = gravity * 2
var jump_buffer
var finished_noise = false
func _ready():
	$CoyoteTimer.wait_time = coyote_frames / 60.0
	Global.need_reset = false

func _physics_process(delta):
	if Global.is_game_started:
	#print(Global.need_reset)
		if velocity.x != 0:
			$AnimatedSprite2D.flip_h = velocity.x < 0
			#if $OnFloor.is_colliding():
			$AnimatedSprite2D.play("walk")
		if velocity.x == 0:
			$AnimatedSprite2D.stop()
		# Add the gravity.
		if not is_on_floor():
		
			if velocity.y > 0:
				gravity = lerp(gravity, grav_num, 0.025)
				if gravity <= gravity_normal:
				
					pass
				
			velocity.y += gravity * delta
			if Input.is_action_just_pressed("up") and $OnFloor.is_colliding():
				jump_buffer = true
			
			#$AnimatedSprite2D.play("jump")
		#velocity.y = JUMP_VELOCITY
		if is_on_floor():
			if jump_buffer:
				velocity.y = JUMP_VELOCITY
				jump_buffer = false
			gravity = gravity_normal
		
	# Handle jump.
	
		if Input.is_action_just_pressed("up") and is_on_floor():
			velocity.y = JUMP_VELOCITY
		if Input.is_action_just_pressed("up") and (is_on_floor() or coyote):
			velocity.y = JUMP_VELOCITY
			jumping = true
		if not is_on_floor() and last_floor and not jumping:
			coyote = true
			$CoyoteTimer.start()
		if Input.is_action_just_pressed("up") and $OnFloor.is_colliding():
			#velocity.y = JUMP_VELOCITY
			#jump_buffer = true
			pass
	# Get the input direction and handle the movement/deceleration.
	# As good practice, you should replace UI actions with custom gameplay actions.
		var direction = Input.get_axis("left", "right")
		if direction:
			velocity.x = direction * SPEED
		else:
			velocity.x = move_toward(velocity.x, 0, SPEED)
	
		move_and_slide()
		last_floor = is_on_floor()
	
		if Global.need_reset == true:
			#if Global.score > 0:
				#Global.score -= 1
			#Global.score = 0
			Global.is_game_started = false
			died.emit()
			
			Global.need_reset = false
			#get_tree().reload_current_scene()
			
			#Global.need_reset = false

func _on_coyote_timer_timeout():
	coyote = false 


func _on_die_noise_finished() -> void:
	finished_noise = true
