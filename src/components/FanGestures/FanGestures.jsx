import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useFingers } from './useFingers'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Environment, Instance, Instances, OrbitControls, Text, useTexture } from '@react-three/drei'
import {
  BoxGeometry,
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
  let acc = useRef(1)
  let vAcc = useRef(1)
  useEffect(() => {
    let hh = ({ detail }) => {
      console.log('moveZooming', detail)

      acc.current += detail.diff * 1.5

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
    vAcc.current = MathUtils.lerp(vAcc.current, acc.current, 0.05)

    let acu = vAcc.current
    let arr = []

    let total = 500
    let half = total / 2
    let i = 0
    for (let y = 0; y < total; y++) {
      let ey = 1 - y / total
      let rey = y / total

      // arr.push(
      //   <group key={i + 'key_key'}>
      //     <group>
      //       <group position={[i * 0.2 - half * 0.25, 0, 0]} rotation={[ey * acu * 3.141592, 0, 0]}>
      //         <Instance position={[0, (i / total) * 5.2, 0]}></Instance>
      //       </group>
      //     </group>
      //   </group>,
      // )

      arr.push(
        <group key={i + 'key_key'}>
          <group position={[0, -2, 0]}>
            <group rotation={[0, 1 * acu * ey, 0]}>
              <group position={[0, acu * ey * 0.5, 5]}>
                <group rotation={[0, 0, ey]}>
                  <Instance key={'card' + i}></Instance>
                </group>
              </group>
            </group>
          </group>
        </group>,
      )

      i++
      //
      //
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
  let geo = useMemo(() => {
    return new BoxGeometry(0.005, 1, 1)
  }, [])
  //
  return (
    <>
      <Instances
        geometry={geo}
        limit={500} // Optional: max amount of items (for calculating buffer size)
        range={500} // Optional: draw-range
      >
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
