extends CharacterBody2D

@export var id: int

func _ready():
	$AnimationPlayer.play("idle")
	for history in vars.wizard_history:
		if history.id == id:
			$AIManager.history = history.history
