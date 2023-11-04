import { useAnimations, useGLTF } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils'
import { Color } from 'three'

export function Genesis() {
  let gltf = useGLTF(`/garage/texture-proper-512.glb`)

  let cloned = clone(gltf.scene)

  let refGP = useRef()
  let anim = useAnimations(gltf.animations, refGP)

  useEffect(() => {
    cloned.traverse((it) => {
      it.frustumCulled = false

      if (it.material) {
        it.material.envMapIntensity = 2
        it.material.dithering = true
      }
      if (it.name === 'RetopoFlow005') {
        it.material.emissive = new Color('#00ffff')
      }
    })
  })

  useEffect(() => {
    if (!anim.actions.Idle) {
      return
    }

    anim.actions.Idle.play()
  }, [anim.actions.Idle])
  return (
    <>
      {/*  */}
      <group ref={refGP} scale={1}>
        <primitive object={cloned}></primitive>
      </group>
      {/*  */}
    </>
  )
}
