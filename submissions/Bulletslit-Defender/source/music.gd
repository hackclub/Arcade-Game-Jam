extends AudioStreamPlayer

var transition_to
var enabled = true

func _ready():
	bus = &"music"
	if Status.loop == -1: enabled = false
	if Status.level > 0:
		stream = load("res://sound/winds.mp3")
	else:
		stream = load("res://sound/title.mp3")
	playing = enabled

func transition_start(to):
	transition_to = to
	var tween = get_tree().create_tween()
	tween.tween_property(self, "volume_db", -40, 1.1)
	tween.tween_callback(set_music_to_game)

func set_music_to_game():
	if transition_to == "game" and Status.level:
		transition_to = "winds"
	self['parameters/looping'] = not (transition_to == "gameover" and Status.level==0)
	stream = load("res://sound/"+transition_to+".mp3")
	volume_db = 0
	playing = enabled

func start_winds():
	stream = load("res://sound/winds.mp3")
	playing = enabled

func set_enabled(b):
	enabled = b and Status.loop != -1
	if not b:
		stop()
	else:
		play()
