import { Canvas } from '@react-three/fiber'
import { GameModeAdapter } from '../Runner/GameModeAdapter'
import { useWorld } from './useWorld'
import { MyBG } from './MyGB'
// import { LinearEncoding, sRGBEncoding } from 'three'
import { Suspense } from 'react'
import { Joystick, PPSwitch } from 'agape-sdk/src/main'
// import { Background } from 'agape-sdk/src/main'

export function Tmobile() {
  return (
    <>
      <Canvas>
        <Suspense fallback={null}>
          <group>
            <GameModeAdapter useStore={useWorld}></GameModeAdapter>
            {/* <Patch></Patch> */}
          </group>

          <PPSwitch useStore={useWorld}></PPSwitch>

          {/* <directionalLight intensity={0.35} position={[0, 1, 1]}></directionalLight>
          <directionalLight intensity={0.35} position={[0, 1, -1]}></directionalLight>
          <pointLight intensity={0.1} position={[0, 5, -10]}></pointLight> */}

          <MyBG useStore={useWorld}></MyBG>
        </Suspense>
      </Canvas>

      <div id='guilayer'></div>
      <JoyStickHTML useStore={useWorld}></JoyStickHTML>
    </>
  )
}

function JoyStickHTML({ useStore }) {
  let gameMode = useStore((r) => r.gameMode)
  return <>{gameMode === 'room' && <Joystick></Joystick>}</>
}
