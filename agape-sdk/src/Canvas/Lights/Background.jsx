import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import {
  CubeReflectionMapping,
  EquirectangularReflectionMapping,
  PMREMGenerator,
  TextureLoader,
  sRGBEncoding,
  // FloatType,
} from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

export function Background({ useStore }) {
  let envURL = useStore((r) => r.envURL)
  let url = envURL

  let scene = useThree((r) => r.scene)
  let gl = useThree((r) => r.gl)
  useEffect(() => {
    if (!url) {
      scene.environment = null
      return
    }

    try {
      let applyTex = (tx) => {
        let gen = new PMREMGenerator(gl)
        gen.compileEquirectangularShader()
        let envMap = gen.fromEquirectangular(tx)
        envMap.mapping = CubeReflectionMapping
        // envMap.encoding = sRGBEncoding
        // scene.background = envMap.texture;
        scene.environment = envMap.texture
      }

      if (url.includes('.hdr')) {
        let rgbe = new RGBELoader()
        rgbe.setCrossOrigin('yo')
        // rgbe.setDataType(FloatType)
        rgbe
          .loadAsync(url)
          .then((tx) => {
            tx.mapping = EquirectangularReflectionMapping

            // scene.background = tx;
            scene.environment = tx
          })
          .catch((r) => {
            console.log(r)
          })
      } else {
        let loader = new TextureLoader()

        loader.setCrossOrigin('yo')

        loader
          .loadAsync(url)
          .then((tx) => {
            tx.mapping = EquirectangularReflectionMapping
            tx.encoding = sRGBEncoding
            applyTex(tx)
          })
          .catch((r) => {
            console.log(r)
          })
      }
    } catch (e) {
      console.log(e)
    }
  }, [scene, gl, url])
  //
  return null
}

//

//

//
