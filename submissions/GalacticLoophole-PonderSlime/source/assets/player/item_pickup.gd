extends RayCast3D

var collider
# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	if is_colliding():
		collider = get_collider()
		
		if collider.has_meta("interact"):
			GlobalVars.select = true
		else:
			GlobalVars.select = false
		if Input.is_action_just_pressed("pickup") and collider.has_meta("item"):
			var pickup:Node3D = collider.get_node(collider.get_meta("item"))
			pickup.pickup()
	else:
		collider = 0
		GlobalVars.select = false
