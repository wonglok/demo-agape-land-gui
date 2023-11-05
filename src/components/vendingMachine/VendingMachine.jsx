import { Canvas } from '@react-three/fiber'
import { Joystick, PPSwitch } from 'agape-sdk/src/main'
import { baseURL, useAgape } from './useAgape'
import { Backdrop, Box, Environment, OrbitControls, PerspectiveCamera, Sphere } from '@react-three/drei'
import { GLBLoader } from './GLBLoader'
// import { CamConfig } from './CamConfig'
// import { Video } from './Video'
import { DoubleSide } from 'three'
// import { Genesis } from './Genesis'
import { Suspense, useEffect } from 'react'
// import { GameModeAdapter } from '../Runner/GameModeAdapter'

export function VendingMachine() {
  return (
    <>
      <Canvas onCreated={(st) => {}}>
        {/* <Box>
          <meshStandardMaterial></meshStandardMaterial>
        </Box> */}

        {/*  */}
        <PPSwitch useStore={useAgape}></PPSwitch>

        {/* <CamConfig></CamConfig> */}

        {/* <group visible={true}>
          <GameModeAdapter useStore={useAgape}></GameModeAdapter>
        </group> */}
        {/* <Birthplace></Birthplace> */}

        <OrbitControls
          minAzimuthAngle={-Math.PI * 0.5}
          maxAzimuthAngle={Math.PI * 0.5}
          minPolarAngle={0}
          maxPolarAngle={Math.PI * 0.52}
          makeDefault
          object-position={[0, 1.5, 5]}
          target={[0, 1.5, 0]}
        ></OrbitControls>

        <group scale={1.5}>
          <directionalLight position={[0, 2, 0.1]} intensity={0.01}></directionalLight>
          <GLBLoader></GLBLoader>
        </group>

        <Box args={[500, 500, 0.1]} position={[0, 0, -10]}>
          <meshPhysicalMaterial
            roughness={0.0}
            metalness={0.3}
            side={DoubleSide}
            color='#f0fdff'
            emissive='#000000'
            envMapIntensity={0.0}
          ></meshPhysicalMaterial>
        </Box>

        <Box args={[500, 0.1, 500]} position={[0, -0.05, 0]}>
          <meshPhysicalMaterial
            roughness={0.0}
            metalness={0.3}
            side={DoubleSide}
            color='#f0fdff'
            emissive='#000000'
            envMapIntensity={0.0}
          ></meshPhysicalMaterial>
        </Box>
      </Canvas>

      <div id='guilayer'></div>
      <JoyStickHTML useStore={useAgape}></JoyStickHTML>
    </>
  )
}

function JoyStickHTML({ useStore }) {
  let gameMode = useStore((r) => r.gameMode)
  return <>{gameMode === 'room' && <Joystick></Joystick>}</>
}

function Birthplace() {
  let game = useAgape((r) => r.game)

  useEffect(() => {
    if (game) {
      let tt = setInterval(() => {
        if (game.updatePlayer) {
          clearInterval(tt)
          game.reset([0, 1.5, 4], [0, 1.5 + 1, 4 + 4])
        }
      }, 500)

      return () => {
        clearInterval(tt)
      }
    }
  }, [game])

  return null
}
