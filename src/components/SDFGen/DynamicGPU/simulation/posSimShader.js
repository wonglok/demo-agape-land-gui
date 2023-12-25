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
#define M_PI_3_1415 3.1415926535897932384626433832795

float atan2(in float y, in float x) {
  bool xgty = (abs(x) > abs(y));
  return mix(M_PI_3_1415 / 2.0 - atan(x,y), atan(y,x), float(xgty));
}

vec3 fromBall(float r, float az, float el) {
  return vec3(
    r * cos(el) * cos(az),
    r * cos(el) * sin(az),
    r * sin(el)
  );
}
void toBall(vec3 pos, out float az, out float el) {
  az = atan2(pos.y, pos.x);
  el = atan2(pos.z, sqrt(pos.x * pos.x + pos.y * pos.y));
}

// float az = 0.0;
// float el = 0.0;
// vec3 noiser = vec3(lastVel);
// toBall(noiser, az, el);
// lastVel.xyz = fromBall(1.0, az, el);

vec3 ballify (vec3 pos, float r) {
  float az = atan2(pos.y, pos.x);
  float el = atan2(pos.z, sqrt(pos.x * pos.x + pos.y * pos.y));
  return vec3(
    r * cos(el) * cos(az),
    r * cos(el) * sin(az),
    r * sin(el)
  );
}

void main (void) {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec4 acc = texture2D( accSim, uv );
  vec4 pos = texture2D( posSim, uv );
  vec4 vel = texture2D( velSim, uv );

  if (acc.g == 0.0) {
    pos.x = (rand(uv + 0.1) * 2.0 - 1.0) * 1.0;
    pos.y = (rand(uv + 0.2) * 2.0 - 1.0) * 1.0;
    pos.z = (rand(uv + 0.3) * 2.0 - 1.0) * 1.0;

    pos.x += 5.0;
    pos.y += 15.0;
    pos.z += -10.0;
  } else {
    pos.xyz += vel.rgb * dt;
  }

  gl_FragColor = pos;
}
`
