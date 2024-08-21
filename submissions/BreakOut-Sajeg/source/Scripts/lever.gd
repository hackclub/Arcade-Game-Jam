extends StaticBody2D


func _ready():
	set_state(vars.spikes)

func set_state(state):
	if state:
		$LeverUp.visible = true
		$LeverDown.visible = false
	else:
		$LeverUp.visible = false
		$LeverDown.visible = true
