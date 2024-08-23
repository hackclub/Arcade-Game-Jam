extends Node2D

func _ready():
	if Status.checkpoint:
		$Player.position = $R3/RPOS.global_position
		var cam = $Player.get_node("Camera2D")
		cam.limit_left = $R3/CMIN.global_position.x
		cam.limit_top = $R3/CMIN.global_position.y
		cam.limit_right = $R3/CMAX.global_position.x
		cam.limit_bottom = $R3/CMAX.global_position.y

func _process(delta):
	if $Player.position.x > 1500:
		Status.checkpoint = true
