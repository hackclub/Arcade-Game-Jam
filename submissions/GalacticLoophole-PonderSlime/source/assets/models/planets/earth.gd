extends Node3D

func _physics_process(delta: float) -> void:
	$Planet.rotation_degrees.y -= 0.002777777777777777778 #0.0001851851851851851852
