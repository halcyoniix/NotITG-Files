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



float amount = 0.9;

float random(float x) 
{ 
    return fract(sin(x) * 10000.);          
}

float noise(vec2 p) 
{
    return random(p.x + p.y * 10000.);            
}

vec2 sw(vec2 p) { return vec2(floor(p.x), floor(p.y)); }
vec2 se(vec2 p) { return vec2(ceil(p.x), floor(p.y)); }
vec2 nw(vec2 p) { return vec2(floor(p.x), ceil(p.y)); }
vec2 ne(vec2 p) { return vec2(ceil(p.x), ceil(p.y)); }

float smoothNoise(vec2 p) 
{
    vec2 interp = smoothstep(0., 1., fract(p));
    float s = mix(noise(sw(p)), noise(se(p)), interp.x);
    float n = mix(noise(nw(p)), noise(ne(p)), interp.x);
    return mix(s, n, interp.y);        
}

float fractalNoise(vec2 p) 
{
    float x = 0.;
    x += smoothNoise(p      );
    x += smoothNoise(p * 2. ) / 2.;
    x += smoothNoise(p * 4. ) / 4.;
    x += smoothNoise(p * 8. ) / 8.;
    x += smoothNoise(p * 16.) / 16.;
    x /= 1. + 1./2. + 1./4. + 1./8. + 1./16.;
    return x;            
}

float movingNoise(vec2 p) 
{ 
    float x = fractalNoise(p + time);
    float y = fractalNoise(p - time);
    return fractalNoise(p + vec2(x, y));    
}

float nestedNoise(vec2 p) 
{    
    float x = movingNoise(p);
    float y = movingNoise(p + 100.);
    return movingNoise(p + vec2(x, y));    
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord.xy / imageSize.xy;
    float n = nestedNoise(uv * 6.) * 1.0;
    float offset = mix(0.0, 2.0, amount);
    
    #if NORM_FOCUS
      vec2 offsetVector = normalize(vec2(0.5, 0.5) - uv) * (n * offset);
    #else
      vec2 offsetVector = (vec2(0.5, 0.5) - uv) * (n * offset);
    #endif
    
    fragColor = texture2D(sampler0, img2tex(uv) + offsetVector);
}

void main()
{
	mainImage(gl_FragColor.rgba, gl_FragCoord.xy);
}