shader_type spatial;
render_mode vertex_lighting;
uniform vec4 texture_albedo : source_color = vec4(0.808, 0.659, 0.38, 0.612);
uniform vec3 COLOR_A : source_color = vec3(0.808, 0.659, 0.38);
uniform vec3 COLOR_B : source_color = vec3(0.808, 0.659, 0.38);
uniform float THRESHOLD: hint_range(-1,1) = 0.;
uniform float brightness: hint_range(0,100) = 4;

void fragment() {
	ALBEDO = texture_albedo.rgb * COLOR.rgb * texture_albedo.a * 4.0;
	ALPHA_SCISSOR_THRESHOLD = 0.001;
}
void light() {
	// you can add more colors, or perhaps a texture
	vec3 f = mix(COLOR_A,COLOR_B, step(THRESHOLD, dot(NORMAL, LIGHT))) * brightness;

	// normalize the lighting, by dividing by the number of effective lights, or some other function
	f /= 5.;

	DIFFUSE_LIGHT += f;
}