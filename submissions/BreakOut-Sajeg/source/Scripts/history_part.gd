extends Object

var role: String
var content: String

func _init(content: String, role: String = "user"):
	self.role = role
	self.content = content

func is_model() -> bool:
	return role == "model"

func get_formated(inventory, friendship, give):
	var prompt = {
		"message": content,
		"inventory": inventory,
		"friendship": friendship,
		"give": give
	}
	return {"role": role, "parts": [{"text": JSON.stringify(prompt)}]}
