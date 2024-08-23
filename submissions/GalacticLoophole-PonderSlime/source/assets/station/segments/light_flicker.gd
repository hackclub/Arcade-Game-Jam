extends Node3D
var light_flicker_amount = 0
# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	pass
# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	light_flicker_amount = randf_range(0,100)
	#await get_tree().create_timer(10).timeout
	if light_flicker_amount <= 5 or GlobalVars.power_off == true:
		$LightStripLit.set_instance_shader_parameter("shader_parameter/brightness",0)
		$LightStripLit/SpotLight3D.light_energy = 0.1
		$LightStripLit.visible = false
		await get_tree().create_timer(100).timeout
	else:
		$LightStripLit.set_instance_shader_parameter("shader_parameter/brightness",2)
		$LightStripLit/SpotLight3D.light_energy = 2.5
		$LightStripLit.visible = true
		await get_tree().create_timer(150).timeout
	
