class_name GameController extends Node2D

var is_running := true 
enum GameState {
	PLAYER_TURN,
	ENEMY_TURN,
	GAMEOVER,
	VICTORY
}

@onready var current_state: GameState = GameState.PLAYER_TURN
 
func pause():
	is_running = false
	
func resume():
	is_running = true

func transition(next_state: GameState):
	#leaving state
	match current_state:
		GameState.PLAYER_TURN:
			pass
		GameState.ENEMY_TURN:
			pass
		GameState.GAMEOVER:
			pass
		GameState.VICTORY:
			pass
			
	current_state = next_state
	
	#entering state
	match current_state:
		GameState.PLAYER_TURN:
			var player_hand = $"../DeckHand/Hand" as Hand
			if player_hand.discard_pile.size() > 0 and player_hand.hand.is_empty():
				player_hand.undiscard()
			#elif player_hand.discard_pile.size() / player_hand.hand.size() >= 4: # use this for a random approach maybe for now its just all cards once you empty hand
				#var random_discarded = player_hand.discard_pile.pick_random()
				#player_hand.add_card(random_discarded, "draw from discard")
		GameState.ENEMY_TURN:
			pass
		GameState.GAMEOVER:
			pass
		GameState.VICTORY:
			pass

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass
