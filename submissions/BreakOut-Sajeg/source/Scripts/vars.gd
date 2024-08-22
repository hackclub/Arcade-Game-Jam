extends Node

var available_loot = [
	"cans", "potato", "shoe", "bread", "iron", "bones", "dead rat", "gold"
]

# For Debug purpose I have many Keys
#var inventory = ["Key","Key","Key","Key","Key","Key","Key","Key","Key","Key","Key","Key","Key","Key","Key"]
var inventory = []

var looted = []

var last_position = []

var wizard_history = []

var opened = []

var spikes = true

var animation_played = false

var destroyed_crate = false

var played_voice_1 = false

var played_voice_2 = false

var played_voice_3 = false