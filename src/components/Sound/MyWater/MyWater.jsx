import { useEffect, useState } from 'react'
import { PlaneGeometry, RepeatWrapping, TextureLoader, Vector3 } from 'three'
import { Water } from 'three/examples/jsm/objects/Water'

export function MyWater() {
  let [_, setSt] = useState({ display: null, core: false })

  useEffect(() => {
    const waterGeometry = new PlaneGeometry(10000, 10000)

    let water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new TextureLoader().load('water/waternormals.jpg', function (texture) {
        texture.wrapS = texture.wrapT = RepeatWrapping
      }),
      sunDirection: new Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: false,
    })

    water.rotation.x = -Math.PI / 2
    water.frustumCulled = false
    setSt({
      core: water,
      display: <primitive object={water}></primitive>,
    })
  }, [])
  return (
    <group>
      {_.display}
      {/*  */}
    </group>
  )
}
