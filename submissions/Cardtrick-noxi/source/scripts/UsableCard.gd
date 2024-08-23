class_name UsableCard extends Node2D
signal mouse_entered(card: Card)
signal mouse_exited(card: Card)

@export var action: Node2D
@export var thrown: bool = false # implement this later vv, ThrowDescription only shows when true

# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass

func activate(game_state: Dictionary):
	action.activate(game_state)


func highlight():
	$Card.highlight()
	
func unhighlight():
	$Card.unhighlight()
	
func staged_highlight():
	$Card.staged_highlight($CardImage)



func _on_card_mouse_entered(card: Card):
	mouse_entered.emit(self)


func _on_card_mouse_exited(card: Card):
	mouse_exited.emit(self)


func get_card_name():
	return $Card.CardName

func get_card_cost() -> int:
	return int($Card.CardCost)


func _on_mouse_entered(card):
	pass # Replace with function body.
