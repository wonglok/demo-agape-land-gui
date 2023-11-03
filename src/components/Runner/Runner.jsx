'use client'

import { Canvas } from '@react-three/fiber'
import { SceneStateManager } from 'agape-sdk'
// import { Loader } from '../Loader/Loader'
import { Background } from 'agape-sdk'
import { GameModeAdapter } from './GameModeAdapter'
import { SceneKit } from './SceneKit'
import { PPSwitch } from 'agape-sdk'
import { Joystick } from 'agape-sdk'
import { AgapeNodeRuntime } from 'agape-sdk'
import { OfflineLoader } from '../Loader/OfflineLoader'
import { authorise, useMic } from '../mic/mic'
import { MyBG } from './MyBG'

export function Runner({ projectID }) {
  return (
    <div className='h-full w-full'>
      <SceneStateManager
        ReadyCompos={function Compos({ useStore }) {
          let ready = useStore((r) => r.ready)

          return (
            <>
              {/*  */}

              <OfflineLoader projectID={projectID} useStore={useStore}></OfflineLoader>

              {/* <Loader projectID={projectID} useStore={useStore}></Loader> */}

              <Canvas gl={{ logarithmicDepthBuffer: true }}>
                {ready && (
                  <>
                    <MyBG></MyBG>
                    <SceneKit useStore={useStore}></SceneKit>
                    <GameModeAdapter useStore={useStore}></GameModeAdapter>
                    <Background useStore={useStore}></Background>
                    <PPSwitch useStore={useStore}></PPSwitch>
                    <AgapeNodeRuntime useStore={useStore}></AgapeNodeRuntime>
                  </>
                )}
              </Canvas>

              <div id='guilayer'></div>
              <JoyStickHTML useStore={useStore}></JoyStickHTML>

              <Authoriser useStore={useStore}></Authoriser>
            </>
          )
        }}
      ></SceneStateManager>
    </div>
  )
}

function Authoriser({ useStore }) {
  let MicTexture = useMic((r) => r.MicTexture)
  let ready = useStore((r) => r.ready)

  return (
    <>
      {!MicTexture && ready && (
        <div className=' absolute left-0 top-0 flex h-full w-full items-center justify-center'>
          <button
            className='rounded-2xl bg-white p-5'
            onClick={() => {
              authorise()
            }}
          >
            Enter Club
          </button>
        </div>
      )}
    </>
  )
}
function JoyStickHTML({ useStore }) {
  let gameMode = useStore((r) => r.gameMode)
  return <>{gameMode === 'room' && <Joystick></Joystick>}</>
}
