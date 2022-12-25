#version 120

#define PI 3.14159265

// ------

varying vec2 imageCoord;

uniform vec2 textureSize;
uniform vec2 imageSize;

uniform sampler2D sampler0;
uniform sampler2D bayer;

// ------

vec2 img2tex( vec2 v ) { return v / textureSize * imageSize; }

// ------


void main() {
	vec2 uv = gl_FragCoord.xy / imageSize.xy;
	vec4 color = texture2D(sampler0, img2tex(uv));

	vec3 value = color.rgb;
	vec3 oldcolor = value + (value * texture2D(bayer, (mod(imageCoord, 8000.0 ) / 8000.0)).rgb);
	vec3 newcolor = floor(oldcolor);

	gl_FragColor = vec4( newcolor, 1.0 );
}