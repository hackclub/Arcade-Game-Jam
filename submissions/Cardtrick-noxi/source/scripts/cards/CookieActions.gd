extends Node2D

func activate(game_state: Dictionary):
	#spend mana/cost
	var caster = game_state.get("caster")
	var index = game_state.get("target_index")
	var targets = game_state.get("targets")
	var action = game_state.get("action") 
	
	if caster.spend_mana(1) == true: # can also implement function to get cost but const is easier
		if action == "play":
			play(caster)
		elif action == "throw":
			throw(caster)
		elif action == "rip": # rip combines both effects
			play(caster) 
			throw(caster)
	
		else:
			print("INVALID action passed (??)!!!")
			return(null)
		

func play(caster):
	caster.change_attack(2)
	
func throw(caster):
	if caster.damage_change >= 0:
		caster.change_attack(caster.damage_change * 2)
