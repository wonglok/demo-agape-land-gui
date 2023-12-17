import { MapControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { useVFX } from '../useVFX'

export function UserControls() {
  let controls = useThree((r) => r.controls)

  useEffect(() => {
    if (!controls) {
      return
    }

    useVFX.setState({ controls: controls })
    controls.enableDamping = true
    controls.dampingFactor = 0.9
    controls.panningSpeed = 3
    controls.screenSpacePanning = false
    controls.minDistance = 1
    controls.maxDistance = 150
    controls.maxPolarAngle = Math.PI / 2
  }, [controls])

  return (
    <>
      <MapControls makeDefault enableRotate={false} object-position={[0, 5, 5]} target={[0, 0, 0]}></MapControls>
    </>
  )
}
