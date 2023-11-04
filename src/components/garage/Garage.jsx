import { Canvas } from '@react-three/fiber'
import { PPSwitch } from 'agape-sdk/src/main'
import { baseURL, useAgape } from './useAgape'
import { Box, Environment, OrbitControls, Sphere } from '@react-three/drei'
import { GLBLoader } from './GLBLoader'
import { CamConfig } from './CamConfig'
import { Video } from './Video'
import { DoubleSide, ACESFilmicToneMapping, CineonToneMapping, LinearToneMapping } from 'three'
import { Genesis } from './Genesis'
import { Suspense } from 'react'

export function Garage() {
  return (
    <>
      <Canvas onCreated={(st) => {}}>
        {/* <Box>
          <meshStandardMaterial></meshStandardMaterial>
        </Box> */}

        {/*  */}
        <PPSwitch useStore={useAgape}></PPSwitch>

        {/* <Environment files={`${baseURL}/agape-sdk/hdr/concret.hdr`}></Environment> */}

        <CamConfig></CamConfig>

        <GLBLoader></GLBLoader>

        <pointLight color={'#009999'} position={[-8, 4, 0]} intensity={0.2}>
          <mesh visible={false}>
            <sphereBufferGeometry args={[0.3, 32, 32]}></sphereBufferGeometry>
          </mesh>
        </pointLight>

        <group scale={1.5} position={[0, 0.2, -3.5]}>
          <pointLight color={'#009999'} position={[0, 1.6, 1]} intensity={0.5}>
            <mesh visible={false}>
              <sphereBufferGeometry args={[0.3, 32, 32]}></sphereBufferGeometry>
            </mesh>
          </pointLight>
          <Suspense fallback={null}>
            <Genesis></Genesis>
          </Suspense>
        </group>

        <group rotation={[0, Math.PI * -0.15, 0]} scale={0.5} position={[10, 0.1, -2]}>
          <Video></Video>
        </group>

        <OrbitControls
          object-position={[-11.008556986574158, 6.6361512214584275, 33.39209677862589]}
          target={[0, 2.5, 0]}
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
      </Canvas>
    </>
  )
}
