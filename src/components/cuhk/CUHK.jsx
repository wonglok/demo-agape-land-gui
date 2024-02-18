import { Canvas, useFrame } from '@react-three/fiber'
import { GameModeAdapter } from '../Runner/GameModeAdapter'
import { useCUHK } from './useCUHK'
import { MyBG } from './MyGB'
// import { LinearEncoding, sRGBEncoding } from 'three'
// import { Patch } from './Path'
import { Suspense, useEffect } from 'react'
import { Joystick, PPSwitch } from 'agape-sdk/src/main'
// import { Background } from 'agape-sdk/src/main'

export function CUHK() {
  return (
    <>
      <Canvas>
        <Suspense fallback={null}>
          <group name='cuhk' >
            <GameModeAdapter useStore={useCUHK}></GameModeAdapter>
            {/* <Patch></Patch> */}
          </group>

          <PPSwitch useStore={useCUHK}></PPSwitch>

          <directionalLight intensity={0.35} position={[0, 1, 1]}></directionalLight>
          <directionalLight intensity={0.35} position={[0, 1, -1]}></directionalLight>
          <pointLight intensity={0.1} position={[0, 5, -10]}></pointLight>

          <MyBG useStore={useCUHK}></MyBG>
          <Born></Born>
          <ambientLight intensity={0.1} color={'#ffffee'}></ambientLight>
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

function Born() {
  let game = useCUHK(r => r.game)
  let collider = useCUHK(r => r.collider)
  let camera = useCUHK(r => r.camera)
  useEffect(() => {

    if (game) {
      setTimeout(() => {
        let position = [
          31.430484769426158,
          1.4415641634987484,
          -3.912416261181021
        ]
        let camPos = [
          31.616983699698913,
          1.49999,
          4.684678689379601
        ]

        game.reset(position, camPos)
      }, 100)
    }
  }, [camera, collider, game])
  useFrame((st) => {
    console.log(st.camera.position.toArray(), game?.player?.position?.toArray())
  })

  return null
}
