extends Node2D

@onready var player_character: Character = $GameScreen/PlayerCharacter
@onready var game_control: GameController = $GameController
@onready var deck_view_overlay: DeckViewWindow = $CanvasLayer/DeckViewWindow as DeckViewWindow
@onready var deck: Deck = Deck.new()

const PLAYER_STARTING_MAX_HP = 25
const LEVEL_LOOPS = 3 #loops until it repeats enemies

var level: int = 0

var n = 1.0 # modualte selected color
var modulate_inc = true

var enemy_character_state: int = 0
var enemies := []
var targeted_enemy_index: int = 1

var ripped_count := 0
var viewing_win := false

var recovered_card = null


var enemy_base_damage: int = 2 # for enemies
var enemy_base_shield: int = 3
var enemy_base_health := 10

# Called when the node enters the scene tree for the first time.
func _ready(): #level 0
	$DeckHand.deck = deck
	set_default_player_deck()
	
	change_enemies(level) # is 0	
	

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	if !game_control.is_running:
		return # stop updates if game paused
	
	$ManaAmount.set_text(str($GameScreen/PlayerCharacter.mana))
	
	if $GameScreen/PlayerCharacter.health <= 0:
		game_control.transition(GameController.GameState.GAMEOVER)
	elif enemies.is_empty():
		game_control.transition(GameController.GameState.VICTORY)
	
	#highlight enemy thats targeted
	if targeted_enemy_index >= 0 and targeted_enemy_index < enemies.size():
		var targeted_enemy = enemies[targeted_enemy_index]
	
		if modulate_inc == true and n < 1.38:
			targeted_enemy.modulate = Color(n,n,n) #n is used for selection display
			targeted_enemy.scale = Vector2(1+n/10,1+n/10)
			n += 0.005
		else:
			modulate_inc = false
			targeted_enemy.modulate = Color(n,n,n)
			targeted_enemy.scale = Vector2(1+n/10,1+n/10)
			n -= 0.0075
			if n < 0.99:
				modulate_inc = true

# enemy attacks
	if game_control.current_state == GameController.GameState.ENEMY_TURN:
		if posmod(level, LEVEL_LOOPS) == 0:
			var enemydamagechange = $GameScreen/EnemyCharacter.damage_change
			if enemy_character_state == 0:
				$GameScreen/EnemyCharacter.change_shield(enemy_base_shield) #Purposely hardcoded
			elif enemy_character_state == 1:
				player_character.take_damage(enemy_base_damage + enemydamagechange)
			elif enemy_character_state == 2:
				player_character.take_damage(2 + enemy_base_damage + enemydamagechange)
		elif posmod(level, LEVEL_LOOPS) == 1: # ghosts
			if enemy_character_state == 0:
				$GameScreen/GhostCharacter3.change_shield(enemy_base_shield)
				$GameScreen/GhostCharacter2.change_shield(enemy_base_shield)
				$GameScreen/GhostCharacter1.change_shield(enemy_base_shield)
			elif enemy_character_state == 1:
				$GameScreen/PlayerCharacter.take_damage(3)
				$GameScreen/GhostCharacter3.change_attack(3)
			elif enemy_character_state == 2:
				player_character.take_damage(enemy_base_damage + $GameScreen/GhostCharacter3.damage_change)
		elif posmod(level, LEVEL_LOOPS) == 2: # reaper skeleton
			if enemy_character_state == 0:
				$GameScreen/Reaper.change_attack(5)
				$GameScreen/Skeleton.change_shield(9)
			elif enemy_character_state == 1:
				$GameScreen/PlayerCharacter.bleeding = true
				$GameScreen/PlayerCharacter.bleed(2,2)
			elif enemy_character_state == 2:
				player_character.take_damage($GameScreen/Reaper.damage_change)
				
		enemy_character_state = posmod(enemy_character_state + 1, 3) # % but +
		game_control.transition(GameController.GameState.PLAYER_TURN)
		$GameScreen/PlayerCharacter.start_turn()
		
	if game_control.current_state == GameController.GameState.VICTORY and viewing_win == false:
		$CanvasLayer/WinOverlay.visible = true
		if posmod(level, LEVEL_LOOPS) == 0:
			$CanvasLayer/WinOverlay/LearnedText.set_text('Unlocked Blizzard!')
		elif posmod(level, LEVEL_LOOPS) == 1:
			$CanvasLayer/WinOverlay/LearnedText.set_text('Unlocked Sledgehammer!')
		elif posmod(level, LEVEL_LOOPS) == 2:
			$CanvasLayer/WinOverlay/LearnedText.set_text('Unlocked Brass Knuckles! You have gone in a circle...')
		
		var recoverable_thrown_cs = ($DeckHand/Hand as Hand).recoverable_thrown_cards
		if !recoverable_thrown_cs.is_empty():
			recovered_card = recoverable_thrown_cs.pick_random()
			$CanvasLayer/WinOverlay/RecoverText.set_text("Recovered: " + recovered_card.get_card_name())
		else:
			$CanvasLayer/WinOverlay/RecoverText.set_text("No Cards Thrown")
		viewing_win = true

	if game_control.current_state == GameController.GameState.GAMEOVER:
		$CanvasLayer/GameOverOverlay.visible = true
		


func _input(event): #change the enemy thats targeted
	if event.is_action_pressed("ui_left") or event.is_action_pressed("ui_up") or event.is_action_pressed("keypress_a") or event.is_action_pressed("keypress_w"):  
		change_target('left')
	elif event.is_action_pressed("ui_right") or event.is_action_pressed("ui_down") or event.is_action_pressed("keypress_d") or event.is_action_pressed("keypress_s"):  
		change_target('right')
	elif event.is_action_pressed("keypress_e"): # end turn
		end_player_turn()
		
		
func _on_deck_hand_card_activated(staged_index, card: UsableCard, card_cost, action: String):
	var hand_node = get_node("DeckHand/Hand")
	if int($ManaAmount.get_text()) - card_cost >= 0 and targeted_enemy_index > -1:
		card.activate({
			"caster": $GameScreen/PlayerCharacter,
			"targets": enemies, 
			"target_index": targeted_enemy_index,
			"card": card,
			"action": action
		})
		if action == "play":
			$DeckHand/Hand.discard(staged_index)
		if action == "throw":
			$DeckHand/Hand.recoverable_thrown_cards.push_back($DeckHand/Hand.hand[staged_index])
			$DeckHand/Hand.remove_card(staged_index)
		if action == "rip":
			$DeckHand/Hand.remove_card(staged_index)
			ripped_count += 1
		hand_node.make_NEM_invisible()
	elif targeted_enemy_index <= -1:
		targeted_enemy_index = 0
	else:
		hand_node.unstage_cards()
		hand_node.show_NEM()
		print("not enough mana")
		




func _on_inflict_1_button_pressed():
	player_character.take_damage(1)


func _on_inflict_3_button_pressed():
	player_character.take_damage(3)



func _on_end_turn_pressed():
	end_player_turn()
	
		
func end_player_turn():
	if game_control.current_state == GameController.GameState.PLAYER_TURN:
		game_control.transition(GameController.GameState.ENEMY_TURN)
		for enemy in enemies:
			enemy.start_turn()
		get_node("DeckHand/Hand").unstage_cards()

func _on_button_pressed(): # restart the game
	game_control.current_state = GameController.GameState.PLAYER_TURN
	
	level = 0
	
	$GameScreen/PlayerCharacter.max_health = PLAYER_STARTING_MAX_HP 
	$GameScreen/PlayerCharacter.health = PLAYER_STARTING_MAX_HP
	$GameScreen/PlayerCharacter.current_mana_cap = 3
	$GameScreen/PlayerCharacter.mana = 3
	$GameScreen/PlayerCharacter.shield = 0
	$GameScreen/PlayerCharacter.damage_change = 0
	$GameScreen/PlayerCharacter.bleeding = false
	
	$CanvasLayer/GameOverOverlay.visible = false
	$GameScreen/PlayerCharacter.show()
	recovered_card = null
	viewing_win = false
	
	targeted_enemy_index = 0 
	
	change_enemies(level) #0
	
	
	enemy_base_damage = 2 # this is init, it increases every win
	enemy_base_shield = 3
	enemy_base_health = 10
	enemies[0].max_health = enemy_base_health + 90 # health is handled here because its the first mushroom
	enemies[0].health = enemy_base_health + 90
	reset_enemy_stats()
	
	# clear deck
	($DeckHand as DeckNHand).clear_deck_view()
	$DeckHand/Hand.hand.clear()
	set_default_player_deck()
	


func reset_enemy_stats(): 
	if enemies.size() > 0:
		for enemy in enemies:
			enemy.shield = 0
			enemy.damage_change = 0
			enemy.bleeding = false
			enemy.show()
	enemy_character_state = 0
	
func set_default_player_deck():
	($DeckHand/Hand as Hand).hand.clear()
	($DeckHand.deck as Deck).clear_deck()
	
	for n in 2:
		($DeckHand as DeckNHand).add_to_deckview_and_hand($DeckHand.get_card_scene("claymore").duplicate())
		($DeckHand as DeckNHand).add_to_deckview_and_hand($DeckHand.get_card_scene("kiteshield").duplicate())
	($DeckHand as DeckNHand).add_to_deckview_and_hand($DeckHand.get_card_scene("healthpotion").duplicate())
	($DeckHand as DeckNHand).add_to_deckview_and_hand($DeckHand.get_card_scene("cookie").duplicate())
	

func _on_deck_button_pressed():
	if deck_view_overlay.visible == false:
		show_deck_view()
	else:
		hide_deck_view()



func _on_deck_hand_hide_deck_view():
	hide_deck_view()

func show_deck_view():
	(game_control as GameController).pause()
	deck_view_overlay.visible = true
	deck_view_overlay.display_card_list(deck.get_cards()) # pass array of list of UsableCard s
	$CanvasLayer/DeckViewBgRect.visible = true
	$DeckHand/Hand.unstage_cards()

func hide_deck_view():
	(game_control as GameController).resume()
	deck_view_overlay.visible = false
	$CanvasLayer/DeckViewBgRect.visible = false
	$DeckHand/Hand.unstage_cards()


func _on_button_v_pressed(): #victory button
	game_control.current_state = GameController.GameState.PLAYER_TURN
	if ($DeckHand/Hand as Hand).recoverable_thrown_cards.is_empty() == false:
		($DeckHand as DeckNHand).add_to_deckview_and_hand(recovered_card)
	
	viewing_win = false
	$CanvasLayer/WinOverlay.visible = false
	$DeckHand/Hand.unstage_cards()
	$DeckHand/Hand.undiscard()
	level += 1
	enemies.clear()
	change_enemies(level)
	player_character.mana = player_character.current_mana_cap
	#increase difficulty
	enemy_base_damage += floor(level)#  it increases every win
	enemy_base_shield += floor(level) # can divide
	
	

	
func change_enemies(level): # this is for transitinoing between lvls
	enemies.clear()
	$GameScreen/EnemyCharacter.hide() #mushroom
	$GameScreen/EnemyCharacter.health = $GameScreen/EnemyCharacter.max_health
	$GameScreen/GhostCharacter2.hide()
	$GameScreen/GhostCharacter2.health = $GameScreen/GhostCharacter2.max_health
	$GameScreen/GhostCharacter1.hide()
	$GameScreen/GhostCharacter1.health = $GameScreen/GhostCharacter1.max_health
	$GameScreen/GhostCharacter3.hide()
	$GameScreen/GhostCharacter3.health = $GameScreen/GhostCharacter3.max_health
	$GameScreen/LoopholeSwitch.hide()
	$GameScreen/LoopholeSwitch.health = 1
	$GameScreen/FireplaceLoophole.hide()
	$GameScreen/FireplaceLoophole.health = 5
	$GameScreen/FireplaceLoophole/EnemySprite.set_texture($GameScreen/FireplaceLoophole/Lit.texture)
	$GameScreen/FireplaceLoophole/Healthbar.show()
	$GameScreen/Skeleton.hide()
	$GameScreen/Skeleton.health = $GameScreen/Skeleton.max_health
	$GameScreen/Reaper.hide()
	$GameScreen/Reaper.health = $GameScreen/Reaper.max_health
	$GameScreen/FloorboardLoophole.hide()
	$GameScreen/FloorboardLoophole.health = 40
	$GameScreen/FloorboardLoophole/EnemySprite.set_texture($GameScreen/FloorboardLoophole/Closed.texture)
	$GameScreen/FloorboardLoophole/Healthbar.show()
	
	if posmod(level, LEVEL_LOOPS) == 0: #mushroom stage anvil
		enemies.push_back($GameScreen/EnemyCharacter)
		enemies.push_back($GameScreen/LoopholeSwitch)
		if level > 1:
			($DeckHand as DeckNHand).add_to_deckview_and_hand($DeckHand.get_card_scene("brassknuckle").duplicate())
	elif posmod(level, LEVEL_LOOPS) == 1: # ghosts fireplace
		enemies.push_back($GameScreen/GhostCharacter1)
		enemies.push_back($GameScreen/GhostCharacter3)
		enemies.push_back($GameScreen/GhostCharacter2)
		enemies.push_back($GameScreen/FireplaceLoophole)
		($DeckHand as DeckNHand).add_to_deckview_and_hand($DeckHand.get_card_scene("blizzard").duplicate())
	elif posmod(level, LEVEL_LOOPS) == 2:
		enemies.push_back($GameScreen/Reaper)
		enemies.push_back($GameScreen/Skeleton)
		enemies.push_back($GameScreen/FloorboardLoophole)
		($DeckHand as DeckNHand).add_to_deckview_and_hand($DeckHand.get_card_scene("sledgehammer").duplicate())
		
		
	reset_enemy_stats() # this shows them
	targeted_enemy_index = 0



func change_target(dir: String): # this is just for changing in the battle
	enemies[targeted_enemy_index].scale = Vector2(1,1)
	n = 1.0
	modulate_inc = true
	
	if dir == 'left': # a, w, <-
		if targeted_enemy_index > 0:
			targeted_enemy_index -= 1
		else: # if its 0, go to top index
			targeted_enemy_index = enemies.size() - 1
	elif dir == 'right': # d, s, ->
		if targeted_enemy_index + 1 < enemies.size():
			targeted_enemy_index += 1
		else: 
			targeted_enemy_index = 0
	
