import { useGLTF } from '@react-three/drei'

export function GLBLoader() {
  let gltf = useGLTF(`/garage/garage-v3-4k-v1.glb`)

  return (
    <>
      <primitive object={gltf.scene}></primitive>
    </>
  )
}
