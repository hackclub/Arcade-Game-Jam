extends StaticBody2D

@export var next_scene: String = "res://Scenes/main.tscn"
@export var id: int
@export var locked = true

func _ready():
	for open in vars.opened:
		if open == id:
			locked = false
	if !locked:
		$Sprite2D.visible = false

func unlock():
	$Sprite2D.visible = false
	locked = false
	vars.opened.append(id)

func text_visible(state):
	$Label.visible = state

func set_text(text):
	$Label.text = text