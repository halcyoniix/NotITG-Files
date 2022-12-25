#version 120

#define PI 3.14159265
#define LEVELS 85.0
#define CHAR_SIZE vec2( 6.0, 10.0 )
#define TABLE_RESO vec2( 512.0, 16.0 )

varying vec2 textureCoord;
varying vec2 imageCoord;
varying vec4 color;

uniform float time;

uniform vec2 textureSize;
uniform vec2 imageSize;

uniform vec4 bgColor = vec4( 0.0, 0.0, 0.0, 1.0 );
uniform vec4 fgColor = vec4( 1.0, 1.0, 1.0, 1.0 );
uniform float colorMode = 0.0; // [ 0.0 - 1.0 ]

uniform sampler2D sampler0;
uniform sampler2D samplerAscii;
uniform float ass;

float gray( vec3 rgb ) {
  return rgb.x * 0.299 + rgb.y * 0.587 + rgb.z * 0.114;
}

void main() {
  vec2 coord = gl_FragCoord.xy;
  vec4 tex = texture2D( sampler0, ( ( floor( coord / CHAR_SIZE ) + 0.5 ) * CHAR_SIZE ) / textureSize );
  float g = gray( tex.xyz );
  vec2 uv = (
    vec2( floor( g * LEVELS ) * CHAR_SIZE.x, 0.0 ) +
    mod( coord * vec2( 1.0, -1.0 ), CHAR_SIZE )
  ) / TABLE_RESO;
  float charShape = texture2D( samplerAscii, uv ).x;
  gl_FragColor = vec4( mix(bgColor, mix( fgColor, vec4( floor( normalize( tex.xyz + 0.01 ) * 12.0 ), 1.0 ), colorMode ), charShape)) * color;
}