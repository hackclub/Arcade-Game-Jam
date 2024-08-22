extends Object

var id: int
var history = []

func _init(wizard_id: int, past_history):
	self.id = wizard_id
	self.history = past_history
