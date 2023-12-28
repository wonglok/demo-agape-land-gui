import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useFingers } from './useFingers'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Environment, Instance, Instances, OrbitControls, Text, useTexture } from '@react-three/drei'
import {
  BoxGeometry,
  Clock,
  DoubleSide,
  IcosahedronGeometry,
  InstancedMesh,
  MathUtils,
  Object3D,
  PlaneGeometry,
  SRGBColorSpace,
  SphereGeometry,
  Vector3,
  sRGBEncoding,
} from 'three'
import { YoEnv } from '../Common/YoEnv'

export function PinchDragGestures() {
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
        <YoEnv background files={`/Handlandmark/room.hdr`}></YoEnv>

        <MyHandLandmarks></MyHandLandmarks>
        <PinchCompos></PinchCompos>
        <OrbitControls object-position={[0, 0, 20]} target={[0, 0, 0]} makeDefault></OrbitControls>
      </>
    </>
  )
}

function Compute({ children, scale = () => [1, 1, 1], position = () => [0, 0, 0], rotation = () => [0, 0, 0] }) {
  let ref = useRef()

  useFrame(() => {
    //
    let it = ref.current
    if (it) {
      //
      it.position.fromArray(position())
      it.scale.fromArray(scale())
      let rot = rotation()
      it.rotation.x = rot[0]
      it.rotation.y = rot[1]
      it.rotation.z = rot[2]
    }
  })

  return <group ref={ref}>{children}</group>
}

function PinchCompos() {
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
  let lAcc = useRef(1)
  let vAcc = useRef(1)

  //
  useEffect(() => {
    let hh = ({ detail }) => {
      console.log('moveZooming', detail)

      lAcc.current += detail.diff * 10.0

      // <Instance color='red' scale={2} position={[1, 2, 3]} rotation={[Math.PI / 3, 0, 0]} onClick={onClick} />
      // o3.scale.z += detail.diff / 5
    }
    hh({ detail: { diff: 0 } })
    window.addEventListener('moveZooming', hh)
    return () => {
      window.removeEventListener('moveZooming', hh)
    }
  }, [])

  useFrame(() => {
    vAcc.current = MathUtils.lerp(vAcc.current, lAcc.current, 0.05)
  })

  let pinchAcc = useRef(new Vector3())
  let pinchAccTarget = useRef(new Vector3())
  useFrame(() => {
    pinchAcc.current.lerp(pinchAccTarget.current, 0.05)
  })
  let init = useMemo(() => {
    return new Vector3()
  }, [])
  let delta = useMemo(() => {
    return new Vector3()
  }, [])
  let accu = useMemo(() => {
    return new Vector3()
  }, [])
  useEffect(() => {
    let hh = ({ detail }) => {
      init.copy(detail.position)
      delta.set(0, 0, 0)
      accu.set(0, 0, 0)
      console.log('startPinching', detail.position)
    }

    window.addEventListener('startPinching', hh)
    return () => {
      window.removeEventListener('startPinching', hh)
    }
  }, [accu, delta, init])
  useEffect(() => {
    let clock = new Clock()
    let hh = ({ detail }) => {
      delta.copy(init).sub(detail.position)
      console.log('movePinching', detail)
      accu.add(delta)

      let dt = clock.getDelta()

      pinchAccTarget.current.addScaledVector(delta, dt * 1.0)

      console.log(delta.length())
    }
    window.addEventListener('movePinching', hh)
    return () => {
      window.removeEventListener('movePinching', hh)
    }
  }, [accu, delta, init])

  useEffect(() => {
    let hh = ({ detail }) => {
      // clean up
      init.set(0, 0, 0)
      console.log('stopPinching', detail)
    }
    window.addEventListener('stopPinching', hh)
    return () => {
      window.removeEventListener('stopPinching', hh)
    }
  }, [accu, delta, init])

  let totalY = 20
  let totalX = 20

  useEffect(() => {
    let arr = []

    let halfY = totalY / 2
    let halfX = totalX / 2
    let i = 0

    let myPinchAcc = pinchAcc.current
    for (let y = -totalY; y < halfY; y++) {
      for (let x = -halfX; x < halfX; x++) {
        let eachX = x / (halfX + 1)
        let eachY = y / (halfY + 1 + totalY)
        let pi = Math.PI

        let vv = {
          idx: i,
          totalY,
          totalX,
          eachY,
          eachX,
          halfY: halfY,
          halfX: halfX,
          get zoomValue() {
            return vAcc.current * 0.5
          },
          get pinchValueX() {
            return myPinchAcc.x
          },
          get pinchValueY() {
            return myPinchAcc.y
          },
          get pinchValueZ() {
            return myPinchAcc.z
          },
          get t() {
            return window.performance.now() / 1000
          },
          get color() {
            return `#888`
          },
        }

        let circle = (vv.eachY * vv.eachX) / Math.PI

        arr.push(
          <group rotation={[0, 0, 0]} position={[0, 5.5, 0]} key={i + x + y + 'key_key'}>
            <Compute position={() => [x, y, 0]}>
              <Compute rotation={() => [vv.pinchValueY, vv.pinchValueX, vv.pinchValueZ]}>
                <Compute rotation={() => [0, circle * vv.zoomValue * pi * 2, 0]}>
                  <Instance color={vv.color}></Instance>
                </Compute>
              </Compute>
            </Compute>
          </group>,
        )

        i++
        //
        //
      }
    }

    setItems(arr)
  }, [])

  useEffect(() => {
    let hh = () => { }
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

  //
  let map = useTexture(`/reel/life2.png`)
  map.encoding = sRGBEncoding
  map.colorSpace = SRGBColorSpace
  //

  //
  let geo = useMemo(() => {
    // return new PlaneGeometry(1, 1)
    let sh = new SphereGeometry(1 / 2, 32)

    return sh
  }, [])
  //
  return (
    <>
      <Instances
        geometry={geo}
        limit={1500} // Optional: max amount of items (for calculating buffer size)
        range={1500} // Optional: draw-range
      >
        <meshPhysicalMaterial
          side={DoubleSide}
          roughness={0.5}
          metalness={0.5}
          map={map}
          metalnessMap={map}
          roughnessMap={map}
          transparent
        />

        <group>
          <group>{items}</group>
        </group>
      </Instances>
      {/* <group ref={ref}>{items.map((r) => r.gui)}</group> */}
    </>
  )
}

function MyHandLandmarks() {
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
                        <meshPhysicalMaterial roughness={0.1} flatShading color={finger.color}></meshPhysicalMaterial>
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
