export const fragmentRender = `

varying vec2 v_uv;

uniform highp sampler2D velSim;

vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;

uniform float time;

#include <common>

void main (void) {

  // if (length(gl_PointCoord.xy - 0.5) >= 0.5) {
  //   discard;
  // } else {
  
  //   gl_FragColor.a = 1.0;
  // }

  // gl_FragColor.rgb = vec3(1.0);

  vec4 vel = texture2D( velSim, v_uv );
  gl_FragColor.rgb = normalize(vel.rgb) * 0.5 + 0.5;
  gl_FragColor.a = 1.0;

  
} 

`
