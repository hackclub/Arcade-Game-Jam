class_name DeckNHand extends Node2D

signal card_activated(card, action: String)
signal hide_deck_view()
@export var deck: Deck

var scene_paths = {
	"claymore": "res://scenes/cards/claymore.tscn",
	"kiteshield": "res://scenes/cards/shield.tscn",
	"blizzard": "res://scenes/cards/blizzard.tscn",
	"brassknuckle": "res://scenes/cards/brassknuckle.tscn", 
	"healthpotion": "res://scenes/cards/healthpotion.tscn",
	"cookie": "res://scenes/cards/cookie.tscn",
	"sledgehammer": "res://scenes/cards/sledgehammer.tscn"
}
var preloaded_scenes = {}
var instantiated_scenes = {}


func get_card_scene(name: String):
	return instantiated_scenes[name]

# Called when the node enters the scene tree for the first time.
func _ready():
	for key in scene_paths.keys():
		preloaded_scenes[key] = load(scene_paths[key])

	# Instantiate all scenes
	for key in preloaded_scenes.keys():
		instantiated_scenes[key] = preloaded_scenes[key].instantiate()


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass

func add_to_deckview_and_hand(card):
	deck.add_card(card)
	$Hand.add_card(card) # just not so its  draw from discard pile

func clear_deck_view():
	deck.clear_deck()


func _on_button_pressed():
	add_to_deckview_and_hand(get_card_scene("claymore").duplicate()) 



func _on_button_2_pressed():
	add_to_deckview_and_hand(get_card_scene("kiteshield").duplicate())



func _on_hand_card_activated(staged_index, card, card_cost, action): # bring up to Main node
	card_activated.emit(staged_index, card, card_cost, action)


#func _on_remove_button_pressed():
	#if deck.get_cards().is_empty():
	#	return
	
	#var randomcard: CardWithID = deck.get_cards().pick_random()
	#deck.remove_card(randomcard.id)


func _on_hand_hide_deck_view():
	hide_deck_view.emit()

