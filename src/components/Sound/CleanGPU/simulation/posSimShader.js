export const posSimShader = /* glsl */ `
precision highp float;

uniform float dt;
uniform float time;

#include <common>

mat3 rotateX(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(1, 0, 0),
        vec3(0, c, -s),
        vec3(0, s, c)
    );
}

mat3 rotateY(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(c, 0, s),
        vec3(0, 1, 0),
        vec3(-s, 0, c)
    );
}

mat3 rotateZ(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(c, -s, 0),
        vec3(s, c, 0),
        vec3(0, 0, 1)
    );
}

uniform sampler2D audioTexture;


void main (void) {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec4 acc = texture2D( accSim, uv );
  vec4 pos = texture2D( posSim, uv );
  vec4 vel = texture2D( velSim, uv );

  if (acc.g == 0.0) {
    float maxRange = 0.0;
    float minRange = 0.0;

    for (float i = 0.0; i < 32.0; i++) {
      float pitch = texture2D(audioTexture, vec2(i / 32.0, 0.0)).r;
      maxRange = max(maxRange, pitch);
      minRange = min(minRange, pitch);
    }
    

    pos.x = (rand(uv + 0.1) * 2.0 - 1.0) * (1.0 + maxRange * 10.0);
    pos.y = (rand(uv + 0.2) * 2.0 - 1.0) * 1.0;
    pos.z = (rand(uv + 0.3) * 2.0 - 1.0) * (1.0 + maxRange * 10.0);

    pos.y += 15.0;
  } else {
    pos.xyz += vel.rgb * dt;
  }

  gl_FragColor = pos;
}
`
