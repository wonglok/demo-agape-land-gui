import { useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { EquirectangularReflectionMapping, LinearEncoding, SRGBColorSpace } from 'three'

export function MyBG({ useStore }) {
  let envURL = useStore((r) => r.envURL)
  let texture = useTexture(envURL)
  let scene = useThree((r) => r.scene)
  useEffect(() => {
    texture.encoding = LinearEncoding
    texture.SRGBColorSpace = SRGBColorSpace
    texture.mapping = EquirectangularReflectionMapping

    scene.background = texture
    scene.environment = texture
  }, [scene, texture])

  //

  return null
}
