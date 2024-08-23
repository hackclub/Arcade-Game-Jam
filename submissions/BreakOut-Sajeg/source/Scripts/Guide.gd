extends Label


func _on_guide_0_area_area_exited(area:Area2D):
	if area.name != "Player":
		return
	get_node("../Guide0").visible = false


func _on_guide_1_area_area_entered(area:Area2D):
	if area.name != "Player":
		return
	get_node("../Guide1").visible = true


func _on_guide_1_area_area_exited(area:Area2D):
	if area.name != "Player":
		return
	get_node("../Guide1").queue_free()


func _on_guide_2_area_area_entered(area:Area2D):
	if area.name != "Player":
		return
	get_node("../Guide2").visible = true


func _on_guide_2_area_area_exited(area:Area2D):
	if area.name != "Player":
		return
	get_node("../Guide2").queue_free()

func _on_guide_0_area_area_entered(area:Area2D):
	if area.name != "Player":
		return

func _on_guide_3_area_area_exited(area:Area2D):
	if area.name != "Player":
		return
	get_node("../Guide3").queue_free()

func _on_guide_3_area_area_entered(area:Area2D):
	if area.name != "Player":
		return
	get_node("../Guide3").visible = true
