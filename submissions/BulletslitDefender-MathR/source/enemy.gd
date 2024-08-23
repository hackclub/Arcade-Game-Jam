extends CharacterBody2D

var dead = false

func _on_input_event(_viewport, event, _shape_idx):
	if dead: return
	if event is InputEventMouseButton and event.pressed and Status.aiming and Status.shot:
		Status.kills = (Status.kills+1)%1000000
		dead = true
		$AnimationTree['parameters/die/request'] = AnimationNodeOneShot.ONE_SHOT_REQUEST_FIRE

func shoot(): 
	if dead: return
	var c = $RayCast2D.get_collider()
	if c and c.name == "Player" and c.is_on_floor():
		c.die()

func _process(delta):
	if not is_on_floor():
		velocity.y += 2500*delta
		move_and_slide()
	if dead or Status.dead: return
	var c = $RayCast2D.get_collider()
	if c and c.name == "Player" and c.is_on_floor() and not $AnimationTree['parameters/shoot/active'] and $ShootCooldown.is_stopped():
		$AnimationTree['parameters/shoot/request'] = AnimationNodeOneShot.ONE_SHOT_REQUEST_FIRE
	if Status.interacting:
		$AnimationTree['parameters/shoot/request'] = AnimationNodeOneShot.ONE_SHOT_REQUEST_ABORT
		$ShootCooldown.start()
