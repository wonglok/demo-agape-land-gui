import { Canvas } from '@react-three/fiber'
import { GameModeAdapter } from '../Runner/GameModeAdapter'
import { useQuerlo } from './useQuerlo'
import { MyBG } from './MyGB'
import { sRGBEncoding } from 'three'
import { Patch } from './Path'
import { Suspense } from 'react'
import { Joystick, PPSwitch } from 'agape-sdk/src/main'
// import { Background } from 'agape-sdk/src/main'

export function Querlo() {
  return (
    <>
      <Canvas
        onCreated={(st) => {
          st.gl.outputEncoding = sRGBEncoding
          st.gl.useLegacyLights = false
        }}
      >
        <Suspense fallback={null}>
          <group name='querlogp'>
            <GameModeAdapter useStore={useQuerlo}></GameModeAdapter>
            <Patch></Patch>
          </group>

          <PPSwitch useStore={useQuerlo}></PPSwitch>

          <directionalLight intensity={1} position={[0, 1, 1]}></directionalLight>
          <directionalLight intensity={1} position={[0, 1, -1]}></directionalLight>
          <pointLight intensity={5} position={[0, 5, -10]}></pointLight>

          {/* <Background useStore={useQuerlo}></Background> */}
          <MyBG useStore={useQuerlo}></MyBG>
        </Suspense>
      </Canvas>

      <div id='guilayer'></div>
      <JoyStickHTML useStore={useQuerlo}></JoyStickHTML>
    </>
  )
}

function JoyStickHTML({ useStore }) {
  let gameMode = useStore((r) => r.gameMode)
  return <>{gameMode === 'room' && <Joystick></Joystick>}</>
}
