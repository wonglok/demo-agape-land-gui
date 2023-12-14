import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import {
  EquirectangularReflectionMapping,
  FloatType,
  HalfFloatType,
  LinearEncoding,
  TextureLoader,
  sRGBEncoding,
} from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

export function MyBG({ useStore }) {
  let envURL = useStore((r) => r.envURL)
  let gl = useThree((r) => r.gl)
  let scene = useThree((r) => r.scene)

  useEffect(() => {
    if (envURL.includes('.hdr')) {
      let loader = new RGBELoader()
      loader.load(envURL, (texture) => {
        gl.outputEncoding = sRGBEncoding
        texture.encoding = LinearEncoding
        texture.mapping = EquirectangularReflectionMapping
        texture.needsPMREMUpdate = true
        texture.needsUpdate = true
        scene.background = texture
        scene.environment = texture
      })
      return
    }

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
