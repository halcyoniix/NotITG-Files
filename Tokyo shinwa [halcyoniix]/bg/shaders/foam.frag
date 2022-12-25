// https://www.shadertoy.com/view/llcXW7
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

// Made by k-mouse (2016-11-23)
// Modified from David Hoskins (2013-07-07) and joltz0r (2013-07-04)

#define TAU 6.28318530718

#define TILING_FACTOR 1.0
#define MAX_ITER 8

float waterHighlight(vec2 p, float iTime, float foaminess)
{
    vec2 i = vec2(p);
  float c = 0.0;
    float foaminess_factor = mix(1.0, 6.0, foaminess);
  float inten = .005 * foaminess_factor;

  for (int n = 0; n < MAX_ITER; n++) 
  {
    float t = iTime * (1.0 - (3.5 / float(n+1)));
    i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
    c += 1.0/length(vec2(p.x / (sin(i.x+t)),p.y / (cos(i.y+t))));
  }
  c = 0.2 + c / (inten * float(MAX_ITER));
  c = 1.17-pow(c, 1.4);
    c = pow(abs(c), 8.0);
  return c / sqrt(foaminess_factor);
}


void mainImage( out vec4 fragColor, in vec2 fragCoord ) 
{
  float iTime = time * 0.24;
  vec2 uv = fragCoord.xy / imageSize.xy;
  vec2 uv_square = vec2(uv.x * resolution.x / resolution.y, uv.y);
    float dist_center = pow(1.0*length(uv - 0.5), 2.0);
    
    float foaminess = smoothstep(0.0, 1.8, dist_center);
    float clearness = 0.1 + 0.9*smoothstep(0.0, 0.5, dist_center);
    
  vec2 p = mod(uv_square*TAU*TILING_FACTOR, TAU)-250.0;
    
    float c = waterHighlight(p, iTime, foaminess);
    
    vec3 water_color = vec3(0.0, 0.0, 0.0);
  vec3 final = vec3(c);
    final = clamp(final + water_color, 0.0, 1.0);
    
    final = mix(water_color, final, clearness);

  fragColor = vec4(final, color.a);
}

void main()
{
	mainImage(gl_FragColor.rgba, gl_FragCoord.xy);
}
