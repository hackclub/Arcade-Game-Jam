extends Control

@export var cursor_bottom : ColorRect
@export var cursor_top : ColorRect
@export var cursor_left : ColorRect
@export var cursor_right : ColorRect
@onready var cursor_bottom_def = cursor_bottom.position
@onready var cursor_top_def = cursor_top.position
@onready var cursor_left_def = cursor_left.position
@onready var cursor_right_def = cursor_right.position
# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	if GlobalVars.select:
		cursor_bottom.position.y = lerp(cursor_bottom.position.y, cursor_bottom_def.y + 5, delta * 6)
		cursor_top.position.y = lerp(cursor_top.position.y,cursor_top_def.y - 5, delta * 6)
		cursor_right.position.x = lerp(cursor_right.position.x,cursor_right_def.x + 5, delta * 6)
		cursor_left.position.x = lerp(cursor_left.position.x,cursor_left_def.x - 5, delta * 6)
	else:
		cursor_bottom.position.y = lerp(cursor_bottom.position.y, cursor_bottom_def.y, delta * 6)
		cursor_top.position.y = lerp(cursor_top.position.y,cursor_top_def.y, delta * 6)
		cursor_right.position.x = lerp(cursor_right.position.x,cursor_right_def.x, delta * 6)
		cursor_left.position.x = lerp(cursor_left.position.x,cursor_left_def.x, delta * 6)
