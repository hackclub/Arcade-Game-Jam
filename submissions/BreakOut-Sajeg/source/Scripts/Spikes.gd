extends StaticBody2D


# Called when the node enters the scene tree for the first time.
func _ready():
	if vars.spikes:
		$CollisionShape2D.disabled = false
		$Spikes.visible = true
		$SpikesHidden.visible = false
	else:
		$CollisionShape2D.disabled = true
		$Spikes.visible = false
		$SpikesHidden.visible = true
