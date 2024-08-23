extends Area2D
class_name Interactive

var player_in = false

func _on_body_entered(body):
	if body.name == "Player":
		body.interaction = self


func _on_body_exited(body):
	if body.name == "Player":
		if body.interaction == self:
			body.interaction = null
