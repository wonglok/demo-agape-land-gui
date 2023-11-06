import { Html, OrbitControls, PerspectiveCamera, Sphere, useGLTF } from '@react-three/drei'
import { createPortal, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Object3D } from 'three'
import { Collider } from '../../../main.jsx'
import { Mouse3D } from '../../../main.jsx'
import { AvaZoom } from '../../../main.jsx'
import { BirdCamSync } from '../../../main.jsx'
import { AvatarGuide } from '../../../main.jsx'
import { LoaderGLB } from '../../../main.jsx'
import { clone } from '../../../main.jsx'
//
export function BirdWalk({ useStore }) {
  let colliderGLBURL = useStore((r) => r.colliderGLBURL)
  let gl = useThree((r) => r.gl)
  let mounter = useRef(gl.domElement)
  useEffect(() => {
    mounter.current = gl.domElement
  }, [gl])

  return (
    <>
      {colliderGLBURL && mounter && (
        <LoaderGLB
          url={`${colliderGLBURL}`}
          decorate={({ glb }) => {
            glb.scene.traverse((it) => {
              if (it.isLight) {
                it.visible = false
              }
            })
          }}
          animate={true}
          WhenDone={({ glb }) => {
            glb.scene.traverse((it) => {
              it.castShadow = true
              it.receiveShadow = true
            })

            useEffect(() => {
              useStore.setState({
                colliderGLBObjectSrc: colliderGLBURL,
              })
            }, [glb])

            return <Internal useStore={useStore} mounter={mounter} glb={glb}></Internal>
          }}
        ></LoaderGLB>
      )}
    </>
  )
}

function Internal({ useStore, mounter, glb, fromPos = [0, 0, 0] }) {
  let gl = useThree((s) => s.gl)
  let camera = useThree((s) => s.camera)
  let controls = useThree((r) => r.controls)

  let avatarUrl = `/agape-sdk/glb/lok-groom.glb`
  let destObj = useMemo(() => {
    let dd = new Object3D()
    dd.position.y = 2.0
    return dd
  }, [])

  let colliderScene = useMemo(() => {
    let o3 = new Object3D()
    let clonedScene = clone(glb.scene)
    o3.add(clonedScene)

    return o3
  }, [glb.scene])

  return (
    <>
      <PerspectiveCamera
        position={[fromPos[0], fromPos[1] + 25, fromPos[2] + 25]}
        near={1}
        far={150}
        fov={50}
        makeDefault
      ></PerspectiveCamera>
      <OrbitControls
        makeDefault
        args={[camera, gl.domElement]}
        enableRotate={false}
        enablePan={false}
        maxDistance={100}
        target={fromPos}
      ></OrbitControls>
      {/*  */}
      <Collider
        scene={colliderScene}
        YoReady={({ collider }) => {
          return (
            <group>
              <AvatarGuide
                offset={[0, 0, 0]}
                chaseDist={1}
                speed={2}
                destObj={destObj}
                collider={collider}
                avatarUrl={avatarUrl}
                onACore={(aCore) => {
                  if (controls) {
                    controls.object.position.set(fromPos[0], fromPos[1] + 15, fromPos[2] + 15)
                    controls.target.fromArray(fromPos)
                  }

                  aCore.player.position.fromArray(fromPos)
                  destObj.position.fromArray(fromPos)

                  return (
                    <group>
                      <BirdCamSync player={aCore.player}></BirdCamSync>
                    </group>
                  )
                }}
              ></AvatarGuide>

              <AvaZoom mounter={mounter} mouse3d={destObj}></AvaZoom>

              <GateMousee collider={collider} mouse3d={destObj}></GateMousee>

              {/*  */}

              {createPortal(
                <>
                  <Sphere scale={0.3}>
                    <meshPhysicalMaterial roughness={0} metalness={1} color={'#ffffff'}></meshPhysicalMaterial>
                  </Sphere>
                </>,
                destObj,
              )}

              <group position={[0, 0, 0]}>
                <primitive object={colliderScene}></primitive>
                <primitive object={destObj}></primitive>
              </group>
            </group>
          )
        }}
      ></Collider>
    </>
  )
}

function GateMousee({ mouse3d, collider }) {
  return <Mouse3D collider={collider} mouse3d={mouse3d}></Mouse3D>
}
