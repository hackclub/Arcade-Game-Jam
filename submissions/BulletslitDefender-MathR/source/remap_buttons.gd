extends Control

var is_remapping = false
var action_to_remap = null
var remapping_button = null


# Called when the node enters the scene tree for the first time.
func _ready():
	_create_action_list()

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass
