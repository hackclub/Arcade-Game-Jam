extends Node

var aiming = false
var level = 0
var high_score = 0
var kills = 0
var bullets = 5
var dialog = 0
var interacting = true
var in_menu = true
var hat = 0
var loop = 0
var dead = false
var shot = false
var checkpoint = false
var player: CharacterBody2D
const BULLET_MAX = 5
const LAST_LEVEL = 8
const HATS_MAX = 9
var is_choosing = false

func _ready():
	#debug_reset()
	get_viewport().physics_object_picking_sort = true
	get_viewport().physics_object_picking_first_only = true
	load_save()
	if Status.level:
		get_tree().change_scene_to_packed.call_deferred(load("res://levels/level"+str(Status.level)+".tscn"))
		if Status.level == 2: Status.bullets = 4

func load_save():
	if not FileAccess.file_exists("user://save.txt"): return
	var file = FileAccess.open("user://save.txt", FileAccess.READ)
	level = int(file.get_line())
	hat = int(file.get_line())
	high_score = int(file.get_line())
	dialog = int(file.get_line())
	loop = int(file.get_line())

func _notification(what):
	if what == NOTIFICATION_WM_CLOSE_REQUEST:
		var file = FileAccess.open("user://save.txt", FileAccess.WRITE)
		if level and dialog == 5: dialog = 4
		if level == LAST_LEVEL: level -= 1
		file.store_string(str(level)+"\n"+str(hat)+"\n"+str(high_score)+"\n"+str(dialog)+"\n"+str(loop))

func debug_reset():
	var file = FileAccess.open("user://save.txt", FileAccess.WRITE)
	file.store_string("0\n0\n0\n0\n0")
