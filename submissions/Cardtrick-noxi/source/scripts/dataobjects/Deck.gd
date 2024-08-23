class_name Deck extends Resource

var card_collection: Dictionary = {}

var id_counter: int = 0

func add_card(card: UsableCard): # add to deck
	var card_id = _generate_card_id(card)
	card_collection[card_id] = CardWithID.new(card_id, card)
	id_counter += 1

func remove_card(card_id: int): # this ONLY removes from DECK VIEW
	card_collection.erase(card_id)
	var keys = card_collection.keys()
	var cards_above = keys.slice(card_id, keys.size())
	id_counter -= 1
	for id in cards_above:
		id -= 1


func update_card(card_id: int, card: UsableCard):
	card_collection[card_id] = card 

func get_cards() -> Array[CardWithID]:
	var cards: Array[CardWithID] = []
	if !card_collection.is_empty():
		for card in card_collection.values():
			cards.push_back(card as CardWithID)
		return cards 
		
	# ideally it shouldnt be empty, try to limit at 1 card 
	return cards

func _generate_card_id(card: UsableCard):
	return id_counter


func clear_deck(): # for restart
	card_collection = {}
