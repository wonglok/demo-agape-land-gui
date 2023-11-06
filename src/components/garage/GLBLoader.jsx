import { useGLTF } from '@react-three/drei'

export function GLBLoader() {
  let gltf = useGLTF(`/garage/garage-v3-4k-v1.glb`)

  gltf.scene.traverse((it) => {
    ///

    if (it.material) {
      //
      it.material.emissiveIntensity = 8
      //
    }
    ///
  })
  return (
    <>
      <primitive object={gltf.scene}></primitive>
    </>
  )
}
