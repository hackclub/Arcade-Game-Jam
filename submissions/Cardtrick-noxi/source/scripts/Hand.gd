@tool
class_name Hand extends Node2D 

signal card_activated(card: UsableCard, action: String)
signal hide_deck_view()

@export var hand_radius: int = 1
@export var card_angle: float = -90
@export var angle_limit: float = 75 #25
@export var max_card_spread_angle: float = 180 # 5

@onready var test_card = $test_card #test
@onready var collision_shape: CollisionShape2D = $DebugShape

@onready var timer = $Timer

var hand: Array = []
var discard_pile: Array = []
var recoverable_thrown_cards: Array = []
var touched: Array = []
var current_seleted_card_index: int = -1

var card_staged = false
var staged_index: int = -1 # USE THis to get it, the staged card stays in hand[]

var initial_scale = Vector2(1, 1) 
var target_scale = Vector2(1.2, 1.2) 
var scale_speed = 17.65 
var raised_z_index = 99  

func add_card(card: Node2D):
	var dupe = card.duplicate()
	hand.push_back(dupe)
	add_child(dupe)
	dupe.mouse_entered.connect(_handle_card_touched)
	dupe.mouse_exited.connect(_handle_card_untouched)
	reposition_cards()
	if $StagedLabel.visible == true:
		$StagedLabel.hide()

func remove_card(index: int) -> Node2D:
	var removing_card = hand[index]
	remove_child(removing_card)
	hand.remove_at(index)
	$"..".deck.remove_card(index)
	# if touched.size() > 0:#not needed for staging
		#touched.remove_at(touched.find(removing_card)) #not needed for staging only right out of hand

	unstage_cards()

	return removing_card # removed from data but returned

func discard(index):
	var discarding_card = hand[index]
	discard_pile.push_back(discarding_card)
	discarding_card.hide()
	hand.remove_at(index)
	unstage_cards()
	
func undiscard():
	for card in discard_pile:
		card.show()
		hand.push_back(card)
	discard_pile.clear()
	reposition_cards()

func stage_card(index):
	make_NEM_invisible()
	hide_deck_view.emit()

	var card = hand[index]
	staged_index = index
	card.position.y -= 500
	card.position.x = 0
	card.set_rotation((0))
	card_staged = true
	$StagedLabel.visible = true
	
func unstage_cards():
	$StagedLabel.visible = false
	reposition_cards()
	card_staged = false
	staged_index = -1
	

func reposition_cards():
	var card_spread = min(angle_limit / hand.size(), max_card_spread_angle)
	var current_angle = -(card_spread * (hand.size() - 1))/2 - 90
	card_staged = false
	for card in hand :
		_update_card_transform(card, current_angle)
		current_angle += card_spread
		
		


func get_card_position(angle_in_deg: float) -> Vector2:
	var x: float = hand_radius * cos(deg_to_rad(angle_in_deg))
	var y: float = hand_radius * sin(deg_to_rad(angle_in_deg))
	
	return Vector2(int(x), int(y))
	
func _update_card_transform(card: Node2D, angle_in_drag: float):
	card.set_position(get_card_position(angle_in_drag))
	card.set_rotation(deg_to_rad(angle_in_drag+90))
	

func _handle_card_touched(card):
	touched.push_back(card)

func _handle_card_untouched(card):
	touched.remove_at(touched.find(card))

	
# Called when the node enters the scene tree for the first time.
func _ready():
	$StagedLabel.visible = false
	timer.connect("timeout", Callable(self, "_on_Timer_timeout")) 

func _input(event):
	if event.is_action_pressed("mouse_click") and current_seleted_card_index >= 0:
		# var card = remove_card(current_seleted_card_index)
		if card_staged == false:
			stage_card(current_seleted_card_index)
		elif current_seleted_card_index == staged_index:
			unstage_cards()
		else: 
			unstage_cards()
			stage_card(current_seleted_card_index)
	if card_staged == true and staged_index >= 0: # handle playing of the card
	#!! remove_card just returns hand[index] passed in
	
		if event.is_action_pressed("keypress_j"): #play J
			card_ability("play")
		if event.is_action_pressed("keypress_k"): #throw K
			card_ability("throw")
		#if event.is_action_pressed("keypress_l"): #rip L
			#card_ability("rip")
			
			
		# card.queue_free() # remove from memory after scaling scale
		current_seleted_card_index = -1

func card_ability(action):
	var card = hand[staged_index]
	var card_name = card.get_card_name()
	var card_cost = card.get_card_cost()
	
	card_activated.emit(staged_index, card, card_cost, action)

	print("used " + action + " on " + card_name)
	
# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	for card in hand:
		current_seleted_card_index = -1
		card.unhighlight()
		card.scale = scale.lerp(initial_scale, scale_speed * delta)
		card.z_index = 0 # DEFAULTZINDEX can change
	if card_staged == true:
		hand[staged_index].staged_highlight()

	
	if !touched.is_empty():
		
		var highest_touched_index = -1
		
		for touched_card in touched:
			highest_touched_index = max(highest_touched_index, hand.find(touched_card))
			
		if highest_touched_index >= 0 and highest_touched_index < hand.size():
			var hhti = hand[highest_touched_index]
			hhti.highlight()
			hhti.scale = scale.lerp(target_scale, scale_speed * delta)
			hhti.z_index = raised_z_index
			current_seleted_card_index = highest_touched_index
	
	
	collision_shape = $DebugShape
	# tool logic
	if (collision_shape.shape as CircleShape2D).radius != hand_radius:
		(collision_shape.shape as CircleShape2D).set_radius(hand_radius)
	
	test_card.set_position(get_card_position(card_angle))
	test_card.set_rotation(deg_to_rad(card_angle + 90))


func show_NEM():
	var label = $NotEnoughManaLabel
	label.visible = true
	
	timer.start()



func _on_timer_timeout():
	make_NEM_invisible()
	
func make_NEM_invisible(): # idk if i cando the signal from others os just easier
	var label = $NotEnoughManaLabel
	if label.visible == true:
		label.visible = false
