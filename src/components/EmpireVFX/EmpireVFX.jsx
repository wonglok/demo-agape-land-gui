import { Canvas } from '@react-three/fiber'
import { UserControls } from './MapControls/UserControls'
import { Floor } from './Floor/Floor'

export function EmpireVFX() {
  return (
    <>
      {/*  */}

      <Canvas>
        <UserControls></UserControls>
        <Floor></Floor>
      </Canvas>
      {/*  */}
    </>
  )
}
