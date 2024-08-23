shader_type canvas_item;

uniform sampler2D screen_texture : hint_screen_texture, repeat_disable, filter_nearest;

uniform float intensity = 0.0625;
uniform float color = 0.001;
uniform float thinness = 10;
uniform float speed = 15.;

float random( vec2 p )
{
     vec2 K1 = vec2( 23.14069263277926, 2.665144142690225 );
     return 2.*fract(cos(dot(p,K1)) * 12345.6789)-1.; // ver3
}


void vertex() {
}

float loop_around(float v) {
	while (v < 0.0) {
		v += 1.;
	}
	while (v > 1.0) {
		v -= 1.;
	}
	return v;
}

void fragment() {
	vec2 var = UV;
	float time = round(TIME*speed)/speed;
	var.x += random(vec2(time, round(var.y*thinness)/thinness))*intensity;
	var.x = loop_around(var.x);
	COLOR = texture(screen_texture, var);
	if (COLOR.a > 0.0) {
		vec2 r = vec2(time, round(loop_around(var.y*time)*5.)/5.);
		COLOR += vec4(random(r),random(r*2.),random(r*3.),1.)*color;
	}
}