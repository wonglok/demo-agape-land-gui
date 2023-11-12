import { Canvas, useThree } from '@react-three/fiber'
import { useFingers } from './useFingers'
import { useEffect, useMemo } from 'react'
import { Environment, OrbitControls, Text } from '@react-three/drei'
import { SphereGeometry } from 'three'

export function FingerGestures() {
  let gui2d = useFingers((r) => r.gui2d)
  let gui3d = useFingers((r) => r.gui3d)
  useEffect(() => {}, [])
  return (
    <>
      <Canvas>
        {gui3d}
        {<Core />}
      </Canvas>
      {gui2d}
    </>
  )
}

export function Core() {
  let setup = useFingers((r) => r.setup)

  let gl = useThree((r) => r.gl)
  let camera = useThree((r) => r.camera)
  let scene = useThree((r) => r.scene)
  let controls = useThree((r) => r.controls)
  let viewport = useThree((r) => r.viewport)

  useEffect(() => {
    useFingers.setState({ viewport, gl, camera, scene, controls })
  }, [gl, camera, scene, viewport, controls])

  useEffect(() => {
    setup({})
  }, [setup])

  return (
    <>
      <>
        <Environment files={`/Handlandmark/room.hdr`}></Environment>
        <MyLandmarks></MyLandmarks>
        <OrbitControls object-position={[0, 0, 10]} makeDefault></OrbitControls>
      </>
    </>
  )
}

function MyLandmarks() {
  let landmarks = useFingers((r) => r.landmarks)
  let handednesses = useFingers((r) => r.handednesses)
  let geo = useMemo((r) => {
    return new SphereGeometry(0.1, 32, 32)
  }, [])

  let sides = handednesses.map((r) => {
    return r[0]?.categoryName?.toLowerCase()
  })

  let hasLeftAndRight = sides.includes('left') && sides.includes('right')
  //

  //
  return (
    <>
      {landmarks.map((hand, hidx) => {
        let handMetaList = handednesses[hidx] || []

        let handInfo = handMetaList[0]

        if (!handInfo) {
          return <group key={hidx + 'hidx'}></group>
        }

        //
        let handSide = handInfo.categoryName.toLowerCase()
        let color = handSide === 'left' ? 'green' : 'blue'

        return (
          <group key={'rand' + 'yo' + '' + hidx + '' + color + handSide + 'hand'}>
            {hand.map((finger, fidx) => {
              return (
                <>
                  <group
                    position={finger.position.toArray() || [0, 0, 0]}
                    key={'gp' + '_side' + handSide + '_h' + hidx + '_f' + fidx}
                  >
                    <mesh scale={[1, 1, 1]} geometry={geo}>
                      <meshStandardMaterial color={finger.color}></meshStandardMaterial>
                    </mesh>
                  </group>
                </>
              )
            })}
          </group>
        )
      })}
    </>
  )
}
