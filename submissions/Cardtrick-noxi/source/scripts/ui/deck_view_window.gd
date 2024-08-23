class_name DeckViewWindow extends ScrollContainer

@onready var card_container_scene: PackedScene = preload("res://scenes/ui/card_container.tscn")

@onready var flow_container = $HFlowContainer

var cached_card_containers: Array[CardContainer] = []


func clear_display():
	for child in flow_container.get_children():
		child.remove_child(child.card)
		flow_container.remove_child(child)


func display_card_list(cardsWithID: Array[CardWithID]):
	clear_display()
	while cached_card_containers.size() < cardsWithID.size():
		cached_card_containers.push_back(card_container_scene.instantiate() as CardContainer)
		
	for i in cardsWithID.size():
		var cardWithID: CardWithID = cardsWithID[i] as CardWithID
		var card_container: CardContainer = cached_card_containers[i]
		card_container.card = (cardWithID as CardWithID).card
		flow_container.add_child(card_container)

