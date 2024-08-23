extends Node2D

func activate(game_state: Dictionary):
	#spend mana/cost
	var caster = game_state.get("caster")
	var targets = game_state.get("targets")
	var index = game_state.get("target_index")
	var action = game_state.get("action") 
	
	if caster.spend_mana(2) == true: # can also implement function to get cost but const is easier
	
		if action == "play":
			play(caster)
		elif action == "throw":
			throw(caster, targets, index)
		elif action == "rip": # rip combines both effects
			play(caster)
			throw(caster, targets, index)
		else:
			print("INVALID action passed (??)!!!")
			return(null)
		

func play(caster):
	caster.change_shield(6) # gain 6 shield
	caster.play_sound("res://sounds/armorup.mp3", 1)

func throw(caster, targets, index):
	if caster.shield > 0:
		targets[index].take_damage(12 + caster.damage_change) 
		caster.play_sound("res://sounds/bash.mp3", 0.6)
	else:
		targets[index].take_damage(4 + caster.damage_change) 
		caster.play_sound("res://sounds/bash.mp3", 0.9)
