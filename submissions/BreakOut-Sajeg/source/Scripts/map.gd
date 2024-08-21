extends TileMap

func _use_tile_data_runtime_update(layer, coords):
	for node in get_node("../").get_children():
		if node is StaticBody2D:
			var node_pos = local_to_map(node.position)
			if  node_pos == coords:
				return true
	if coords in get_used_cells_by_id(2):
		return true
	return false


func _tile_data_runtime_update(layer, coords, tile_data):
	tile_data.set_navigation_polygon(0, null)
