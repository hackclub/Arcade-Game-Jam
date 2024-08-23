shader_type canvas_item;

void vertex() {
	// Called for every vertex the material is visible on.
}

void fragment() {
	if (COLOR != vec4(0,0,0,1) && COLOR.a == 1.) {
		float t = (sin(TIME*8.)+1.)/8.;
		COLOR += vec4(t,t,t,1.);
	}
}

//void light() {
	// Called for every pixel for every light affecting the CanvasItem.
	// Uncomment to replace the default light processing function with this one.
//}
