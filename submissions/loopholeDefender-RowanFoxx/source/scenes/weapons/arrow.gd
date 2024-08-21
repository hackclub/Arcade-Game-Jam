extends CharacterBody3D

@export var speed = 200
@export var user_gravity = 10

var y_velocity = 0

var has_collided: bool = false

var prev_pose: Vector2 = Vector2.ZERO

@onready var player = get_parent().get_node("Player")
@onready var arrow_mesh = $ArrowMesh

func init(draw_percentage: float) -> void:
	velocity.y = -sin(rotation.x) * speed * draw_percentage
	velocity.x = sin(rotation.y) * cos(rotation.x) * speed * draw_percentage
	velocity.z = cos(rotation.y) * cos(rotation.x) * speed * draw_percentage
	
	prev_pose = Vector2(global_position.x, global_position.y)

func _physics_process(delta: float) -> void:
	if not has_collided:
		velocity.y -= user_gravity * delta * 4
		var collision_info = move_and_collide(velocity * delta)
		
		# Calculate angle based on pose delta
		rotation.x = -asin(velocity.y / speed)
		
		if collision_info:
			# stop all physics updates and disable hitbox
			var collider = collision_info.get_collider()
			has_collided = true
			velocity = Vector3.ZERO
			$CollisionShape3D.disabled = true
			
			global_position += collision_info.get_remainder() * 0.5
			
			# delete the arrow on hitting an enemy
			if collider.is_in_group("enemy"):
				collider.die(self)
				queue_free()
			
	else:
		velocity = Vector3.ZERO 
		move_and_collide(velocity * delta)
