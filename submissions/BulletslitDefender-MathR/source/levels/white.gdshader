shader_type canvas_item;


void fragment() {
	COLOR = COLOR.a>=1.0?vec4(1.0,1.0,1.0,1.0):COLOR;
}
