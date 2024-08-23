@tool
class_name Character extends Node2D

@export var max_health: int = 15
@export var health: int = 15
@export var shield: int = 0
var mana: int = 3
var current_mana_cap: int = 3
@export var damage_change: int = 0 # positive indicates buff and negative nerfs
@export var bleeding: bool = false
var saved_amount: int = 0 # forbleeding
var saved_turns: int = 0 # forbleeding
@export var is_loophole := false


func spend_mana(amount: int):
	if mana - amount >= 0:
		mana -= amount
		return true
	else:
		return false
		#display some message or error sound

func take_damage(amount: int):
	if amount > 0:
		if shield > 0: # dmg first goes to shield
			shield -= amount
			if shield < 0:
				health += shield # shield will be negative so +
				shield = 0
		else:
			health -= amount
	if self.name == "PlayerCharacter": # player hit sounds based on how much damage taken
		if amount > 0 and amount <= 2: # i considered doing percentages, but its cool as you get stronger ot keep hearing the hard hits
			play_sound("res://sounds/playerhit_light.mp3", 1.5)
		elif amount > 2 and amount < 5:
			play_sound("res://sounds/playerhit_light.mp3", 1.2)
		elif amount >= 5 and amount < 10:
			play_sound("res://sounds/playerhit_medium.mp3", 0.7)
		elif amount >= 10 and amount < 15:
			play_sound("res://sounds/playerhit_hard.mp3", 1)
		elif amount >= 15:
			if amount < max_health / 50:
				play_sound("res://sounds/playerhit_hard.mp3", 0.75)
			elif amount >= max_health / 50: # elif just incase 
				play_sound("res://sounds/playerhit_hard.mp3", 0.5)
	if health <= 0:
		self.hide()
		var possible_enemy_index = $"../..".enemies.find(self)
		if possible_enemy_index >= 0:
			await $"../PlayerCharacter".wait(0.2)
			$"../..".enemies.remove_at(possible_enemy_index)
			$"../..".targeted_enemy_index = 0
		if is_loophole == true: ## LOOPHOLE EFFECT BASED ON LVL
			if posmod($"../..".level, 3) == 0: # first level
				$"../../Animations/Anvil/AnvilAnim".play("AnvilDrop")
				$"../PlayerCharacter".play_sound('res://sounds/armorup.mp3', 1.5)
		
				await $"../PlayerCharacter".wait(0.7)
				$"../PlayerCharacter".play_sound('res://sounds/steel.mp3', 1)
				$"../EnemyCharacter".take_damage(90)
			if posmod($"../..".level, 3) == 1:
				self.show() # fireplace
				$"Healthbar".hide()
				$"EnemySprite".set_texture(get_node("Extinguished").texture)
				$"TrapLabel".set_text("Brrr! Any colder and the ghosts might die...")
				await $"../PlayerCharacter".wait(0.1)
				$"../GhostCharacter1".take_damage(50)
				$"../GhostCharacter2".take_damage(50)
				var ri = $"../..".enemies.find($"../GhostCharacter2")
				$"../..".enemies.remove_at(ri)
				$"../GhostCharacter3/Dialogue".show()
			if posmod($"../..".level, 3) == 2:
				$"EnemySprite".set_texture(get_node("Opened").texture)
				$"../Skeleton".take_damage(9999)
				self.show() # floorboard
				$"Healthbar".hide()
				
				
var bleedcount = 0 #init 
func bleed(amount: int, turns: int):
	if bleedcount == 0:
		saved_amount = amount
		saved_turns = turns
	if bleeding == true:
		bleedcount += 1
		saved_turns -= 1
		take_damage(saved_amount)
		if turns <= 1:
			bleedcount = 0
			bleeding = false
	if health < 0:
			bleeding = false
			bleedcount = 0

func change_shield(amount: int):
	shield += amount

func change_attack(amount: int):
	damage_change += amount # use negatives to debuff




func set_health_values(_health: int, _max_health: int):
	max_health = _max_health
	health = _health
	update_healthbar()
	
func update_healthbar(): # hp bar graphical update only
	if ($Healthbar as ProgressBar).max_value != max_health:
		($Healthbar as ProgressBar).max_value = max_health 
	if ($Healthbar as ProgressBar).value != health:
		($Healthbar as ProgressBar).value = health
	if health < 0:
		health = 0 #(for consistency with visuals)
	($"Healthbar/HealthText").set_text(str(health) + "/" + str(max_health))

func update_shield_icon_values():
	$"Shield".visible = shield > 0 # returns true or false
	$"Shield/ShieldNum".set_text(str(shield))
	$"AttackChange".visible = damage_change != 0
	$Bleeding.visible = bleeding
	if damage_change > 0:
		$"AttackChange/AttackChgNum".set_text("+" + str(damage_change))
	else:
		$"AttackChange/AttackChgNum".set_text(str(damage_change))
	if bleeding == true:
		$Bleeding/BleedingLabel.set_text("-" + str(saved_amount))
		$Bleeding/TurnLabel.set_text(str(saved_turns))
	else:
		$Bleeding/BleedingLabel.set_text("")
		$Bleeding/TurnLabel.set_text("")
		
	
func start_turn():
	if shield > 0: 
		shield -=1 # decay so balanced ig
		
	if damage_change > 0: #decay
		damage_change -= 1
	elif damage_change < 0:
		damage_change += 1
		
	if bleeding == true:
		bleed(saved_amount, saved_turns)
		
	mana = current_mana_cap
	
# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	update_healthbar()
	update_shield_icon_values()
	

func wait(seconds: float) -> void:
	await get_tree().create_timer(seconds).timeout

func play_sound(sound_file, pitch_scale):
	print("played " + sound_file)
	var audio_stream = ResourceLoader.load(sound_file)
	$AudioPlayer.stream = audio_stream
	$AudioPlayer.pitch_scale = pitch_scale
	$AudioPlayer.play()
