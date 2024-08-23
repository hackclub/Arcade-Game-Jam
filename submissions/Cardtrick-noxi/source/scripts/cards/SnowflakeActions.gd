extends Node2D
 #this is blizzard
func activate(game_state: Dictionary):
	#spend mana/cost
	var caster = game_state.get("caster")
	var targets = game_state.get("targets")
	var action = game_state.get("action") 
	
	if caster.spend_mana(3) == true: 
		caster.play_sound("res://sounds/blizzard.mp3", 1)
		if action == "play":
			play(caster, targets)
		elif action == "throw":
			throw(caster, targets)
		elif action == "rip": # rip combines both effects
			play(caster, targets)

		else:
			print("INVALID action passed (??)!!!")
			return(null)
		
		

func play(caster, targets):
	for target in targets:
		target.take_damage(5 + caster.damage_change)
		await caster.wait(0.05)

func throw(caster, targets):
	for target in targets:
		if target.bleeding != true:
			target.bleeding = true
			target.bleed(3, 5)
		else:
			target.saved_turns += 5 # just extend otherwise.
			await caster.wait(0.1)
			
