import { shaderStructs, shaderDistanceFunction, shaderIntersectFunction } from 'three-mesh-bvh'
export const velSimShader = /* glsl */ `
// precision highp float;

// uniform float dt;
// uniform float time;

// #include <common>

// void main (void) {
//   vec2 uv = gl_FragCoord.xy / resolution.xy;

//   vec4 acc = texture2D( accSim, uv );
//   vec4 vel = texture2D( velSim, uv );

//   vel.xyz += acc.rgb;

//   gl_FragColor = vel;
// }
precision highp float;
precision highp sampler3D;

precision highp isampler2D;
precision highp usampler2D;

${shaderStructs}
${shaderIntersectFunction}
${shaderDistanceFunction}
uniform BVH bvh;

uniform sampler2D audioTexture;
uniform float dt;
uniform float time;

#include <common>
float chladni(float x,float  y, float  a, float  b,  float m, float  n) {
  const float pi = 3.1415926535;
  return a * sin(pi * n * x) * sin(pi * m * y) + b * sin(pi * m * x) * sin(pi * n * y);
}

float chladniLokLokVersion(float x,float  y, float z, float  a, float  b, float c, float m, float  n, float o) {
  const float pi = 3.1415926535;
  return a * sin(pi * n * x) * sin(pi * m * y) * sin(pi * o * z) + b * sin(pi * m * x) * sin(pi * n * y) * sin(pi * o * z) + c * sin(pi * m * x) * sin(pi * n * y) * sin(pi * o * z);
}

float sdSphere( vec3 p, float s ){
  return length(p)-s;
}


float opUnion( float d1, float d2 )
{
    return min(d1,d2);
}
float opSubtraction( float d1, float d2 )
{
    return max(-d1,d2);
}
float opIntersection( float d1, float d2 )
{
    return max(d1,d2);
}
float opXor(float d1, float d2 )
{
    return max(min(d1,d2),-max(d1,d2));
}

float constrain(float val, float min, float max) {
        if (val < min) {
            return min;
        } else if (val > max) {
            return max;
        } else {
            return val;
        }
      }


      vec3 getDiff (in vec3 lastPos, in vec3 mousePos) {
        vec3 diff = lastPos - mousePos;

        float distance = constrain(length(diff), 30.0, 150.0);

        // v is extra speed
        float strength = 3.0 * 1.0 / pow(distance, 2.0);

        diff = normalize(diff);
        diff = diff * pow(strength, 1.0) * -2.0;

        // extra strength
        diff *= 10.0;

        return diff;
      }


      vec3 multiverse (vec3 pp) {
        vec3 p = vec3(pp);
        vec3 v = vec3(0.0);

        // many lines of multiverse
        p.xy *= 10.0;
        p.x += 11.0;
        v.x = cos((max(p.x, p.y) - min(length(p), p.y)));
        v.y = cos(max((p.y - cos(length(p))),p.x)) * cos((p.x - p.x));
        v.xy *= 1.0;

        return v;
      }

      vec3 galaxy (vec3 pp) {
        vec3 p = vec3(pp);
        vec3 v = vec3(0.0);

        // galaxy
        v.x += p.y;
        v.y += sin(sin((min(exp(length(p)),p.y)-p.x)));

        return v;
      }

      vec3 circle (vec3 pp) {
        vec3 p = vec3(pp);
        vec3 v = vec3(0.0);

        // circle
        v.x += -p.y;
        v.z += p.z;

        return v;
      }


      vec3 river (vec3 pp) {
        vec3 p = vec3(pp);
        vec3 v = vec3(0.0);

        // river
        v.x += sin(length(p));
        v.y += cos((length(p)-p.x*p.y));

        return v;
      }


      vec3 squares (vec3 pp) {
        vec3 p = vec3(pp * 2.7);
        vec3 v = vec3(0.0);

        v.x = p.y;
        v.y = p.x/length(p)/max(p.y,sin(length(p)));

        return v;
      }


      vec3 funSwirl (vec3 pp) {
        vec3 p = vec3(pp);
        vec3 v = vec3(0.0);

        p *= 3.5;
        p.y += 1.5;
        p.x *= 2.5;
        v.x += cos(p.x + 2.0 * p.y);
        v.y += sin(p.x - 2.0 * p.y);
        v.xy *= 0.5;

        return v;
      }


      vec3 stoneFlow (vec3 pp) {
        vec3 p = vec3(pp);
        vec3 v = vec3(0.0);

        // flow to a stone
        p *= 2.0 * 2.0 * 3.1415;
        v.x = p.y - length(p);
        v.y = length(p);
        v.xy *= 1.0;

        return v;
      }

      vec3 jade (vec3 pp) {
        vec3 p = vec3(pp);
        vec3 v = vec3(0.0);

        p.xy *= 10.0;
        v.x = sin(min(p.y,length(p)));
        v.y = (sin(p.y)-p.x);
        v.xy *= 1.0;


        return v;
      }

      vec3 converge (vec3 pp) {
        vec3 p = vec3(pp);
        vec3 v = vec3(0.0);

        p.xy *= 2.0;
        p.y += 1.0;
        v.x = length(p);
        v.y = cos(p.y);
        v.xy *= 1.0;

        return v;
      }

      vec3 boxedSwirl (vec3 pp) {
        vec3 p = vec3(pp);
        vec3 v = vec3(0.0);

        p.xyz *= 3.1415 * 2.0 * 1.5;
        v.x = sin(sin(time) + p.y);
        v.y = cos(sin(time) + p.x);
        v.z = cos(sin(time) + p.z);

        v.xyz *= 1.0;

        return v;
      }

      vec3 passWave (vec3 pp) {
        vec3 p = vec3(pp);
        vec3 v = vec3(0.0);

        p.xy *= 2.0 * 3.1415;
        p.x += 4.0;
        v.x = max(sin(p.x),p.x)/p.x;
        v.y = (min(exp(cos(length(p))),sin(p.x))+cos(p.x));

        return v;
      }

      vec3 get_vel (vec3 pp) {
        float timer = mod(time * 0.05, 1.0);
        if (timer < 0.5) {
          return funSwirl(pp) * 0.5;
        } else {
          return funSwirl(pp) * -0.5;
        }
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



float waveSuperPosition(float waveHeight, float waveLength, float waveSpeed, float time, vec3 position) {
  float wavePhase = waveSpeed * time;
  float waveAmplitude = waveHeight / 2.0;
  float waveNumber = 2.0 * 3.14159 / waveLength;

  float waveX = waveNumber * position.x;
  float waveY = waveNumber * position.y;
  float waveZ = waveNumber * position.z;

  float waveHeightX = waveAmplitude * sin(waveX + wavePhase);
  float waveHeightY = waveAmplitude * sin(waveY + wavePhase);
  float waveHeightZ = waveAmplitude * sin(waveZ + wavePhase);

  return waveHeightX + waveHeightY + waveHeightZ;
}
float sdOctahedron( vec3 p, float s)
{
  p = abs(p);
  return (p.x+p.y+p.z-s)*0.57735027;
}


vec3 opRepetition( in vec3 p, in vec3 s )
{
    vec3 q = p - s * round(p/s);
    return q;
}

vec3 opTwist( in vec3 p, in float k )
{
    float c = cos(k*p.y);
    float s = sin(k*p.y);
    mat2  m = mat2(c,-s,s,c);
    vec3  q = vec3(m*p.xz,p.y);
    return (q);
}


float sdSceneSDF ( vec3 pos, float s ) {

  float sdf = 0.0;

  return sdf;
}


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

//------------------------------------------------------------------
// float dot2( in vec2 v ) { return dot(v,v); }
// float dot2( in vec3 v ) { return dot(v,v); }
float ndot( in vec2 a, in vec2 b ) { return a.x*b.x - a.y*b.y; }

vec3 calcNormal( in vec3 p, float s ) {
    const float h = 1e-5; // or some other value
    const vec2 k = vec2(1,-1);
    return normalize( k.xyy * sdSceneSDF( p + k.xyy*h, s ) +
                      k.yyx * sdSceneSDF( p + k.yyx*h, s ) +
                      k.yxy * sdSceneSDF( p + k.yxy*h, s ) +
                      k.xxx * sdSceneSDF( p + k.xxx*h, s ) );
}


vec2 get_velocity(vec2 p) {
  vec2 v = vec2(0., 0.);

  // change this to get a new vector field
  v.x = p.y;
  v.y = (cos(min(p.y*p.x*cos(p.y),cos(p.y)))-sin(length(p)));

  return v;
}

uniform vec3 mouseNow;
uniform vec3 mouseLast;

// holdarea
void collisionMouseSphere (float life, inout vec4 particlePos, inout vec3 particleVel, float sphereRadius) {
  vec3 dif = (mouseNow) - particlePos.xyz;
  if( length( dif ) - sphereRadius < 0.0 ){
    particleVel -= normalize(dif) * dt * 50.0;
    vec3 mouseForce = mouseNow - mouseLast;
    particleVel += mouseForce * dt * 50.0;
  } else if (length( dif ) - sphereRadius < sphereRadius * 0.5) {
    particleVel += normalize(dif) * dt * 50.0;
    vec3 mouseForce = mouseNow - mouseLast;
    particleVel += mouseForce * dt * 50.0;
  }
}


void main (void) {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 acc = texture2D( accSim, uv );
  vec4 pos = texture2D( posSim, uv );
  vec4 vel = texture2D( velSim, uv );

  // compute the point in space to check
  vec3 point = pos.rgb;

  // retrieve the distance and other values
  uvec4 faceIndices;
  vec3 faceNormal;
  vec3 barycoord;
  float side;
  vec3 outPoint;
  float dist = bvhClosestPointToPoint( bvh, point.xyz, faceIndices, faceNormal, barycoord, side, outPoint );

  if (dist <= 5.0 && dist >= 0.01) {
    vel.rgb += faceNormal / dist * 5.0;
  }

  
  if (acc.g == 0.0) {
    vel.x = (rand(uv + 0.1) * 2.0 - 1.0) * 2.0;
    vel.y = 15.0;
    vel.z = 0.5;

    vel.rgb = vel.rgb * rotateY(0.5 * 3.141592);
  }

  vel.y += -0.5;
  vel.z += 0.1 + (sin(time) * 0.5 + 0.5) * 0.1;

  vel.xyz *= 0.97;
  gl_FragColor = vel;
}
`
