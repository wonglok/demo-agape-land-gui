import { useAnimations, useGLTF } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils'
import { AnimationMixer, Color } from 'three'
import { useFrame } from '@react-three/fiber'

export function Genesis() {
  let gltf = useGLTF(`/garage/texture-proper-512.glb`)

  let refGP = useRef()
  let mixer = useMemo(() => new AnimationMixer(gltf.scene), [gltf.scene])

  useFrame((st, dt) => {
    mixer.update(dt)
  })
  useEffect(() => {
    gltf.scene.traverse((it) => {
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
    mixer.clipAction(gltf.animations[0]).play()
  }, [mixer, gltf.animations])
  return (
    <>
      {/*  */}
      <group ref={refGP} scale={1}>
        <primitive object={gltf.scene}></primitive>
      </group>
      {/*  */}
    </>
  )
}
