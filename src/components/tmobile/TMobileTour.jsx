import { OrbitControls, StatsGl, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { Vector3 } from 'three'
import { useTM } from './useTM'
import { YoMeta } from './RoomView/YoMeta'

export function TMobileTour() {
  let gl = useThree((r) => r.gl)
  let scene = useThree((r) => r.scene)
  let controls = useThree((r) => r.controls)
  let camera = useThree((r) => r.camera)
  let gltf = useGLTF(`/tmobile/r6-t-mobile--1636713668.glb`)
  let displayWorld = useTM((r) => r.displayWorld)
  let game = useTM((r) => r.game)
  useEffect(() => {
    if (!controls) {
      return
    }
    if (!camera) {
      return
    }
    if (!gltf) {
      return
    }
    if (!gl) {
      return
    }
    gltf.scene.traverse((it) => {
      if (it.material) {
        it.material.depthWrite = true
        it.material.depthTest = true
        it.frustumCulled = false
      }
    })
    let game = new YoMeta({
      controls: controls,
      camera: camera,
      scene: gltf.scene,
    })

    controls.object.fov = 55
    controls.object.updateProjectionMatrix()

    let place = {
      startAt: [-0.1, 1.5, 0.1],
      startY: Math.PI * 0.3,
    }

    // rotation :D
    let offset = new Vector3(0, 0, -0.01)
    offset.applyAxisAngle(new Vector3(0, 1, 0), place.startY + 1 * Math.PI)

    game.parseScene({ scene: gltf.scene }).then(() => {
      game.reset = () => {
        let yPos = 2
        game.playerVelocity.set(0, 0, 0)
        game.player.position.set(place.startAt[0], yPos, place.startAt[2])
        game.camera.position.set(place.startAt[0], yPos, place.startAt[2])

        game.controls.target.set(offset.x + place.startAt[0], yPos, offset.z + place.startAt[2] + 0)

        game.player.visible = false
        game.controls.rotateSpeed = -1
        game.player.position.y = yPos

        game.camera.position.sub(game.controls.target)
        game.controls.target.copy(game.player.position)
        game.camera.position.add(game.player.position)
        game.controls.update()
      }

      game.reset()

      useTM.setState({
        displayWorld: (
          <group
          // onClick={(ev) => {
          //   console.log(ev);
          // }}
          >
            <primitive object={gltf.scene}></primitive>
          </group>
        ),
      })

      gl.compile(gltf.scene, camera)

      setTimeout(() => {
        useTM.setState({
          game,
        })
      }, 1000)
    })
    //

    return () => {
      //

      useTM.setState({
        displayWorld: null,
      })
    }
  }, [gltf, camera, scene, gl, controls])

  useFrame((st, dt) => {
    if (dt >= 3 / 60) {
      dt = 3 / 60
    }
    game && game?.update(dt)
  })

  return (
    <>
      {displayWorld}

      <OrbitControls
        minPolarAngle={0.5 * Math.PI}
        maxPolarAngle={0.5 * Math.PI}
        rotateSpeed={0.6}
        object-position={[0, 1.5, 0]}
        makeDefault
        enableZoom={false}
      ></OrbitControls>

      <StatsGl></StatsGl>
    </>
  )
}
