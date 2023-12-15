/*
    // Map frequency to Chladni parameters
    let a = map(lowFreqValue, 0, 255, 0, 1);
    let b = map(lowFreqValue, 0, 255, 0, 1);
    let m = round(map(lowFreqValue, 0, 255, 2, 20));
    let n = round(map(lowFreqValue, 0, 255, 2, 20));
*/

export const accSimShader = /* glsl */ `
precision highp float;

uniform sampler2D audioTexture;
uniform float dt;
uniform float time;

#include <common>
float chladni(float x,float  y, float  a, float  b,  float m, float  n) {
  const float pi = 3.1415926535;
  return a * sin(pi * n * x) * sin(pi * m * y) + b * sin(pi * m * x) * sin(pi * n * y);
}

float chladniLokLokVersion(float x,float  y, float  a, float  b,  float m, float  n) {
  const float pi = 3.1415926535;
  return a * cos(pi * n * x) * cos(pi * m * y) + b * cos(pi * m * x) * cos(pi * n * y);
}

float sdSphere( vec3 p, float s ){
  return length(p)-s;
}

float sdSceneSDF ( vec3 p ) {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  float acc = 0.0;
  float nn = 32.0;
  float nt = 1.0;

  float amp = 5.0;

  for (float i = 0.0; i < nn; i++) {
    float pitch = texture2D(audioTexture, vec2(i / nn, 0.0)).r;

    amp *= (1.0 + pitch * 10.0);

    acc += chladni(p.x * (0.1 + pitch), p.y * (0.1 + pitch), 1.0, 1.0, amp, amp);
  }

  return acc;
}

vec3 calcNormal( in vec3 p ) {
    const float h = 1e-5; // or some other value
    const vec2 k = vec2(1,-1);
    return normalize( k.xyy * sdSceneSDF( p + k.xyy*h ) +
                      k.yyx * sdSceneSDF( p + k.yyx*h ) +
                      k.yxy * sdSceneSDF( p + k.yxy*h ) +
                      k.xxx * sdSceneSDF( p + k.xxx*h ) );
}

void main (void) {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 acc = texture2D( accSim, uv );
  // vec4 pos = texture2D( posSim, uv );

  if (acc.g == 0.0) {
    acc.g = 1.0;
  }

  // float maxRange = 0.0;
  // float minRange = 0.1;
  // for (float i = 0.0; i < 32.0; i++) {
  //   float pitch = texture2D(audioTexture, vec2(i / 32.0, 0.0)).r;
  //   maxRange = max(maxRange, pitch);
  //   minRange = min(minRange, pitch);
  // }

  // float pitch = texture2D(audioTexture, vec2(maxRange, 0.0)).r;

  // acc.r += dt * pitch;
  acc.r += dt * rand(uv) * 0.5;

  if (acc.r >= 1.0) {
    acc.r = 0.0 + rand(uv + time);
    acc.g = 0.0;
  }

  gl_FragColor = acc;
}
`
