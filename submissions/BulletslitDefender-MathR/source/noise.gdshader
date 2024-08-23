shader_type canvas_item;

uniform bool paused = false;

float random( vec2 p )
{
     vec2 K1 = vec2( 23.14069263277926, 2.665144142690225 );
     return 2.*fract(cos(dot(p,K1)) * 12345.6789)-1.; // ver3
}

void fragment() {
	if (COLOR.b > 0.) {
		float t = random(vec2(random(UV*(paused?522.752757:TIME)),1.1234567896));
		COLOR = vec4(t,t,t,1.0);
	}
}

//void light() {
	// Called for every pixel for every light affecting the CanvasItem.
	// Uncomment to replace the default light processing function with this one.
//}
