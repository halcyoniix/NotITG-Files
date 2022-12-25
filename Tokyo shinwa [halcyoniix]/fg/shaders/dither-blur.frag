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

vec2 img2tex( vec2 v ) { return v / textureSize * imageSize; }

// https://www.shadertoy.com/view/XlVSDV

// More samples => effect becomes more intense (due to more samples taken)
uniform float samplecount;
// Higher sample radius => image becomes less distinct (due to samples being taken at a greater distance from the origin)
uniform float sampleradius = 0.0125;

void mainImage(out vec4 fragColor, in vec2 fragCoord){
	vec2 uv = fragCoord.xy / imageSize.xy;
    vec4 color = texture2D(sampler0, img2tex(uv));
    int samples = 1;
    float offset = fragCoord.x + (fragCoord.y * imageSize.x);
    for(int i = 0; i < samplecount; i++){
        float lerp = float(samplecount) / float(i);
        float angle = offset + lerp;
        float radius = sampleradius * sin(lerp * PI);
        vec2 samplefrom = vec2(uv.x + cos(angle) * radius, uv.y + sin(angle) * radius);
        if(samplefrom.x >= 0.0 && samplefrom.x < 1.0 && samplefrom.y >= 0.0 && samplefrom.y < 1.0){
        	color += texture2D(sampler0, img2tex(samplefrom));
            samples++;
        }
    }
    float div = float(samples);
	fragColor = vec4(color.r / div, color.g / div, color.b / div, 1.0);
}

void main()
{
	mainImage(gl_FragColor.rgba, gl_FragCoord.xy);
}
