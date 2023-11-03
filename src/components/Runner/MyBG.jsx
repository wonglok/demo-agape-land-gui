import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { Color } from 'three'

export function MyBG() {
  let scene = useThree((r) => r.scene)
  useEffect(() => {
    scene.background = new Color('#000000')
  }, [scene])

  return null
}
