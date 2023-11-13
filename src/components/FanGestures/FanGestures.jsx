import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useFingers } from './useFingers'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Environment, Instance, Instances, OrbitControls, Text, useTexture } from '@react-three/drei'
import {
  IcosahedronGeometry,
  InstancedMesh,
  MathUtils,
  Object3D,
  SRGBColorSpace,
  SphereGeometry,
  sRGBEncoding,
} from 'three'

export function FanGestures() {
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

  let [items, setItems] = useState([])
  let acc = useRef(10)
  let vAcc = useRef(10)
  useEffect(() => {
    let hh = ({ detail }) => {
      console.log('moveZooming', detail)

      acc.current += detail.diff / 5

      // <Instance color='red' scale={2} position={[1, 2, 3]} rotation={[Math.PI / 3, 0, 0]} onClick={onClick} />
      // o3.scale.z += detail.diff / 5
    }
    hh({ detail: { diff: 0 } })
    window.addEventListener('moveZooming', hh)
    return () => {
      window.removeEventListener('moveZooming', hh)
    }
  }, [o3.scale])
  useFrame(() => {
    vAcc.current = MathUtils.lerp(vAcc.current, acc.current, 0.1)

    let arr = []

    let i = 0
    for (let y = 0; y < 200; y++) {
      for (let x = 0; x < 5; x++) {
        //
        //

        let ey = y / 200
        arr.push(
          <group rotation={[0, 0, vAcc.current * 3.2 * (y / 200)]} key={i + 'key_key'}>
            <Instance
              rotation={[(vAcc.current * y) / 50, 0, vAcc.current * 0.11 * 1.14]}
              position={[0.001 * (i - 50) * vAcc.current, 0, 0]}
              scale={[0.005, ey * 2.5, ey * 2.5]}
              key={'card' + i}
            ></Instance>
          </group>,
        )

        i++
        //
        //
      }
    }

    setItems(arr)
  })
  useEffect(() => {
    let hh = () => {}
    window.addEventListener('stopZooming', hh)
    return () => {
      window.removeEventListener('stopZooming', hh)
    }
  }, [])

  useFrame(() => {
    //
    if (ref.current) {
      ref.current.position.lerp(o3.position, 0.15)
    }
  })
  let map = useTexture('/thekiss-art/4k-thekiss.jpg')
  map.encoding = sRGBEncoding
  map.colorSpace = SRGBColorSpace

  //

  //
  return (
    <>
      <Instances
        limit={500} // Optional: max amount of items (for calculating buffer size)
        range={500} // Optional: draw-range
      >
        <boxGeometry />
        <meshStandardMaterial map={map} />

        <group>
          <group>{items}</group>
        </group>
      </Instances>
      {/* <group ref={ref}>{items.map((r) => r.gui)}</group> */}
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
                          roughness={0.1}
                          thickness={1.5}
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
