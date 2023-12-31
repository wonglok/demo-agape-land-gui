import { Canvas } from '@react-three/fiber'
import { Joystick, PPSwitch } from 'agape-sdk/src/main'
import { baseURL, useAgape } from './useAgape'
import { Box, Environment, OrbitControls, PerspectiveCamera, Sphere } from '@react-three/drei'
import { GLBLoader } from './GLBLoader'
import { CamConfig } from './CamConfig'
import { Video } from './Video'
import { DoubleSide } from 'three'
import { Genesis } from './Genesis'
import { Suspense, useEffect } from 'react'
import { GameModeAdapter } from '../Runner/GameModeAdapter'

export function Garage() {
  return (
    <>
      <Canvas onCreated={(st) => { }}>
        {/* <Box>
          <meshStandardMaterial></meshStandardMaterial>
        </Box> */}

        {/*  */}
        <PPSwitch useStore={useAgape}></PPSwitch>

        <CamConfig></CamConfig>
        <group visible={true}>
          <GameModeAdapter useStore={useAgape}></GameModeAdapter>
        </group>

        <group>
          <pointLight color={'#777777'} position={[-8, 4, 0]} intensity={0.2}>
            <mesh visible={false}>
              <sphereBufferGeometry args={[0.3, 32, 32]}></sphereBufferGeometry>
            </mesh>
          </pointLight>

          <pointLight color={'#777777'} position={[-3, 5, -2]} distance={5} intensity={1.3}>
            <mesh visible={false}>
              <meshBasicMaterial color={'#ff0000'}> </meshBasicMaterial>
              <sphereBufferGeometry args={[0.3, 32, 32]}></sphereBufferGeometry>
            </mesh>
          </pointLight>

          <directionalLight color={'#333333'} position={[-1, 1, 1]}></directionalLight>

          <group scale={1.6} position={[0, 0.2, -3.5]}>
            <Suspense fallback={null}>
              <pointLight color={'#999999'} position={[0, 1.6, 1]} intensity={0.5}>
                <mesh visible={false}>
                  <sphereBufferGeometry args={[0.3, 32, 32]}></sphereBufferGeometry>
                </mesh>
              </pointLight>
              <Genesis></Genesis>
              <pointLight color='#00ffff' position={[0, 0.9, 0.8]} intensity={3} distance={2}>
                {/* <mesh visible={true} scale={0.1}>
            <sphereGeometry></sphereGeometry>
          </mesh> */}
              </pointLight>
            </Suspense>
          </group>

          {/* Grage */}
          <GLBLoader></GLBLoader>

          <group rotation={[0, Math.PI * -0.15, 0]} scale={0.5} position={[10, 0.1, -2]}>
            <Video></Video>
          </group>
        </group>

        <OrbitControls
          object-position={[-11.008556986574158, 6.6361512214584275, 33.39209677862589]}
          target={[0, 2.5, 0]}
          enabled={false}
        ></OrbitControls>

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

        <Birthplace></Birthplace>
      </Canvas>

      <div id='guilayer'></div>
      <Joystick useStore={useAgape}></Joystick>
    </>
  )
}

function Birthplace() {
  let game = useAgape((r) => r.game)

  useEffect(() => {
    if (game) {
      setTimeout(() => {
        game.reset(
          [0, 1.25, 0],
          [-11.008556986574158, 5.6361512214584275, 20.39209677862589].map((r) => r * 0.5),
        )
      }, 0)
    }
  }, [game])

  return null
}
