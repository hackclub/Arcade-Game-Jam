extends Node2D

@export var loophole: Loophole
@onready var enemy_creator = preload("res://enemy_outside.tscn")

var broken = false

func _ready():
	loophole.camera = $Camera2D

func sort_by_z(a, b):
	return a.z < b.z

func only_char(x):
	return x is CharacterBody2D

func _process(_delta):
	if broken: return
	var e = get_children().filter(only_char)
	var breaking_count = 0
	e.sort_custom(sort_by_z)
	for i in e.size():
		move_child(e[i], i+2)
		if e[i].z >= e[i].MAX_Z:
			breaking_count += 1
	if breaking_count >= 2:
		if $BreakTimer.is_stopped(): $BreakTimer.start()
	else:
		$BreakTimer.stop()
	

func _on_spawn_timer_timeout():
	if Status.in_menu: return
	var enemy = enemy_creator.instantiate()
	enemy.position.x = randf_range(-100, 100)
	enemy.position.y = 100
	
	enemy.phase = randf()*100
	enemy.speed = 1.9+(2*randf()-1)/10
	enemy.frequency = randf()
	enemy.amplitude = 1+randf()*20
	$SpawnTimer.wait_time = 15 + randf()*2
	
	add_child(enemy)
	move_child(enemy, 1)


func hit():
	if loophole:
		if Status.player.interaction == loophole and Status.interacting: $HitSound.play()
		loophole.get_node("AnimationPlayer").play('bonk')

func _on_break_timer_timeout():
	$SpawnTimer.stop()
	broken = true
	$BreakSound.play()
	
	var rift = load("res://rift.tscn").instantiate()
	rift.position = loophole.position
	rift.material = loophole.material
	rift.target_position = $Instakill/RPOS
	rift.camera_min = $Instakill/CMIN
	rift.camera_max = $Instakill/CMAX
	loophole.get_parent().add_child(rift)
	loophole.get_parent().move_child(rift, loophole.get_index())
	
	if Status.player.interaction == loophole:
		Status.player.get_node("CanvasLayer/Close")._on_pressed()
	
	var enemy_i = load("res://enemy.tscn")
	var enemy1 = enemy_i.instantiate()
	var enemy2 = enemy_i.instantiate()
	
	enemy1.scale.x = -1
	enemy1.position = loophole.position + Vector2.LEFT*100 + Vector2.DOWN*100
	enemy2.position = loophole.position + Vector2.RIGHT*100 + Vector2.DOWN*100
	loophole.get_parent().add_child(enemy1)
	loophole.get_parent().add_child(enemy2)
	
	loophole.queue_free()
	loophole = null
