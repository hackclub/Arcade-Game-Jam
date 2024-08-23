extends Node2D

func activate(game_state: Dictionary):
	#spend mana/cost
	var caster = game_state.get("caster")
	var index = game_state.get("target_index")
	var targets = game_state.get("targets")
	var action = game_state.get("action") 
	
	if caster.spend_mana(3) == true: # can also implement function to get cost but const is easier
		if action == "play":
			play(caster, targets, index)
		elif action == "throw":
			throw(caster, targets, index)
		elif action == "rip": # rip combines both effects
			throw(caster, targets, index) # shield breaks first
			play(caster, targets, index)
	
		else:
			print("INVALID action passed (??)!!!")
			return(null)
		

func play(caster, targets, index):
	for n in 3:
		targets[index].take_damage(2 + caster.damage_change)
		targets[index].change_attack(-1)
		caster.play_sound("res://sounds/punch.mp3", 1)
		await caster.wait(0.3)

func throw(caster, targets, index):
	if targets[index].shield > 0:
		targets[index].shield = 0
		caster.play_sound("res://sounds/punch.mp3", 0.5)
	else:
		caster.play_sound("res://sounds/slip_and_fall.mp3", 1)
		await caster.wait(3)
		caster.take_damage(1)
