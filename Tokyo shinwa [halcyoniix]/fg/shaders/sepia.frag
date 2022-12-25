varying vec4 color;
varying vec2 textureCoord;
uniform sampler2D sampler0;

float gray( vec3 c ) { return dot(c,vec3(0.298912,0.586611,0.114478)); }

void main()
{
	vec3 col = texture2D( sampler0, textureCoord ).rgb;
	float v = gray( col );

	col.r = v * 0.9;
	col.g = v * 0.7;
	col.b = v * 0.4;

	gl_FragColor = vec4( col, 1.0 ) * color;
}
