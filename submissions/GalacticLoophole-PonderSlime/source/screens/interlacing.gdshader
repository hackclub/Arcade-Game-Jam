
shader_type canvas_item;
uniform float line_thickness : hint_range(1.0, 100.0) = 10.0;
uniform sampler2D delayed_screen : source_color;

void fragment() {
    float screen_y = FRAGCOORD.y;
    int line_number = int(screen_y / line_thickness);
    
    float alpha = mod(float(line_number), 2.0);
    COLOR = texture(delayed_screen, SCREEN_UV);
    COLOR.a *= 1.0 - alpha;
}
