import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Clock, DoubleSide } from 'three'

export function Patch() {
  let scene = useThree((r) => r.scene)
  let workRef = useRef()
  useFrame((st, dt) => {
    if (workRef.current) {
      workRef.current(st, dt)
    }
  })

  useEffect(() => {
    let tt = setInterval(() => {
      let inter = false

      scene.traverse((r) => {
        if (r.name === 'querlogp' && !inter) {
          inter = r
        }
      })

      if (!inter) {
        return
      }

      let querlo = inter.getObjectByName('metaverse')
      if (!querlo) {
        return
      }

      clearInterval(tt)
      querlo.traverse((it) => {
        // console.log(it)
        if (it.name === 'Plane') {
          it.visible = false
        }
        if (it.name === 'Querlo001' && it.material) {
          it.material.side = DoubleSide
        }

        if ((it.name === 'Querlo011' || it.name === 'Querlo002') && it.material) {
          it.material = it.material.clone()
          it.material.map = it.material.map.clone()
          it.material.normalMap = it.material.normalMap.clone()
          it.material.roughnessMap = it.material.roughnessMap.clone()
          it.material.metalnessMap = it.material.metalnessMap.clone()

          let clock = new Clock()
          workRef.current = () => {
            let dt = clock.getDelta()
            it.material.map.offset.x += 0.1 * dt
            it.material.normalMap.offset.x += 0.1 * dt
            it.material.roughnessMap.offset.x += 0.1 * dt
            it.material.metalnessMap.offset.x += 0.1 * dt
          }
        }
      })
    })

    return () => {}
  }, [scene])

  return <></>
}
