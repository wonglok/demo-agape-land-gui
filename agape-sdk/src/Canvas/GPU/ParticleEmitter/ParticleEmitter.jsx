import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BufferAttribute,
  Vector2,
  Vector3,
  HalfFloatType,
  FloatType,
  InstancedBufferGeometry,
  InstancedBufferAttribute,
  Mesh,
  DataTexture,
  RGBAFormat,
  DataUtils,
  Color,
  ConeGeometry,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  Clock,
} from 'three'
// import { loadGLTF } from "../world/loadGLTF";
// import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer";
import { CustomGPU } from './CustomGPU'
import { useCore } from './useCore'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'
import { LoaderGLB } from '../../../main.jsx'

export function ParticleEmitter({ node }) {
  return (
    <>
      <SurfaceParticlesEngine
        performanceProfile={node.performanceProfile}
        objectName={node.objectName}
        surfaceEmissionForce={node.surfaceEmissionForce}
        playerAttractionForce={node.playerAttractionForce}
        playerSpinningForce={node.playerSpinningForce}
        playerPropulsionForce={node.playerPropulsionForce}
        shieldRadius={node.shieldRadius}
        unitGLBURL={node.unitGLBURL}
        unitScale={node.unitScale}
      ></SurfaceParticlesEngine>
    </>
  )
}

export function SurfaceParticlesEngine({
  objectName,
  surfaceEmissionForce = 1,
  playerAttractionForce = 1,
  playerSpinningForce = 1,
  playerPropulsionForce = 1,
  performanceProfile,
  shieldRadius,
  unitScale = 0.1,
  unitGLBURL = `/diamond/diamond-geo.glb`,
}) {
  let gl = useThree((r) => r.gl)
  let scene = useThree((r) => r.scene)
  let [surfaceMesh, setMesh] = useState(false)

  useEffect(() => {
    if (!objectName) {
      return
    }
    let tt = setInterval(() => {
      let res = scene.getObjectByName(objectName)
      if (res) {
        clearInterval(tt)
        setMesh(res)
      }
    }, 0)

    return () => {
      clearInterval(tt)
    }
  }, [objectName])

  let [unitGeomtry, setUnitGeomtry] = useState(false)
  return (
    <group>
      {/*  */}
      {/*  */}
      {/*  */}

      <LoaderGLB
        url={unitGLBURL}
        decorate={function decorate({ glb }) {
          let unitGeomtry = false
          glb.scene.traverse((it) => {
            if (it.isMesh) {
              unitGeomtry = it.geometry.clone()
            }
          })

          setUnitGeomtry(unitGeomtry)
        }}
      ></LoaderGLB>

      {surfaceMesh && unitGeomtry && gl && scene && (
        <CoreEngine
          key={'__' + performanceProfile + objectName + 'corenegine'}
          performanceProfile={performanceProfile}
          surfaceMesh={surfaceMesh}
          gl={gl}
          unitGeomtry={unitGeomtry}
          scene={scene}
          unitScale={unitScale}
          //
          shieldRadius={shieldRadius}
          surfaceEmissionForce={surfaceEmissionForce}
          playerAttractionForce={playerAttractionForce}
          playerSpinningForce={playerSpinningForce}
          playerPropulsionForce={playerPropulsionForce}
        ></CoreEngine>
      )}
    </group>
  )
}
function CoreEngine({
  gl,
  scene,
  performanceProfile = 'low',
  surfaceEmissionForce = 1,
  playerAttractionForce = 1,
  playerSpinningForce = 1,
  playerPropulsionForce = 1,
  shieldRadius = 10,
  unitGeomtry,
  surfaceMesh,
  unitScale,
}) {
  let core = useCore()
  let unitScaleRef = useRef(0)

  let surfaceEmissionForceRef = useRef(1)
  let playerAttractionForceRef = useRef(1)
  let playerSpinningForceRef = useRef(1)
  let playerPropulsionForceRef = useRef(1)
  let shieldRadiusRef = useRef(1)

  useFrame(() => {
    if (unitScaleRef) {
      unitScaleRef.current = unitScale
    }
    if (surfaceEmissionForceRef) {
      surfaceEmissionForceRef.current = surfaceEmissionForce
    }
    if (playerAttractionForceRef) {
      playerAttractionForceRef.current = playerAttractionForce
    }
    if (playerSpinningForceRef) {
      playerSpinningForceRef.current = playerSpinningForce
    }
    if (playerPropulsionForceRef) {
      playerPropulsionForceRef.current = playerPropulsionForce
    }
    if (shieldRadiusRef) {
      shieldRadiusRef.current = shieldRadius
    }
  })

  useEffect(() => {
    let size = new Vector2(128, 256)
    if (performanceProfile === 'ultra') {
      size.x = 256
      size.y = 256

      if ('ontouchstart' in window) {
        size.x = 256
        size.y = 256
      }
    }
    if (performanceProfile === 'high') {
      size.x = 256
      size.y = 128

      if ('ontouchstart' in window) {
        size.x = 256
        size.y = 128
      }
    }
    if (performanceProfile === 'middle') {
      size.x = 128
      size.y = 128
      if ('ontouchstart' in window) {
        size.x = 128
        size.y = 64
      }
    }
    if (performanceProfile === 'low') {
      size.x = 64
      size.y = 128
      if ('ontouchstart' in window) {
        size.x = 64
        size.y = 64
      }
    }
    if (!unitGeomtry) {
      return
    }

    let unitGeo = unitGeomtry.clone()

    let ua = window.navigator.userAgent
    let iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i)
    let webkit = !!ua.match(/WebKit/i)
    let iOSSafari = iOS && webkit && !ua.match(/CriOS/i)
    let useHalfFloat = iOSSafari

    //
    let attractorSize = new Vector2(64, 64)

    let sceneDataAlpha = []
    let sceneDataBeta = []
    let totalDataCount = attractorSize.x * attractorSize.y

    for (let idx = 0; idx < totalDataCount; idx++) {
      sceneDataAlpha.push(0, 0, 0, 0)
      sceneDataBeta.push(0, 0, 0, 0)
    }

    let bufferAlpha = !useHalfFloat ? new Float32Array(sceneDataAlpha) : new Uint16Array(sceneDataAlpha)

    let bufferBeta = !useHalfFloat ? new Float32Array(sceneDataBeta) : new Uint16Array(sceneDataBeta)

    let sceneDataTextureAlpha = new DataTexture(
      bufferAlpha,
      attractorSize.x,
      attractorSize.y,
      RGBAFormat,
      !useHalfFloat ? FloatType : HalfFloatType,
    )

    let sceneDataTextureBeta = new DataTexture(
      bufferBeta,
      attractorSize.x,
      attractorSize.y,
      RGBAFormat,
      !useHalfFloat ? FloatType : HalfFloatType,
    )

    let getData = (v) => {
      if (useHalfFloat) {
        return DataUtils.toHalfFloat(v)
      } else {
        return Number(v)
      }
    }

    let sceneObjects = new Map()

    let v3 = new Vector3()
    let syncData = () => {
      sceneObjects.clear()

      scene.traverse((it) => {
        if (it.name === 'player') {
          sceneObjects.set(it.name, it)
        }
        // if (it.name.indexOf("Water") === 0) {
        //   sceneObjects.set(it.name, it);
        // }
      })

      for (let idx = 0; idx < totalDataCount; idx++) {
        sceneDataAlpha[idx * 4 + 0] = 0.0
        sceneDataAlpha[idx * 4 + 1] = 0.0
        sceneDataAlpha[idx * 4 + 2] = 0.0
        sceneDataAlpha[idx * 4 + 3] = 0.0
        //
        sceneDataBeta[idx * 4 + 0] = 0.0
        sceneDataBeta[idx * 4 + 1] = 0.0
        sceneDataBeta[idx * 4 + 2] = 0.0
        sceneDataBeta[idx * 4 + 3] = 0.0
      }

      let entries = sceneObjects.entries()

      let i = 0
      for (let [key, object] of entries) {
        object.getWorldPosition(v3)

        sceneDataTextureAlpha.image.data[i * 4 + 0] = getData(v3.x)
        sceneDataTextureAlpha.image.data[i * 4 + 1] = getData(v3.y)
        sceneDataTextureAlpha.image.data[i * 4 + 2] = getData(v3.z)
        sceneDataTextureAlpha.image.data[i * 4 + 3] = getData(1)

        // 2 ===
        sceneDataTextureBeta.image.data[i * 4 + 0] = getData(2)
        sceneDataTextureBeta.image.data[i * 4 + 1] = getData(0)
        sceneDataTextureBeta.image.data[i * 4 + 2] = getData(0)
        sceneDataTextureBeta.image.data[i * 4 + 3] = getData(1)

        i++

        // console.log(player.position.toArray().join(","));
      }
      // console.log(i);

      sceneDataTextureBeta.needsUpdate = true
      sceneDataTextureAlpha.needsUpdate = true
    }
    core.onLoop(syncData)

    syncData()

    sceneDataTextureAlpha.needsUpdate = true
    sceneDataTextureBeta.needsUpdate = true
    core.onLoop(() => {
      sceneDataTextureAlpha.needsUpdate = true
      sceneDataTextureBeta.needsUpdate = true
    })

    //
    //
    let gpu = new CustomGPU(size.x, size.y, gl)

    if (useHalfFloat) {
      gpu.setDataType(HalfFloatType)
    } else {
      gpu.setDataType(FloatType)
    }

    function accessCoord() {
      let tex = gpu.createTexture()
      let height = tex.image.height
      let width = tex.image.width

      let uv = []
      let i = 0
      let total = width * height
      for (let h = 0; h < height; h++) {
        for (let w = 0; w < width; w++) {
          tex.image.data[i * 4 + 0] = w / width || 0
          tex.image.data[i * 4 + 1] = h / height || 0
          tex.image.data[i * 4 + 2] = i / total
          tex.image.data[i * 4 + 3] = 1

          uv.push(w / width, h / height, i / total, tex.image.data[i * 4 + 3])
          i++
        }
      }

      tex.userData.iSize = 4

      let attr = new BufferAttribute(new Float32Array(uv), 4)
      let iAttr = new InstancedBufferAttribute(new Float32Array(uv), 4)
      return {
        tex,
        attr,
        iAttr,
      }
    }

    function initData({ get }) {
      let tex = gpu.createTexture()
      let height = tex.image.height
      let width = tex.image.width
      let pxAll = width * height
      let i = 0

      for (let px = 0; px < pxAll; px++) {
        let v3 = get({ i, e: px / pxAll })
        tex.image.data[i * 4 + 0] = v3.x
        tex.image.data[i * 4 + 1] = v3.y
        tex.image.data[i * 4 + 2] = v3.z
        tex.image.data[i * 4 + 3] = 0.0

        i++
      }

      tex.needsUpdate = true

      return tex
    }

    let fragment = {
      position: simPos({ attractorSize }),
      velocity: simVel({ attractorSize }),
    }

    //

    let v3t = new Vector3().set(0, 0, 0)
    let iTex = {
      rebornPosition: initData({
        get: ({ i, e }) => {
          return v3t
        },
      }),
      rebornNormal: initData({
        get: ({ i, e }) => {
          return v3t
        },
      }),
      position: initData({
        get: ({ i, e }) => {
          v3t.x = 0
          v3t.y = 0
          v3t.z = 0
          return v3t
        },
      }),
      velocity: initData({
        get: ({ i, e }) => {
          v3t.x = (Math.random() * 2.0 - 1.0) * 0.1
          v3t.y = (Math.random() * 2.0 - 1.0) * 0.1
          v3t.z = (Math.random() * 2.0 - 1.0) * 0.1
          return v3t
        },
      }),
    }

    let delta = { value: 1000 / 60 }
    let time = { value: 0 }
    let clock = new Clock()

    let iCoords = accessCoord()

    let iVar = {
      velocity: gpu.addVariable('iv_velocity', fragment.velocity, iTex.velocity),
      position: gpu.addVariable('iv_position', fragment.position, iTex.position),
    }

    iVar.position.material.delta = delta
    iVar.position.material.time = time
    iVar.velocity.material.delta = delta
    iVar.velocity.material.time = time

    core.onLoop(() => {
      let dt = clock.getDelta()
      delta.value = dt
      time.value += dt
      iVar.position.material.delta = delta
      iVar.position.material.time = time
      iVar.velocity.material.delta = delta
      iVar.velocity.material.time = time
    })

    iVar.velocity.material.uniforms.sceneDataTextureAlpha = {
      value: sceneDataTextureAlpha,
    }
    iVar.velocity.material.uniforms.sceneDataTextureBeta = {
      value: sceneDataTextureBeta,
    }
    iVar.position.material.uniforms.sceneDataTextureAlpha = {
      value: sceneDataTextureAlpha,
    }
    iVar.position.material.uniforms.sceneDataTextureBeta = {
      value: sceneDataTextureBeta,
    }

    //
    iVar.velocity.material.uniforms.rebornPosition = {
      value: iTex.rebornPosition,
    }
    iVar.position.material.uniforms.rebornPosition = {
      value: iTex.rebornPosition,
    }
    //
    iVar.velocity.material.uniforms.rebornNormal = {
      value: iTex.rebornNormal,
    }
    iVar.position.material.uniforms.rebornNormal = {
      value: iTex.rebornNormal,
    }

    core.onLoop(() => {
      iVar.velocity.material.uniforms.surfaceEmissionForce = {
        value: surfaceEmissionForceRef.current,
      }
      iVar.position.material.uniforms.surfaceEmissionForce = {
        value: surfaceEmissionForceRef.current,
      }

      iVar.velocity.material.uniforms.playerAttractionForce = {
        value: playerAttractionForceRef.current,
      }
      iVar.position.material.uniforms.playerAttractionForce = {
        value: playerAttractionForceRef.current,
      }

      iVar.velocity.material.uniforms.playerSpinningForce = {
        value: playerSpinningForceRef.current,
      }
      iVar.position.material.uniforms.playerSpinningForce = {
        value: playerSpinningForceRef.current,
      }

      iVar.velocity.material.uniforms.playerPropulsionForce = {
        value: playerPropulsionForceRef.current,
      }
      iVar.position.material.uniforms.playerPropulsionForce = {
        value: playerPropulsionForceRef.current,
      }

      iVar.velocity.material.uniforms.shieldRadius = {
        value: shieldRadiusRef.current,
      }
      iVar.position.material.uniforms.shieldRadius = {
        value: shieldRadiusRef.current,
      }

      //
    })

    let posData = new Vector3()
    let normalData = new Vector3()
    let samplingSurface = (sampler, tex, tex2) => {
      let height = tex.image.height
      let width = tex.image.width
      let pxAll = width * height
      let i = 0

      for (let px = 0; px < pxAll; px++) {
        //
        i++

        sampler.sample(posData, normalData)

        // sampler
        tex.image.data[i * 4 + 0] = posData.x
        tex.image.data[i * 4 + 1] = posData.y
        tex.image.data[i * 4 + 2] = posData.z
        tex.image.data[i * 4 + 3] = 0

        tex2.image.data[i * 4 + 0] = normalData.x
        tex2.image.data[i * 4 + 1] = normalData.y
        tex2.image.data[i * 4 + 2] = normalData.z
        tex2.image.data[i * 4 + 3] = 0
      }
      tex.needsUpdate = true
      tex2.needsUpdate = true
    }

    surfaceMesh.updateMatrixWorld(true)
    let samplerGEO = surfaceMesh.geometry.clone()
    samplerGEO.applyMatrix4(surfaceMesh.matrixWorld)
    let sampler = new MeshSurfaceSampler(new Mesh(samplerGEO))
    sampler.build()
    samplingSurface(sampler, iTex.rebornPosition, iTex.rebornNormal)

    let syncMode = () => {
      iVar.velocity.material.uniforms.weatherNow = {
        value: 1,
      }
      iVar.position.material.uniforms.weatherNow = {
        value: 1,
      }
    }
    syncMode()
    core.onLoop(syncMode)

    gpu.setVariableDependencies(iVar.position, [iVar.position, iVar.velocity])
    gpu.setVariableDependencies(iVar.velocity, [iVar.velocity, iVar.position])

    let error = gpu.init()
    if (error !== null) {
      console.error(error)
    }

    core.onLoop(() => {
      gpu.compute()
    })

    let geo = new InstancedBufferGeometry()
    // let unitGeo = new ConeGeometry(0.1, 0.1, 3, 1);

    let MY_SCALE = 500
    unitGeo.scale(1 / MY_SCALE, 1 / MY_SCALE, 1 / MY_SCALE)
    geo.copy(unitGeo)

    // geo.copy(new IcosahedronBufferGeometry(0.05, 0.0));

    geo.instanceCount = size.x * size.y

    geo.setAttribute('coords', iCoords.iAttr)

    let renderMaterial = new MeshStandardMaterial({
      color: new Color('#ffffff'),
      flatShading: true,
      roughness: 0.0,
      metalness: 1,
    })

    renderMaterial.onBeforeCompile = (shader, gl) => {
      let sync = () => {
        shader.uniforms.iv_position = shader.uniforms.iv_position || {
          value: null,
        }
        shader.uniforms.iv_velocity = shader.uniforms.iv_velocity || {
          value: null,
        }

        //
        shader.uniforms.iv_position.value = gpu.getCurrentRenderTarget(iVar.position).texture
        shader.uniforms.iv_velocity.value = gpu.getCurrentRenderTarget(iVar.velocity).texture
      }
      sync()
      core.onLoop(sync)

      let syncMode = () => {
        shader.uniforms.weatherNow = {
          value: 1,
        }
        shader.uniforms.weatherNow = {
          value: 1,
        }

        shader.uniforms.unitScale = {
          value: unitScaleRef.current,
        }
      }
      syncMode()
      core.onLoop(syncMode)

      shader.vertexShader = `${shader.vertexShader.replace(
        `void main() {`,
        /* glsl */ `
        attribute vec4 coords;
        uniform sampler2D iv_position;
        uniform sampler2D iv_velocity;

        uniform float weatherNow;
        uniform float unitScale;

        ${getRotation()}

        void main() {`,
      )}`

      shader.defines.MY_SCALE = MY_SCALE.toFixed(1)
      shader.vertexShader = shader.vertexShader.replace(
        `#include <begin_vertex>`,
        /* glsl */ `
        vec4 posData = texture2D(iv_position, coords.xy);
        vec4 velData = texture2D(iv_velocity, coords.xy);

        vec3 geom = position;
        geom.xyz *= rotation3dX(posData.x + velData.x);
        geom.xyz *= rotation3dY(posData.y + velData.y);
        geom.xyz *= rotation3dZ(posData.z + velData.z);

        if (weatherNow == 1.0) {
          geom.xyz *= 1.0;
        } else if (weatherNow == 2.0) {
          geom.xyz *= 1.0;
        } else if (weatherNow == 3.0) {
          geom.xyz *= 1.0;
        }

        vec3 transformed = vec3( geom * MY_SCALE * unitScale + posData.xyz);
      `,
      )
    }

    let pts = new Mesh(geo, renderMaterial)
    pts.castShadow = true
    pts.receiveShadow = true
    pts.frustumCulled = false
    pts.position.x = 0
    pts.position.y = 0
    pts.position.z = 0

    // let scene = await gpi.ready.scene;
    scene.add(pts)

    core.onClean(() => {
      pts.removeFromParent()
    })
  }, [unitGeomtry])
  return <></>
}

function simPos({ attractorSize }) {
  return /* glsl */ `
  uniform float time;
  uniform float delta;

    #include <common>

    ${getCurlNoise()}
    ${getFbmPattern()}
    ${getRotation()}
    ${getBallify()}

    uniform sampler2D sceneDataTextureAlpha;
    uniform sampler2D sceneDataTextureBeta;
    uniform float weatherNow;
    uniform sampler2D rebornPosition;
    uniform sampler2D rebornNormal;

    uniform float surfaceEmissionForce;
    uniform float playerAttractionForce;
    uniform float playerSpinningForce;
    uniform float playerPropulsionForce;
    uniform float shieldRadius;

    void main (void) {

      vec2 uv = gl_FragCoord.xy / resolution.xy;
      vec4 data_sim_position = texture2D( iv_position, uv );
      vec4 data_sim_velocity = texture2D( iv_velocity, uv );

      // data_sim_velocity.xyz += curlNoise(data_sim_velocity.xyz) * 0.1;
      // data_sim_position.rgb = data_sim_position.rgb + data_sim_velocity.rgb;

      const float resY = ${attractorSize.y.toFixed(1)};
      const float resX = ${attractorSize.x.toFixed(1)};

      const float resXY = resX * resY;

      float intv = 0.0;
      for (float y = 0.0; y < resY; y += 1.0) {
        for (float x = 0.0; x < resX; x += 1.0) {
          vec2 sceneUV = vec2(x / resX, y / resY);
          vec4 dataAlpha = texture2D(sceneDataTextureAlpha, sceneUV);
          vec4 dataBeta = texture2D(sceneDataTextureBeta, sceneUV);

          //
          if (dataBeta.x == 2.0) {
            //
            vec3 diff = (dataAlpha.xyz - data_sim_position.xyz);
            float insideForce = -1.0;
            float outsideForce = 1.0;
            float radius = 10.0;

            if (weatherNow == 1.0) {
              radius = shieldRadius;
              insideForce = -1.0 * playerPropulsionForce;
              outsideForce = 1.0 * playerAttractionForce;
            }


            float strength = abs((length(diff) - radius));
            if (strength >= 20.0) {
              strength = 20.0;
            }

            diff.rgb *= rotation3dY(playerSpinningForce);

            if (length(diff) >= radius) {
              data_sim_velocity.xyz += normalize(diff) * (outsideForce) * strength;
            } else {
              data_sim_velocity.xyz += normalize(diff) * (insideForce) * strength;
            }


            //
          }
          intv += 1.0;
        }
      }

      vec4 rebornNormalData = texture2D(rebornNormal, uv);
      vec4 rebornPositionData = texture2D(rebornPosition, uv);

      data_sim_velocity.xyz += normalize(rebornNormalData.rgb) * normalize(rebornNormalData.rgb) * 1.3 * surfaceEmissionForce;

      data_sim_position.rgb += data_sim_velocity.rgb * 0.05;

      //
      // if (weatherNow == 2.0) {
      // }

      // if (weatherNow == 2.0) {
      // }


      // reset
      // if (data_sim_position.y <= -10.0 || data_sim_position.w == 0.0 || rand(data_sim_position.xy + time) >= 0.99) {
      if (data_sim_position.w == 0.0 || rand(data_sim_position.xy + time) >= 0.99 || length(data_sim_position.rgb - rebornPositionData.rgb) >= 500.0) {

        // vec3 resetPosition = vec3(
        //   -0.5 + rand(uv + 0.1),
        //   -0.5 + rand(uv + 0.2),
        //   -0.5 + rand(uv + 0.3)
        // ) * vec3(100.0, -1.0, 100.0);

        // if (weatherNow == 1.0) {
        //   //

        //   resetPosition = vec3(
        //     -0.5 + rand(uv + 0.1),
        //     -0.5 + rand(uv + 0.2),
        //     -0.5 + rand(uv + 0.3)
        //   ) * vec3(80.0, 1.0, 80.0);

        //   resetPosition.y += 25.0;

        //   //
        // } else if (weatherNow == 2.0) {
        //   resetPosition = vec3(
        //     -0.5 + rand(uv + 0.1),
        //     -0.5 + rand(uv + 0.2),
        //     -0.5 + rand(uv + 0.3)
        //   ) * vec3(40.0, 20.0, 40.0);

        //   resetPosition.y += 10.0;

        //   // resetPosition = ballify(resetPosition, 50.0);
        //   // resetPosition.y += 50.0 * 2.0;
        // } else if (weatherNow == 3.0) {
        //   resetPosition = vec3(
        //     -0.5 + rand(uv + 0.1),
        //     -0.5 + rand(uv + 0.2),
        //     -0.5 + rand(uv + 0.3)
        //   ) * vec3(80.0, 0.0, 80.0);
        //   resetPosition.y += 1.0;
        // }

        data_sim_position.xyz = rebornPositionData.rgb;//resetPosition;

        data_sim_position.w = rand(uv + 0.1 + time);
      }

      // data_sim_position.rgb *= rotation3dX(0.013);
      // data_sim_position.rgb *= rotation3dY(0.013);
      // data_sim_position.rgb *= rotation3dZ(0.013);

      gl_FragColor = vec4(data_sim_position.rgb, 1.0);
    }
  `
}

function simVel({ attractorSize }) {
  return /* glsl */ `

  uniform float time;
  uniform float delta;
  uniform float weatherNow;

    #include <common>

    ${getFbmPattern()}

    void main (void) {

      vec2 uv = gl_FragCoord.xy / resolution.xy;
      // vec4 data_sim_position = texture2D( iv_position, uv );
      vec4 data_sim_velocity = texture2D( iv_velocity, uv );

      // data_sim_velocity.rgb += curlNoise(data_sim_velocity.xyz) * 0.001;

      // data_sim_velocity.y = 0.1;
      // data_sim_velocity.x = 0.0;
      data_sim_velocity.y = -0.05 * pattern(uv + time);
      if (weatherNow == 1.0) {
        data_sim_velocity.y *= 5.0;
      }
      if (weatherNow == 2.0) {
        data_sim_velocity.y *= 0.0;
      }
      if (weatherNow == 3.0) {
        data_sim_velocity.y *= -1.0;
      }
      // data_sim_velocity.z = 0.0;

      gl_FragColor = vec4(data_sim_velocity.rgb, 1.0);
    }
  `
}

// function MachineButton({ core, gpi, keyname = "", text = "snow" }) {
//   let { sub } = core.scope(async ({ sub }) => {
//     let btn = await sub.ready.btn;
//   });

//   core.reactTo("weatherNow");

//   return (
//     <group position={[0, 0, 0]}>
//       <Text
//         position={[0, 1.5, 0]}
//         fontSize={0.3}
//         outlineWidth={0.01}
//         outlineBlur={0.03}
//       >
//         {text}
//       </Text>
//       <RotY>
//         <mesh
//           onPointerEnter={() => {
//             //
//           }}
//           onPointerLeave={() => {
//             //
//           }}
//           ref={sub.name("btn")}
//           onClick={async () => {
//             //
//             useLocal.getState().weatherNow = keyname;
//           }}
//           position={[0, 0.5, 0]}
//           scale={1.5}
//         >
//           <icosahedronBufferGeometry
//             args={[0.5, 0]}
//           ></icosahedronBufferGeometry>
//           <meshStandardMaterial
//             metalness={0.7}
//             roughness={0.5}
//             wireframe={false}
//             color={useLocal.getState().weatherNow === keyname ? "lime" : "cyan"}
//           ></meshStandardMaterial>
//         </mesh>
//       </RotY>
//     </group>
//   );
// }

// function RotY({ children }) {
//   let ref = useRef();
//   let t = 0;
//   useFrame((st, dt) => {
//     if (ref.current) {
//       t += dt;
//       ref.current.rotation.y += dt * Math.sin(t);
//     }
//   });
//   return <group ref={ref}>{children}</group>;
// }

function getCurlNoise() {
  return /* glsl */ `

//
// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
  {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
  }


vec3 snoiseVec3( vec3 x ){

  float s  = snoise(vec3( x ));
  float s1 = snoise(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));
  float s2 = snoise(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));
  vec3 c = vec3( s , s1 , s2 );
  return c;

}


vec3 curlNoise( vec3 p ){

  const float e = .1;
  vec3 dx = vec3( e   , 0.0 , 0.0 );
  vec3 dy = vec3( 0.0 , e   , 0.0 );
  vec3 dz = vec3( 0.0 , 0.0 , e   );

  vec3 p_x0 = snoiseVec3( p - dx );
  vec3 p_x1 = snoiseVec3( p + dx );
  vec3 p_y0 = snoiseVec3( p - dy );
  vec3 p_y1 = snoiseVec3( p + dy );
  vec3 p_z0 = snoiseVec3( p - dz );
  vec3 p_z1 = snoiseVec3( p + dz );

  float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
  float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
  float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

  const float divisor = 1.0 / ( 2.0 * e );
  return normalize( vec3( x , y , z ) * divisor );

}

  `
}

function getFbmPattern() {
  return /* glsl */ `

    const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

    float noise( in vec2 p ) {
      return sin(p.x)*sin(p.y);
    }

    float fbm4( vec2 p ) {
        float f = 0.0;
        f += 0.5000 * noise( p ); p = m * p * 2.02;
        f += 0.2500 * noise( p ); p = m * p * 2.03;
        f += 0.1250 * noise( p ); p = m * p * 2.01;
        f += 0.0625 * noise( p );
        return f / 0.9375;
    }

    float fbm6( vec2 p ) {
        float f = 0.0;
        f += 0.500000*(0.5 + 0.5 * noise( p )); p = m*p*2.02;
        f += 0.250000*(0.5 + 0.5 * noise( p )); p = m*p*2.03;
        f += 0.125000*(0.5 + 0.5 * noise( p )); p = m*p*2.01;
        f += 0.062500*(0.5 + 0.5 * noise( p )); p = m*p*2.04;
        f += 0.031250*(0.5 + 0.5 * noise( p )); p = m*p*2.01;
        f += 0.015625*(0.5 + 0.5 * noise( p ));
        return f/0.96875;
    }

    float pattern (vec2 p) {
      float vout = fbm4( p + time + fbm6(  p + fbm4( p + time )) );
      return abs(vout);
    }
  `
}

function getRotation() {
  return /* glsl */ `

  mat3 rotation3dX(float angle) {
    float s = sin(angle);
    float c = cos(angle);

    return mat3(
      1.0, 0.0, 0.0,
      0.0, c, s,
      0.0, -s, c
    );
  }
  vec3 rotateX(vec3 v, float angle) {
    return rotation3dX(angle) * v;
  }

  mat3 rotation3dY(float angle) {
    float s = sin(angle);
    float c = cos(angle);

    return mat3(
      c, 0.0, -s,
      0.0, 1.0, 0.0,
      s, 0.0, c
    );
  }

  vec3 rotateY(vec3 v, float angle) {
    return rotation3dY(angle) * v;
  }

  mat3 rotation3dZ(float angle) {
    float s = sin(angle);
    float c = cos(angle);

    return mat3(
      c, s, 0.0,
      -s, c, 0.0,
      0.0, 0.0, 1.0
    );
  }

  vec3 rotateZ(vec3 v, float angle) {
    return rotation3dZ(angle) * v;
  }
  `
}

function getBallify() {
  return /* glsl */ `
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

  `
}
