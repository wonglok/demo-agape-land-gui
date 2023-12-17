import { Canvas } from '@react-three/fiber'
import { UserControls } from './MapControls/UserControls'
import { Floor } from './Floor/Floor'
import { Box, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { DynamicGPU } from './Run/DynamicGPU/DynamicGPU'

export function EmpireVFX() {
  return (
    <>
      {/*  */}

      <Canvas>
        <color attach={'background'} args={[0x000000]}></color>
        <PerspectiveCamera fov={32} makeDefault position={[0, 0, 32]}></PerspectiveCamera>
        <OrbitControls makeDefault enablePan={false} enableZoom={false} enableRotate={false}></OrbitControls>
        <DynamicGPU></DynamicGPU>
      </Canvas>
    </>
  )
}

//
