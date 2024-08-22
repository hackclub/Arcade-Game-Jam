extends Node2D
@export var spikeScene : PackedScene
#@export var enemyScene : PackedScene
@onready var spike_spawn_location = $SpikePath/SpikeLocation
# Called when the node enters the scene tree for the first time.

func _ready():
	$MainTheme.play(46.00)


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	#print(Global.is_game_started)
	
	Global.playerPos = $Player.position
	$HUD/ScoreLabel.text = str("score: ", Global.score)
	$HUD/HighscoreLabel.text = str("HIGHSCORE: ", Global.high_score)
	Global.enterPos = $enterPipe.position
	if Global.laserHit:
		$LaserHit.play()
		Global.laserHit = false
	if Global.laser_hit_player:
		game_over()
		Global.laser_hit_player = false
	#if Global.need_reset == true:
		#game_over()
		#Global.need_reset = false

func game_over():
	if Global.high_score < Global.score:
		Global.high_score = Global.score
	$HUD.show_game_over()
	$Player.position = Global.enterPos
	$Player/DieNoise.play()
	Global.is_game_started = false

func _on_exit_pipe_body_entered(body):
	if body.is_in_group("player"):
		Global.score += 1 
		$Player.position = Global.enterPos
		if Global.score >= 1:
			var s = spikeScene.instantiate()
		
			spike_spawn_location = $SpikePath/SpikeLocation
			spike_spawn_location.progress_ratio = randf()
			
			s.position = spike_spawn_location.position
			get_parent().call_deferred("add_child", s)
			#add_child(s)
			
			
			
			#var e = enemyScene.instantiate()
			##var enemy_spawn_location = $EnemyPath/EnemyLocation
			#enemy_spawn_location.progress_ratio = randf()
			#e.position = enemy_spawn_location.position
			#get_node("EnemyPath").call_deferred("add_child", e)
		





func new_game() -> void:
	Global.score = 0
	$HUD.show_message("Get Ready", true)
	get_tree().call_group("spikes", "queue_free")


func _on_player_died() -> void:
	game_over()


func _on_main_theme_finished() -> void:
	$MainTheme.play()
