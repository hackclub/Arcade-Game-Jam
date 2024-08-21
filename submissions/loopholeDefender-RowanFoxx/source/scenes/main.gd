extends Node3D

var arrow_base = preload("res://scenes/weapons/arrow.tscn")
var enemy = preload("res://scenes/enemies/soldier.tscn")
var player_scene = preload("res://scenes/player/player.tscn")

@export var num_enemies = 5

var spawned_enemies = 0
var spawn_index = 0
var prev_spawn_index = 0
var health = 100
var started = false
var score = 1

@onready var enemy_container = $EnemyContainer
@onready var enemy_spawns = $EnemySpawn.get_children()
@onready var enemy_target = $Targets/Marker3D
@onready var round_timer = $RoundEndTimer
@onready var start_camera = $StartCamera
@onready var player_spawn = $PlayerSpawn
@onready var HUD = $HUD
@onready var start_menu = $StartMenu

signal health_updated
signal end_game

func _ready() -> void:
	randomize()
	HUD.visible = false
	start_menu.visible = true
	
func _start_game() -> void:
	# hide start menu
	HUD.visible = true
	start_menu.visible = false
	
	# reset score and HP
	score = 0
	health = 100
	
	#create player and load it
	start_camera.current = false
	var player = player_scene.instantiate()
	add_child(player)
	player.global_position = player_spawn.global_position
	player.get_node("Head/Camera").current = true
	player.spawn_projectile.connect(Callable(_on_player_spawn_projectile))
	
	started = true
	
func _end_game() -> void:
	end_game.emit(score)
	get_tree().call_group("player", "queue_free")
	get_tree().call_group("enemy", "queue_free")
	start_camera.current = true
	HUD.hide()
	start_menu.show()

func _process(_delta: float) -> void:
	if enemy_container.get_child_count() == 0 and spawned_enemies == num_enemies \
	and round_timer.is_stopped() and started:
		round_timer.start()
		
	if health <= 0.0:
		_end_game()

func _on_player_spawn_projectile(location: Marker3D, draw_percentage: float) -> void:
	var arrow = arrow_base.instantiate()
	add_child(arrow)
	arrow.position = location.global_position 
	
	# rotate arrow based on camera position
	arrow.rotation = location.get_parent().global_rotation + Vector3(0.0, 3.141, 3.141)
	arrow.rotation.x = -arrow.rotation.x
	
	arrow.init(draw_percentage)
	

func _on_enemy_spawn_timer_timeout() -> void:
	# if we've spawned all enemies this round, don't spawn more
	if num_enemies == spawned_enemies or not started:
		return
	
	# spawn new enemy at random spawn position
	for i in 5:
		spawn_index = randi() % enemy_spawns.size()
		if prev_spawn_index != spawn_index:
			break
			
	prev_spawn_index = spawn_index
	
	var spawn_pose = enemy_spawns[spawn_index]
	var new_enemy = enemy.instantiate()
	enemy_container.add_child(new_enemy)
	new_enemy.global_position = spawn_pose.global_position
	
	new_enemy.navigation_finished.connect(Callable(_take_damage))
	
	# increment the number of spawned enemies
	spawned_enemies += 1
	new_enemy.set_movement_target(enemy_target.global_position)
	
func _take_damage() -> void:
	health -= 25
	health_updated.emit(health)


func _on_round_end_timer_timeout() -> void:
	if not started:
		return
	# reset for next round
	num_enemies += 1
	spawned_enemies = 0
	score += 1
