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
			throw(caster, targets, index)
		elif action == "rip": # rip combines both effects
			play(caster) 
			throw(caster, targets, index)
	
		else:
			print("INVALID action passed (??)!!!")
			return(null)
		

func play(caster):
	caster.health += 5
	caster.play_sound("res://sounds/potion.mp3", 1)
	if caster.health > caster.max_health:
		caster.health = caster.max_health
	
func throw(caster, targets, index):
	targets[index].bleeding = true
	targets[index].bleed(3,2)
	caster.play_sound("res://sounds/playerhit_medium.mp3", 1.5)
