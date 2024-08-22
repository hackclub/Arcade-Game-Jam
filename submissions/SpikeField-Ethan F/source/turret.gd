extends Area2D
@export var laser: PackedScene
var firing = false
# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	if Global.is_game_started:
		look_at(Global.playerPos)


func _on_fire_timer_timeout() -> void:
	if Global.is_game_started:
		var l = laser.instantiate()
		owner.add_child(l)
		l.transform = $FireFrom.global_transform
		$FireTimer.wait_time = randf_range(1, 2)
		firing = false
		$FireNoise.play()
		#$FireTimer.start()
