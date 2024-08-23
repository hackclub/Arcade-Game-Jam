extends Control


func _ready():
	if not Status.in_menu: return
	show()
	if Status.level == 0:
		$TextureRect.material = null
		$Play.show()
		$Left.show()
		$Right.show()
		$Glitched.hide()
		var n = str(Status.high_score)
		$Counters/Level.text = "0".repeat(6-len(n)) + n


func _on_left_pressed():
	$"../HatSound".play()
	Status.hat -= 1
	if Status.hat < 0: Status.hat = Status.HATS_MAX-1
	Status.player.load_hat()


func _on_right_pressed():
	$"../HatSound".play()
	Status.hat = (Status.hat+1)%Status.HATS_MAX
	Status.player.load_hat()

func begin():
	hide()
	Status.in_menu = false
	Status.player.show_starting_text()
