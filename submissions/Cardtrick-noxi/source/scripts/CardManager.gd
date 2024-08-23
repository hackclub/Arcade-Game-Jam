#autoload maybe but this wasnt working
class_name CardManager extends Node

var card_types = {}

func register_card_type(type_id: String):
	if not card_types.has(type_id):
		card_types[type_id] = {
			"thrown": false,
			"cards": []
		}

func register_card(card: Node, type_id: String):
	register_card_type(type_id)
	card_types[type_id]["cards"].append(card)

func throw_card_type(type_id: String):
	if card_types.has(type_id):
		card_types[type_id]["thrown"] = true
		for card in card_types[type_id]["cards"]:
			card.update_throw_description()
