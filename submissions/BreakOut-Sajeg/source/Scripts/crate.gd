extends StaticBody2D


func destroy():
	$AnimationPlayer.play("break")
	$Effect.play()
	
func set_broken():
	$Crate.visible = false
	$Crate1.visible = false
	$Crate2.visible = true
