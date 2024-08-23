extends Node


# Called when the node enters the scene tree for the first time.
func _ready():
	var children = get_children()
	
	for child in children:
		if child.name.contains("Bus"):
			continue
		
		var bodyMesh: MeshInstance3D = child.find_child("*Body", true, false)
		var material: StandardMaterial3D = bodyMesh.get_active_material(0)
		var new_material = material.duplicate()
		new_material.albedo_color.h = randf_range(0, 360)
		bodyMesh.set_surface_override_material(0, new_material)


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass
