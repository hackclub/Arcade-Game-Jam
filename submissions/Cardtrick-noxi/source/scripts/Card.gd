@tool
class_name Card 
extends Node2D
signal mouse_entered(card: Card)
signal mouse_exited(card: Card)

@export var CardName: String
@export var PlayDescription: String
@export var ThrowDescription: String
@export var CardCost: int
@export var CardImage: Sprite2D

var card_staged = false
var sgshiftred: float = 0.8
@onready var stored_image = $CardImage/CardImageSprite
var dir = "down"
var shift_interval := 0.0125 # this is for color
var movement_translate_interval := 0.2 # y shift



@export var Thrown: bool = false # implement this later vv, ThrowDescription only shows when true

@onready var CostLabel: Label = $CostDisplay/CostLabel
@onready var NameLabel: Label = $CardName/NameLabel 
@onready var PlayDescLabel: Label = $PlayDescription
@onready var ThrowDescLabel: Label = $ThrowDescription
@onready var BaseSprite: Sprite2D = $BaseCard

var thrown_cards_descs: Array = [] #populate wiht thrown ones


func _ready():
	set_card_values(CardCost, CardName, PlayDescription, ThrowDescription)


func set_card_values(_cost: int, _name: String, _play_desc: String, _throw_desc: String):
	CardCost = _cost
	CardName = _name
	PlayDescription = _play_desc
	ThrowDescription = _throw_desc
	
	_update_graphics()
	

func _update_graphics():
	
	if CostLabel.get_text() != str(CardCost):
		CostLabel.set_text(str(CardCost))
	if NameLabel.get_text() != CardName:
		NameLabel.set_text(CardName)
	if PlayDescLabel.get_text() != PlayDescription:
		PlayDescLabel.set_text(PlayDescription)
	if ThrowDescLabel.get_text() != ThrowDescription:
		ThrowDescLabel.set_text(ThrowDescription)
	if card_staged == true:
		BaseSprite.set_modulate(Color(sgshiftred,0.65,0.75,1))
		if dir == "down":
			sgshiftred -= shift_interval
			$".".translate(Vector2(0,movement_translate_interval))
			stored_image.translate(Vector2(0,movement_translate_interval))
		else:
			sgshiftred += shift_interval
			$".".translate(Vector2(0,-1 * movement_translate_interval)) # shift up and down 
			stored_image.translate(Vector2(0,-1 * movement_translate_interval))
				
		if sgshiftred <= 0.2:
			dir = "up"
		if sgshiftred >= 0.8:
			dir = "down"
	else:
		$".".translate(Vector2(0,0)) #put back to default




func activate():
	pass
	
# these have to be called in the cards scripts with the $ notation
func highlight():
	BaseSprite.set_modulate(Color(0.7,0.65,0.75,1))

func unhighlight():
	BaseSprite.set_modulate(Color(1,1,1,1))
	card_staged = false
	
func staged_highlight(img):
	highlight()
	card_staged = true
	stored_image = img



# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta): 
	_update_graphics()


func _on_area_2d_mouse_entered():
	mouse_entered.emit(self)

func _on_area_2d_mouse_exited():
	mouse_exited.emit(self)


func _on_area_2d_input_event(viewport, event, shape_idx):
	if event.is_action_pressed("mouse_click"):

		thrown_cards_descs.push_back(ThrowDescription) # proib nt the best way so change
	
