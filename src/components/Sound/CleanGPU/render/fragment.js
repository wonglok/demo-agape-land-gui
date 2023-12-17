export const fragmentRender = `

varying vec2 v_uv;

uniform sampler2D velSim;

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

  if (length(gl_PointCoord.xy - 0.5) >= 0.5) {
    discard;
  } else {
    vec4 vel = texture2D( velSim, v_uv );
    
    float size = length(vel.rgb);

    gl_FragColor.rgb = normalize(vel.rgb * 0.5 + 0.5) * 0.5 + 0.5;
  
    gl_FragColor.a = rand(v_uv + size) * 0.5 + 0.5;
  }

  
} 

`
