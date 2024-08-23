extends CharacterBody2D
class_name Player

const SPEED = 400.0
const JUMP_VELOCITY = -1500

@export var camera_min: Node2D
@export var camera_max: Node2D

var interaction = null

var reloading = false
var interaction_jump = 0

func _ready():
	if Status.loop == -1:
		hide()
	$Camera2D.limit_left = camera_min.global_position.x
	$Camera2D.limit_top = camera_min.global_position.y
	$Camera2D.limit_right = camera_max.global_position.x
	$Camera2D.limit_bottom = camera_max.global_position.y
	Status.player = self
	load_hat()
	if Status.level:
		$"CanvasLayer/Counters".texture = load("res://assets/ui2.png")
		$CanvasLayer/Counters/Level.text = str(Status.level) if Status.level < Status.LAST_LEVEL else "NaN"
		if Status.level == 2 and Status.loop == 1:
			Status.interacting = true
			$CanvasLayer/Panel.texture = load('res://panels/end5.png')
			$CanvasLayer/Panel.show()
			$CanvasLayer/Close.show()
	$CanvasLayer/Counters/Bullets.text = str(Status.bullets)+'/5'
	if Status.dead:
		Status.dead = false
		if not Status.in_menu:
			show_starting_text()

func _physics_process(delta):
	if Status.interacting or Status.dead: return
	move_and_slide()
	
	# Add the gravity.
	if not is_on_floor():
		velocity.y = min(2000, velocity.y+2500*delta)
		$AnimationTree['parameters/in_air/transition_request'] = "yes"
	elif $AnimationTree['parameters/in_air/current_state'] == 'yes':
		$AnimationTree['parameters/in_air/transition_request'] = "no"
		$FallSound.play()

	if reloading: return # Disable controls when reloading

	# Handle jump.
	if Input.is_action_just_pressed("jump") and (is_on_floor() or interaction_jump):
		interaction_jump = 0
		$AnimationTree['parameters/jump/request'] = AnimationNodeOneShot.ONE_SHOT_REQUEST_FIRE
	interaction_jump = max(0, interaction_jump-delta)

	var direction = Input.get_axis("left", "right")
	if direction:
		velocity.x = direction * SPEED
		$Sprites.scale.x = 1 if direction > 0 else -1
		$AnimationTree['parameters/is_walking/transition_request'] = 'yes'
	else:
		velocity.x = move_toward(velocity.x, 0, SPEED)
		$AnimationTree['parameters/is_walking/transition_request'] = 'no'
	
	# Interaction with stuff
	if Input.is_action_just_pressed("interact"):
		if not interaction: return
		velocity = Vector2.ZERO
		$AnimationTree['parameters/is_walking/transition_request'] = 'no'
		interaction_jump = 0.2
		if interaction is ReloadBox:
			reloading = true
			$AnimationTree['parameters/reload/request'] = AnimationNodeOneShot.ONE_SHOT_REQUEST_FIRE
			return
		Status.interacting = true
		$OpenSound.play()
		if interaction is GamePanel:
			if not Status.loop: $CanvasLayer/Panel.texture = interaction.panel_texture
			elif Status.level == 2: $CanvasLayer/Panel.texture = load("res://panels/welcome.png")
			$CanvasLayer/Panel.show()
			$CanvasLayer/Close.show()
		elif interaction is Loophole:
			Status.aiming = true
			interaction.camera.make_current()
			$CanvasLayer/Aim.show()
			$CanvasLayer/LoopholeCover.show()
			$CanvasLayer/Close.show()
		elif interaction is Rift:
			$CanvasLayer/AnimationPlayer.play("goto")
		elif interaction is TransitionRift:
			$CanvasLayer/AnimationPlayer.play("goto_scene")
		else:
			interaction.act()

func jump():
	velocity.y = JUMP_VELOCITY

func reload():
	Status.bullets = Status.BULLET_MAX
	$CanvasLayer/Counters/Bullets.text = str(Status.bullets) + '/' + str(Status.BULLET_MAX)
	reloading = false

func die():
	Status.dead = true
	if Status.level == 0 and Status.kills > Status.high_score:
		Status.high_score = Status.kills
	$AnimationTree['parameters/is_dead/transition_request'] = 'yes'

func reset():
	Status.in_menu = true
	Status.interacting = true
	if Status.dialog == 2:
		Status.high_score = min(Status.high_score+100,999999)
	elif Status.dialog == 3:
		Status.high_score = min(Status.high_score+5000,999999)
	elif Status.dialog >= 4:
		Status.high_score = 999999
	Status.level = 0
	Status.dialog = 0
	Status.loop = 0
	Status.hat = 0
	$CanvasLayer/FadeIn.color = Color.BLACK
	Music.stop()
	await get_tree().create_timer(3).timeout
	Music.stream = load("res://sound/title.mp3")
	Music.play()
	get_tree().change_scene_to_file("res://levels/main.tscn")

func goto():
	position = interaction.target_position.global_position
	$Camera2D.limit_left = interaction.camera_min.global_position.x
	$Camera2D.limit_top = interaction.camera_min.global_position.y
	$Camera2D.limit_right = interaction.camera_max.global_position.x
	$Camera2D.limit_bottom = interaction.camera_max.global_position.y

func goto_scene():
	if Status.level:
		Status.level += 1
	Status.interacting = false
	get_tree().change_scene_to_packed(interaction.target_scene)

func free_controls():
	Status.interacting = false

func load_hat():
	$Sprites/Head/Helmet.texture = load("res://hats/"+str(Status.hat)+".png")
	$Sprites/Head/Helmet.position.y -= $Sprites/Head/Helmet.texture.get_height() - 144

func retry():
	Status.bullets = 5 if Status.level != 2 else 4
	Status.interacting = false
	get_tree().reload_current_scene()

func show_starting_text():
	if Status.loop == -1:
		Status.interacting = true
		return
	if not Status.level:
		$CanvasLayer/Panel.texture = load("res://panels/start"+str(Status.dialog+1)+".png")
		Status.dialog += 1
		if Status.dialog == 6: Status.dialog = 1
	else:
		if Status.dialog == 5:
			Status.interacting = false
			return
		$CanvasLayer/Panel.texture = load("res://panels/reset"+str(Status.dialog+1)+".png")
		Status.dialog += 1
	Status.interacting = true
	$OpenSound.play()
	$CanvasLayer/Panel.show()
	$CanvasLayer/Close.show()
