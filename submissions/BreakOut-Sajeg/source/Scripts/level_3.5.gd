extends Node2D


func _ready():
	if !vars.destroyed_crate:
		vars.destroyed_crate = true
		$AnimationPlayer.play("destroy1")
	else:
		$crate3.set_broken()

func _on_animation_player_animation_finished(anim_name:StringName):
	if anim_name == "destroy1":
		$crate3.destroy()
		$AnimationPlayer.play("rotate_back")
	elif anim_name == "destroy2":
		$crate2.destroy()
		$AnimationPlayer.play("rotate_back")
		$Player.update_pos()
		$Player/Output.visible = false