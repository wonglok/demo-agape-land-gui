import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect } from 'react'
import { CleanGPU } from './CleanGPU/CleanGPU'
import { InjectDeps, authoriseMic, authoriseMP3, useMic } from './CleanGPU/mic/histroymic'
import './CleanGPU/GPURun'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
// import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { HalfFloatType } from 'three'

export function Sound() {
  let MicTexture = useMic((r) => r.MicTexture)
  let gl = useMic((r) => r.gl)

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // authoriseMic({ gl })
    }
  }, [gl])
  return (
    <>
      <Canvas>
        <color attach={'background'} args={['#000000']} />
        <Suspense fallback={<></>}>
          <InjectDeps></InjectDeps>
          <group position={[0, 0, 0]}>{MicTexture && <CleanGPU></CleanGPU>}</group>
        </Suspense>

        <PerspectiveCamera makeDefault near={1} far={10000}></PerspectiveCamera>
        <OrbitControls makeDefault object-position={[0, 0, 15]} target={[0, 0, 0]}></OrbitControls>

        {/* <EffectComposer
          frameBufferType={HalfFloatType}
          disableNormalPass
          multisampling={0}
        >
          <Bloom intensity={2} mipmapBlur luminanceThreshold={0.25}></Bloom>
        </EffectComposer> */}
      </Canvas>
      <div className=' absolute' style={{ top: `100px`, left: `calc(50% - 100px)` }}>
        {gl && (
          <>
            <button
              className='m-2 bg-gray-200 p-3'
              onClick={() => {
                //setup

                authoriseMic({ gl })
              }}
            >
              Setup Mic
            </button>
            <button
              className='m-2 bg-gray-200 p-3'
              onClick={() => {
                //setup

                authoriseMP3({ gl })
              }}
            >
              Setup MP3
            </button>
          </>
        )}
      </div>
    </>
  )
}
