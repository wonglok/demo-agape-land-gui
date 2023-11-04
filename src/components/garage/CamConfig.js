import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'

export function CamConfig() {
  let camera = useThree((s) => s.camera)
  // let viewport = useThree((s) => s.viewport)
  // let portmax = Math.max(viewport.width, viewport.height)

  camera.fov = 35
  camera.updateProjectionMatrix()

  useEffect(() => {
    //
    document.body.style.backgroundColor = 'black'
  }, [])

  return <></>
}
