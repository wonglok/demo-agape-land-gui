import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { MyOrbitControls } from './MyOrbit'
// import { sceneToMerged } from '../CanvasEntryPoint/sceneToMerged'

export function RotCamera({ children }) {
  let camera = useThree((r) => r.camera)
  let gl = useThree((r) => r.gl)
  let ref = useRef()

  let [ctr, setCtr] = useState(false)
  useEffect(() => {
    let ctrls = new MyOrbitControls(camera, gl.domElement)
    camera.position.set(0, 0, 40)
    ctrls.object.position.set(0, 0, 40)
    ctrls.target.set(0, 0, 0)

    ctrls.enableDamping = true
    ctrls.dampingFactor = 0.025
    ctrls.enablePan = false
    ctrls.rotateSpeed = -4
    // ctrls.minDistance = 30;
    // ctrls.maxDistance = 80;

    // ctrls.object.position.set(0, 20, 3);
    // ref.current.rotation.y = Math.PI * 0.0;

    setCtr(ctrls)
    return () => {
      ctrls.dispose()
    }
  }, [gl, camera])

  useFrame(() => {
    if (ctr) {
      if (ref.current) {
        ctr.myTarget = ref.current
      }
      ctr.update()
    }
  })

  //
  return (
    <>
      <group ref={ref}>{children}</group>
      {/*  */}
    </>
  )
}
