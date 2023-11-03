import { useEffect } from 'react'
import { LoaderGLB } from '../../../main.jsx'
import { MetaverseGLB } from '../../../main.jsx'
import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

export function RoomView({ useStore }) {
  let colliderGLBURL = useStore((r) => r.colliderGLBURL)
  let gl = useThree((s) => s.gl)
  return (
    <group>
      {colliderGLBURL && (
        <LoaderGLB
          url={`${colliderGLBURL}`}
          decorate={({ glb }) => {
            glb.scene.traverse((it) => {
              if (it.isLight) {
                it.visible = false
              }
            })
          }}
          //
          animate={true}
          WhenDone={({ glb }) => {
            return (
              <>
                <OrbitControls makeDefault domElement={gl.domElement}></OrbitControls>
                <MetaverseGLB
                  glb={glb}
                  offsetY={1}
                  WhenReady={function Ready() {
                    glb.scene.traverse((it) => {
                      it.castShadow = true
                      it.receiveShadow = true
                    })

                    useEffect(() => {
                      useStore.setState({
                        colliderGLBObjectSrc: colliderGLBURL,
                      })
                    }, [glb])
                    return (
                      <>
                        <primitive object={glb.scene}></primitive>
                      </>
                    )
                  }}
                  resetAt={[0, 1.5, 0]}
                ></MetaverseGLB>
              </>
            )
          }}
        ></LoaderGLB>
      )}
    </group>
  )
}
