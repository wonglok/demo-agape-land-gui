import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect } from 'react'
import { CleanGPU } from './CleanGPU/CleanGPU'
import { InjectDeps, authoriseMic, authoriseMP3, useMic } from './CleanGPU/mic/histroymic'
// import './CleanGPU/GPURun'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { MyWater } from './MyWater/MyWater'
// import { Bloom, EffectComposer } from '@react-three/postprocessing'

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
          <group rotation={[0, 0, 0]} position={[0, 0, 0]}>
            {MicTexture && <CleanGPU></CleanGPU>}
          </group>
        </Suspense>

        <PerspectiveCamera makeDefault near={1} far={10000}></PerspectiveCamera>
        <OrbitControls
          makeDefault
          enablePan={false}
          enableRotate={true}
          object-position={[0, 3.5, 50]}
          target={[0, 0, 0]}
        ></OrbitControls>

        <EffectComposer disableNormalPass multisampling={4}>
          <Bloom intensity={5} mipmapBlur luminanceThreshold={0.1}></Bloom>
        </EffectComposer>
        {/* <group position={[0, 0, 0]}>
          <MyWater></MyWater>
        </group> */}
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

//
