extends Area2D
signal hit
var speed = 300
# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	look_at(Global.playerPos)


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	position += transform.x * speed * delta


func _on_visible_on_screen_notifier_2d_screen_exited() -> void:
	queue_free()


func _on_body_entered(body: Node2D) -> void:
	Global.laserHit = true
	if body.is_in_group("player"):
		Global.laser_hit_player = true
		queue_free()
	if body.is_in_group("ground"):
		queue_free()
