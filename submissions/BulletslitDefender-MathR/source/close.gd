extends TextureButton

func _process(_delta):
	if visible and Input.is_action_just_pressed("cancel"):
		_on_pressed()

func _on_pressed():
	$"../CloseSound".play()
	$"../Panel".hide()
	$"../LoopholeCover".hide()
	$"../../Camera2D".make_current()
	$"../Aim".hide()
	Status.aiming = false
	Status.interacting = false
	hide()
