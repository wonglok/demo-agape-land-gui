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



void main (void) {

  if (length(gl_PointCoord.xy - 0.5) >= 0.5) {
    discard;
  } else {
    vec4 vel = texture2D( velSim, v_uv );
    
    float size = length(vel.rgb);

    // vel.rgb = normalize(vel.rgb);
    gl_FragColor.rgb = size * vec3(
      pal(time * 0.001 * 0.001 + vel.r, color1, color2, color3, color4).r,
      pal(time * 0.001 * 0.001 + vel.g, color1, color2, color3, color4).g,
      pal(time * 0.001 * 0.001 + vel.b, color1, color2, color3, color4).b
    );

    float t = size + 0.1;
    gl_FragColor.rgb = pal(t, color1, color2, color3, color4);

    gl_FragColor.rgb = normalize(vel.rgb * 0.5 + 0.5) + 0.1;
  
    gl_FragColor.a = 0.5;
  }

  
} 

`
