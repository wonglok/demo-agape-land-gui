export const vertexRender = `

varying vec2 v_uv;

uniform highp sampler2D posSim;

uniform float pt;

attribute vec2 uvlookup;

vec3 opTwist( in vec3 p, in float k )
{
    float c = cos(k*p.y);
    float s = sin(k*p.y);
    mat2  m = mat2(c,-s,s,c);
    vec3  q = vec3(m*p.xz,p.y);
    return (q);
}


void main (void) {

  v_uv = uvlookup;

  vec4 myPos = texture2D( posSim, uvlookup ) + vec4(position, 0.0);

  gl_Position = projectionMatrix * modelViewMatrix * myPos;
}

`