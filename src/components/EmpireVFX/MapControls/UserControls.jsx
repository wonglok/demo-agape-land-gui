import { MapControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { useVFX } from '../useVFX'
import { MyDragControls } from './MyDragControls'
export function UserControls() {
  let controls = useThree((r) => r.controls)

  useEffect(() => {
    if (!controls) {
      return
    }

    useVFX.setState({ controls: controls })
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.screenSpacePanning = false
    controls.minDistance = 1
    controls.maxDistance = 150
    controls.maxPolarAngle = Math.PI / 2
  }, [controls])

  return (
    <>
      <MapControls makeDefault object-position={[0, 3, 3]}></MapControls>
      {controls && <MyDragControls controls={controls}></MyDragControls>}
    </>
  )
}
