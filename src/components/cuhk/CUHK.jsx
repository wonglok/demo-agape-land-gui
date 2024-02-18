import { Canvas } from '@react-three/fiber'
import { GameModeAdapter } from '../Runner/GameModeAdapter'
import { useCUHK } from './useCUHK'
import { MyBG } from './MyGB'
// import { LinearEncoding, sRGBEncoding } from 'three'
// import { Patch } from './Path'
import { Suspense } from 'react'
import { Joystick, PPSwitch } from 'agape-sdk/src/main'
// import { Background } from 'agape-sdk/src/main'

export function CUHK() {
  return (
    <>
      <Canvas>
        <Suspense fallback={null}>
          <group name='cuhk'>
            <GameModeAdapter useStore={useCUHK}></GameModeAdapter>
            {/* <Patch></Patch> */}
          </group>

          <PPSwitch useStore={useCUHK}></PPSwitch>

          <directionalLight intensity={0.35} position={[0, 1, 1]}></directionalLight>
          <directionalLight intensity={0.35} position={[0, 1, -1]}></directionalLight>
          <pointLight intensity={0.1} position={[0, 5, -10]}></pointLight>

          <MyBG useStore={useCUHK}></MyBG>
        </Suspense>
      </Canvas>

      <div id='guilayer'></div>
      <JoyStickHTML useStore={useCUHK}></JoyStickHTML>
    </>
  )
}

function JoyStickHTML({ useStore }) {
  let gameMode = useStore((r) => r.gameMode)
  return <>{gameMode === 'room' && <Joystick></Joystick>}</>
}
