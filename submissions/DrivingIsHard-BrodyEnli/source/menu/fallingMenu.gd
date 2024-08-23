extends Node


var falling: Node = null

# Called when the node enters the scene tree for the first time.
func _ready():
	var children = get_children()
	for child in children:
		var rigid_body = RigidBody3D.new()
		rigid_body.gravity_scale = 0
		rigid_body.visible = false
		
		child.reparent(rigid_body)
		
		add_child(rigid_body)
	
	var timer = Timer.new()
	timer.wait_time = 0.15 # Seconds
	timer.one_shot = false
	timer.autostart = true
	timer.connect("timeout", _object_fall)
	add_sibling.call_deferred(timer)
	
	falling = get_parent().find_child("Falling", false, false)

func _object_fall():
	if !falling:
		return
	
	if randf() > 0.5:
		return
	
	var child: RigidBody3D = get_children().pick_random().duplicate(true)
	child.visible = true
	child.gravity_scale = 6
	child.sleeping = false
	child.position.x = randf_range(-16, 16)
	var object = child.get_child(0);
	object.rotate_object_local(Vector3.UP, randf_range(0, PI * 2))
	object.rotate_object_local(Vector3.LEFT, randf_range(0, PI * 2))
	object.rotate_object_local(Vector3.BACK, randf_range(0, PI * 2))
	
	falling.add_child(child)
	get_tree().create_timer(2.5).connect("timeout", func(): _finish_fall(child))

func _finish_fall(child: RigidBody3D):
	falling.remove_child(child)
	child.queue_free()


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass
