import { useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { EquirectangularReflectionMapping, TextureLoader, sRGBEncoding } from 'three'

export function MyBG({ useStore }) {
  let envURL = useStore((r) => r.envURL)
  let gl = useThree((r) => r.gl)
  let scene = useThree((r) => r.scene)

  useEffect(() => {
    new TextureLoader().load(envURL, (texture) => {
      gl.outputEncoding = sRGBEncoding
      texture.encoding = sRGBEncoding
      texture.mapping = EquirectangularReflectionMapping
      texture.needsPMREMUpdate = true
      texture.needsUpdate = true
      scene.background = texture
      scene.environment = texture
    })
  }, [envURL, gl, scene])

  //

  return null
}
