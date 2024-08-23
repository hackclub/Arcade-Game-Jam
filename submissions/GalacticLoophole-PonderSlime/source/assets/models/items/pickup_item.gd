extends Node3D


# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	pass



# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	pass
func pickup():
	if GlobalVars.cans_count > 2:
		GlobalVars.cans_count = 2
	elif GlobalVars.cans_count < 2:
		GlobalVars.cans_count += 1
		queue_free()
