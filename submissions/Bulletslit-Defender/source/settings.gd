extends Control

func _ready():
	if Status.level == 0: material = null
	$HSlider.value = db_to_linear(AudioServer.get_bus_volume_db(AudioServer.get_bus_index("music")))
	$HSlider2.value = db_to_linear(AudioServer.get_bus_volume_db(AudioServer.get_bus_index("sfx")))



func _on_close_settings_pressed():
	hide()
	


func _on_h_slider_2_value_changed(value):
	AudioServer.set_bus_volume_db(AudioServer.get_bus_index("sfx"), linear_to_db(value))



func _on_h_slider_value_changed(value):
	AudioServer.set_bus_volume_db(AudioServer.get_bus_index("music"), linear_to_db(value))
