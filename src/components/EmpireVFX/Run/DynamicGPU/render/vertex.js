export const vertexRender = `

varying vec2 v_uv;

uniform highp sampler2D posSim;

uniform float pt;

vec3 opTwist( in vec3 p, in float k )
{
    float c = cos(k*p.y);
    float s = sin(k*p.y);
    mat2  m = mat2(c,-s,s,c);
    vec3  q = vec3(m*p.xz,p.y);
    return (q);
}


void main (void) {

  v_uv = uv;

  vec4 myPos = texture2D( posSim, v_uv );

  gl_PointSize = pt;// * (3.0 - length(myPos.rgb));

  gl_Position = projectionMatrix * modelViewMatrix * myPos;
}

`

// let chladniValue = chladni(this.originalX / width, this.originalY / height, a, b, m, n);

/**

// Chladni equation
function chladni(x, y, a, b, m, n) {
  const pi = 3.1415926535;
  return a * sin(pi * n * x) * sin(pi * m * y) + b * sin(pi * m * x) * sin(pi * n * y);
}


 */
