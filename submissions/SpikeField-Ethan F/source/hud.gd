extends CanvasLayer
var game_over = false
signal game_start
# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	pass # Replace with function body.

func show_message(text, want_timer: bool):
	$Message.text = text
	$Message.show()
	if want_timer:
		$MessageTimer.start()

func show_game_over():
	game_over = true
	show_message("Game Over", true)
	
	await $MessageTimer.timeout

	show_message("SpikeField", false)
	$Message.show()
	$Credits.show()
	await get_tree().create_timer(1.0).timeout
	$StartButton.show()
	$QuitButton.show()

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	pass


func _on_start_button_pressed() -> void:
	game_start.emit()
	$StartButton.hide()
	$QuitButton.hide()
	$Credits.hide()
	game_over = false

func _on_message_timer_timeout() -> void:
	$Message.hide()
	if not game_over:
		Global.is_game_started = true


func _on_quit_button_pressed() -> void:
	get_tree().quit()
