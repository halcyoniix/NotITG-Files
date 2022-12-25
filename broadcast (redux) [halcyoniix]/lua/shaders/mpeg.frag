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

uniform float amount = 0.0;

vec2 img2tex( vec2 v ) { return v / textureSize * imageSize; }

float rng2(vec2 seed)
{
    return fract(sin(dot(seed * floor(time * 24.), vec2(127.1,311.7))) * 43758.5453123);
}

float rng(float seed)
{
    return rng2(vec2(seed, 1.0));
}
//replacing fragCoord with imageCoord * imageSize, and resolution with imageSize will make it work perfectly! -FMS_Cat
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = (imageCoord * imageSize).xy / imageSize.xy;
    vec2 blockS = floor(uv * vec2(24., 9.)) * amount;
    vec2 blockL = floor(uv * vec2(8., 4.)) * amount;
    
    float r = rng2(uv);
    vec3 noise = (vec3(r, 1. - r, r / 2. + 0.5) * 1.0 - 2.0) * 0.08;
    
    float lineNoise = pow(rng2(blockS), 8.0) * pow(rng2(blockL), 3.0) - pow(rng(7.2341), 17.0) * amount;
    
    vec4 col1 = texture2D(sampler0, img2tex(uv));
    vec4 col2 = texture2D(sampler0, img2tex(uv) + vec2(lineNoise * 0.05 * rng(5.0), 0));
    vec4 col3 = texture2D(sampler0, img2tex(uv) - vec2(lineNoise * 0.05 * rng(31.0), 0));
    
	fragColor = vec4(vec3(col1.x, col2.y, col3.z) + noise, 1.0) * color;
}

void main()
{
	mainImage(gl_FragColor.rgba, gl_FragCoord.xy);
}
