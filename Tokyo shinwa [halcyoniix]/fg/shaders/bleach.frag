#version 120
#define PI 3.14159265

varying vec3 position;
varying vec3 normal;
varying vec4 color;
varying vec2 textureCoord;
varying vec2 imageCoord;

uniform float time;
uniform float beat;
uniform vec2 resolution;
uniform vec2 textureSize;
uniform vec2 imageSize;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 perspectiveMatrix;
uniform mat4 textureMatrix;
uniform sampler2D sampler0;
uniform sampler2D sampler1;

float scale = 2.0;
vec4 c = vec4(0.2124,0.7153,0.0722,0.0);

vec4 bleach(vec4 p, vec4 m, vec4 s) 
{
    vec4 a = vec4(1.0);
 	vec4 b = vec4(2.0);
	float l = dot(m,c);
	float x = clamp((l - 0.45) * 10.0, 0.0, 1.0);
	vec4 t = b * m * p;
	vec4 w = a - (b * (a - m) * (a - p));
	vec4 r = mix(t, w, vec4(x) );
	return mix(m, r, s);
}

vec2 img2tex( vec2 v ) { return v / textureSize * imageSize; }
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / imageSize.xy;
	vec4 p = texture2D(sampler0,img2tex(uv));
	vec4 k = vec4(vec3(dot(p,c)),p.a);
	fragColor = bleach(k, p, vec4(scale)*color.a);
}

void main()
{
	mainImage(gl_FragColor.rgba, gl_FragCoord.xy);
}
