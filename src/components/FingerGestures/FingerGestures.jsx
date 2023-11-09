import { Box } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useFingers } from './useFingers'
import { useEffect } from 'react'

export function FingerGestures() {
  let gui2d = useFingers((r) => r.gui2d)
  useEffect(() => {}, [])
  return (
    <>
      <Canvas>{<Core />}</Canvas>
      {gui2d}
    </>
  )
}

export function Core() {
  let gui3d = useFingers((r) => r.gui3d)
  return (
    <>
      <>{gui3d}</>
    </>
  )
}
