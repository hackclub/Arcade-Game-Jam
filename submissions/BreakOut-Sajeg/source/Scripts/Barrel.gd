extends StaticBody2D

@export var looted = false
@export var loot_overwrite: String = ""
@export var id: int

func _ready():
	for loot in vars.looted:
		if loot == id:
			looted = true
	
	if looted:
		$Barrel.visible = false
		$Barrel_empty.visible = true
	else:
		$Barrel.visible = true
		$Barrel_empty.visible = false

func toggle_visible(state):
	$Label.visible = state

func can_loot():
	return !looted

func set_looted():
	looted = true
	vars.looted.append(id)
	$Barrel.visible = false
	$Barrel_empty.visible = true
