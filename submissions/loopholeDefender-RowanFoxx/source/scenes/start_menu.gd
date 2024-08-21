extends CanvasLayer

@onready var title_label = $Title
@onready var score_label = $Score

func _on_main_end_game(score: int) -> void:
	score_label.text = "Score: " + str(score)
	title_label.text = "Game Over"
