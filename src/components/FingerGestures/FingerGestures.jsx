import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useFingers } from './useFingers'
import { useEffect, useMemo, useRef } from 'react'
import { Box, Environment, OrbitControls, Text, useTexture } from '@react-three/drei'
import { IcosahedronGeometry, Object3D, SRGBColorSpace, SphereGeometry, sRGBEncoding } from 'three'

export function FingerGestures() {
  let gui2d = useFingers((r) => r.gui2d)
  let gui3d = useFingers((r) => r.gui3d)
  // useEffect(() => {}, [])

  //

  //
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
        <PinchCompos></PinchCompos>
        <OrbitControls object-position={[0, 0, 10]} makeDefault></OrbitControls>
      </>
    </>
  )
}

function PinchCompos() {
  let o3 = useMemo(() => new Object3D(), [])

  let ref = useRef()
  useEffect(() => {
    let hh = ({ detail }) => {
      console.log('startZooming', detail)
    }
    window.addEventListener('startZooming', hh)
    return () => {
      window.removeEventListener('startZooming', hh)
    }
  }, [])

  useEffect(() => {
    let hh = ({ detail }) => {
      console.log('moveZooming', detail)

      o3.scale.x += detail.diff / 5
      o3.scale.y += detail.diff / 5
      o3.scale.z = 0.1
      // o3.scale.z += detail.diff / 5
    }
    window.addEventListener('moveZooming', hh)
    return () => {
      window.removeEventListener('moveZooming', hh)
    }
  }, [])

  useEffect(() => {
    let hh = ({ detail }) => {
      console.log('stopZooming', detail)
    }
    window.addEventListener('stopZooming', hh)
    return () => {
      window.removeEventListener('stopZooming', hh)
    }
  }, [])

  useFrame(() => {
    //

    if (ref.current) {
      ref.current.scale.lerp(o3.scale, 0.15)
    }
  })
  let map = useTexture('/thekiss-art/4k-thekiss.jpg')
  map.encoding = sRGBEncoding
  map.colorSpace = SRGBColorSpace

  //
  return (
    <>
      <Box position={[0, 0, 0]} ref={ref}>
        <meshStandardMaterial color={'#fff'} roughness={1} metalness={0} map={map}></meshStandardMaterial>
      </Box>
    </>
  )
}

function MyLandmarks() {
  let landmarks = useFingers((r) => r.landmarks)
  let handednesses = useFingers((r) => r.handednesses)
  let geo = useMemo((r) => {
    return new IcosahedronGeometry(0.2, 2)
  }, [])

  let sides = handednesses.map((r) => {
    return r[0]?.categoryName?.toLowerCase()
  })

  let hasLeftAndRight = sides.includes('left') && sides.includes('right')
  //

  //
  return (
    <>
      <group position={[0, 0, 1]}>
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
                        <meshPhysicalMaterial
                          transmission={1}
                          roughness={0}
                          thickness={1.3}
                          flatShading
                          color={finger.color}
                        ></meshPhysicalMaterial>
                      </mesh>
                    </group>
                  </>
                )
              })}
            </group>
          )
        })}
      </group>
    </>
  )
}
