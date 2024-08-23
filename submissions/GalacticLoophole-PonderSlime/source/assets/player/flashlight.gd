extends Node3D
var light_flicker_amount = 0
var cam
@onready var parent = get_parent()
func _process(delta: float) -> void:
	light_flicker_amount = randf_range(0,100)
	#await get_tree().create_timer(10).timeout
	if light_flicker_amount <= 5 or GlobalVars.power_off == false:
		visible = false
		await get_tree().create_timer(100).timeout
	elif light_flicker_amount > 5 and GlobalVars.power_off:
		$SpotLight3D.light_energy = 2.5
		visible = true
		await get_tree().create_timer(150).timeout
