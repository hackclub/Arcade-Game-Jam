extends Sprite2D

@onready var LIMIT_N = $"../LoopholeCover/Block1".position.x + $"../LoopholeCover/Block1".size.x
@onready var LIMIT_P = $"../LoopholeCover/Block2".position.x

func _process(delta):
	
	if Status.aiming:
		position = get_viewport().get_mouse_position()
		position.x = clamp(position.x, LIMIT_N, LIMIT_P)
		if Status.level == 0:
			var n = str(Status.kills)
			$"../Counters/Level".text = "0".repeat(6-len(n)) + n

func _input(event):
	if event is InputEventMouseButton and event.pressed and Status.aiming and LIMIT_N < event.position.x and event.position.x < LIMIT_P:
		if Status.bullets > 0:
			$"../AnimationPlayer".play("fire")
			Status.shot = true
			Status.bullets -= 1
			$"../Counters/Bullets".text = str(Status.bullets) + '/' + str(Status.BULLET_MAX)
		else:
			Status.shot = false
