extends Node3D

@onready var skeleton = $Armature/Skeleton3D
@onready var animation_player = $AnimationPlayer

func _ready() -> void:
	skeleton.physical_bones_start_simulation()
	animation_player.play("idle")
