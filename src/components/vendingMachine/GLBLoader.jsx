import { useGLTF } from '@react-three/drei'
import { Color } from 'three'

export function GLBLoader() {
  let gltf = useGLTF(`/vendingMachine/vnd-machine.glb`)

  gltf.scene.traverse((it) => {
    if (it) {
      it.frustumCulled = false
      // agape poster
      if (it.name === 'Uv04_high001') {
        it.visible = true
        it.renderOrder = 100
        it.material.emissive = new Color('#ffffff')
        it.material.emissiveIntensity = 20
      }
      // orange
      if (it.name === 'Uv03_high005') {
        it.visible = true
        it.renderOrder = 200
        it.material.color = new Color('#ff6600')
        it.material.emissive = new Color('#ff6600')
        it.material.emissiveIntensity = 1
      }

      if (it.name === 'Uv01_high001') {
        it.visible = true
        it.renderOrder = 300
        it.material.emissive = new Color('#ffffff')
        it.material.emissiveIntensity = 0.3
        it.material.emissiveMap = it.material.map
      }

      if (it.name === 'Uv02_high001') {
        it.material.color = new Color('#000000')
        it.material.emissive = new Color('#ffffff')
        it.material.emissiveIntensity = 0.3
        it.material.emissiveMap = it.material.map
      }
    }
  })

  //
  return (
    <>
      <group
        onClick={(ev) => {
          console.log(ev)
        }}
      >
        <primitive object={gltf.scene}></primitive>
      </group>
    </>
  )
}
