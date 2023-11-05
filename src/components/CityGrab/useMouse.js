import {
  Color,
  ConeGeometry,
  CubicBezierCurve3,
  DoubleSide,
  IcosahedronGeometry,
  MathUtils,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  Ray,
  SphereGeometry,
} from 'three'
import { BoxGeometry } from 'three'
import {
  EquirectangularReflectionMapping,
  Mesh,
  Object3D,
  PlaneGeometry,
  Raycaster,
  Vector3,
  VideoTexture,
  sRGBEncoding,
} from 'three'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { create } from 'zustand'
import { useMouseCache } from './useMouseCache'
import { Clock } from 'three'
// import { Mini } from './Noodle/Mini'
// import { CursorTrackerTail } from './Noodle/CursorTrackerTail'

//
export const useMouse = create((set, get) => {
  return {
    cursor: null,
    stick: null,
    bloomLights: [],
    bloomMeshes: [],
    handID: false,

    collider: useMouseCache.get('collider') || false,
    // handResult: false,
    bones: [],
    scene: false,
    camera: false,
    picking: false,
    activeObjects: [],
    activeUUID: false,
    viewport: false,
    loading: false,
    showStartMenu: true,
    video: false,
    videoTexture: false,
    cleanMini: () => {},
    onLoop: () => {},
    cancel: () => {},
    cleanVideoTexture: () => {},
    eachVideoFrameProc: () => {},
    initVideo: async () => {
      set({ inited: true })
      set({ loading: true })

      let { FilesetResolver, GestureRecognizer, HandLandmarker } = await import('@mediapipe/tasks-vision')

      let video = document.createElement('video')
      video.playsInline = true

      let stream = navigator.mediaDevices.getUserMedia({
        video: {
          width: 256,
          height: 256,
        },
        audio: false,
      })

      stream.then((r) => {
        video.srcObject = r
        video.onloadeddata = () => {
          let videoTexture = new VideoTexture(video)
          videoTexture.encoding = sRGBEncoding
          videoTexture.mapping = EquirectangularReflectionMapping

          let id = 0
          let canRun = true
          let func = () => {
            if (canRun) {
              id = video.requestVideoFrameCallback(func)
            }
            videoTexture.needsUpdate = true
            get().eachVideoFrameProc({ video })
          }
          id = video.requestVideoFrameCallback(func)

          get().cancel()
          set({
            cancel: () => {
              let recogizer = get().recogizer
              if (recogizer?.close) {
                recogizer.close()
              }
              canRun = false
            },
            videoTexture: videoTexture,
            video: video,
          })
          set({ loading: false, showStartMenu: false })
        }
        video.play()
      })

      const handCount = 2

      // Create task for image file processing:
      const vision = await FilesetResolver.forVisionTasks(
        // path/to/wasm/root
        '/mouse/gesture-vision_wasm-v-0.10.4',
      )
      const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: '/mouse/gesture-vision_wasm-v-0.10.4/gesture_recognizer.task',
          delegate: 'GPU',
        },
        numHands: handCount,
        runningMode: 'VIDEO',
      })

      setTimeout(() => {
        gestureRecognizer.setOptions({ baseOptions: { delegate: 'GPU' }, numHands: handCount, runningMode: 'VIDEO' })
        console.log('Set to GPU')
      }, 100)

      set({ recogizer: gestureRecognizer })

      set({
        eachVideoFrameProc: () => {
          let video = get().video
          let recogizer = get().recogizer
          if (video && recogizer) {
            let nowInMs = Date.now()
            let result = recogizer.recognizeForVideo(video, nowInMs, {
              rotationDegrees: 0,
            })
            set({ handResult: result })
          }
        },
      })

      class MyHand {
        constructor({}) {
          this.onHandList = []
          this.scan = new Object3D()
          this.o3d = new Object3D()
          this.redBall = new Mesh(
            new SphereGeometry(5, 4, 2),
            new MeshPhysicalMaterial({ color: new Color(`#00ffff`), flatShading: true, roughness: 0, metalness: 1 }),
          )
          this.redBall.geometry.translate(0, 5, 0)
          this.redBall.geometry.scale(1, 4, 1)
          this.redBall.geometry.scale(0.8, 0.8, 0.8)
          this.o3d.add(this.redBall)

          {
            let clock = new Clock()
            setInterval(() => {
              let t = clock.getElapsedTime()
              this.redBall.rotation.y = t * 3
              this.redBall.position.y = Math.sin(t * 3 * 2) * 5
            }, 16)
          }
          this.redBall.visible = false
          this.raycastToFloor = [0, 0, 0]

          let stick = new Mesh(new BoxGeometry(0.1, 0.1, 200), new MeshBasicMaterial({ color: 0xffff00 }))
          this.stick = stick
          this.o3d.add(stick)
          stick.geometry.translate(0, 0, 200 / 2)
          stick.direction = new Vector3()

          let crystal = new MeshPhysicalMaterial({ color: '#0000ff', metalness: 1, roughness: 0 })
          this.dots = []
          for (let i = 0; i < 20; i++) {
            let mesh = new Mesh(new IcosahedronGeometry(0.1, 1), crystal)
            this.dots.push({
              mesh,
              dir: new Vector3(),
            })
            this.o3d.add(mesh)
          }

          // let goal = new Object3D()

          this.useHand = create((set, get) => {
            return {}
          })

          let target = this
          let getH = this.useHand.getState
          let setH = this.useHand.setState

          this.eventHandlers = {}
          this.on = (event, fnc) => {
            this.eventHandlers[event] = this.eventHandlers[event] || []
            this.eventHandlers[event].push(fnc)
          }

          this.change = (key, val) => {
            setH((s) => {
              if (s[key] === val) {
                return { ...s }
              }
              //

              let beforeState = { ...s }
              let afterState = { ...s, [key]: val }

              this.eventHandlers[key]?.forEach((fnc) => {
                fnc({
                  //
                  target: target,

                  //
                  key,

                  val: val,
                  before: s[key],

                  //
                  afterState,
                  beforeState,
                })
              })

              return afterState
            })
          }
          let camera = get().camera

          let clock = new Clock()
          this.raycaster = new Raycaster()
          this.lastFloorPt = new Vector3()
          let handPos3 = new Vector3()
          let camGP = new Vector3()

          this.update = ({ landmarks, worldLandmarks, gestures, handednesses, video }) => {
            let viewport = get().viewport
            let vp = viewport.getCurrentViewport()
            if (vp) {
              let lmk = landmarks[0]
              // let vpx = (lmk.x * 2.0 - 1.0) * vp.width
              // let vpy = (lmk.y * 2.0 - 1.0) * vp.height
              // let vpz = lmk.z

              for (let bone = 0; bone < this.dots.length; bone++) {
                let dotMesh = this.dots[bone].mesh
                let wmk = worldLandmarks[bone]

                let castedScreenSpace = new Vector3()
                if (camera) {
                  this.raycaster.setFromCamera(
                    {
                      x: ((1.0 - lmk.x) * 2.0 - 1.0) * 2.0,
                      y: ((1.0 - lmk.y) * 2.0 - 1.0) * 2.0,
                    },
                    camera,
                  )

                  this.stick.position.set(0, 0, 0)
                  this.stick.lookAt(this.raycaster.ray.direction)
                  camera.getWorldPosition(camGP)
                  this.stick.position.copy(camGP)

                  let res = []
                  let scene = get().scene
                  let screenHand = scene.getObjectByName('screenHand')

                  if (screenHand) {
                    this.raycaster.intersectObjects([screenHand], true, res)

                    if (res[0]) {
                      let yo = res[0].point
                      castedScreenSpace.set(-wmk.x, -wmk.y, wmk.z).multiplyScalar(10)
                      castedScreenSpace.add(yo)

                      dotMesh.position.lerp(castedScreenSpace, 0.15)
                      dotMesh.visible = false
                    }
                  }
                }
              }

              {
                // this.stick.position.copy(this.dots[9].mesh.position)
                // this.stick.lookAt(
                //   //!SECTION
                //   this.dots[9].mesh.position.x,
                //   this.dots[9].mesh.position.y,
                //   this.dots[9].mesh.position.z - 5,
                // )

                // this.stick.getWorldDirection(this.dots[9].dir)
                // this.raycaster.set(this.dots[9].mesh.position, this.dots[9].dir)

                if (camera) {
                  let dir = new Vector3()

                  handPos3.lerp(this.dots[9].mesh.position, 1)

                  dir.copy(camera.position).sub(handPos3).negate().normalize()

                  this.raycaster.set(handPos3, dir)

                  let res = []
                  let scene = get().scene
                  let hover = scene.getObjectByName('hoverFloor')
                  if (hover) {
                    this.raycaster.intersectObjects([hover], true, res)

                    if (res[0]) {
                      let yo = res[0].point

                      this.raycastToFloor = yo.toArray()

                      if (this.lastFloorPt.length() !== 0) {
                        this.change('delta', yo.clone().sub(this.lastFloorPt))
                      }
                      this.redBall.position.x = yo.x
                      this.redBall.position.y = yo.y
                      this.redBall.position.z = yo.z
                      this.lastFloorPt.copy(yo)
                    } else {
                    }
                  }
                }

                let opt = []
                let scene = get().scene
                let groupCast = scene.getObjectByName('groupCast')
                if (groupCast) {
                  opt.push(groupCast)
                }

                let castRes = this.raycaster.intersectObjects(opt, true)

                if (castRes && castRes[0]) {
                  this.change('found', [castRes[0]])
                } else {
                  this.change('found', [])
                }
              }

              //
              {
                let isGrabbing = gestures[0]?.categoryName === 'Closed_Fist'
                let isOpenPalm = gestures[0]?.categoryName === 'Open_Palm'

                if (isGrabbing === true) {
                  this.change('pinch', true)
                }
                if (isOpenPalm === true) {
                  this.change('pinch', false)
                }
              }

              //
            }
          }
        }
      }

      let myHands = []
      for (let i = 0; i < handCount; i++) {
        let isPinching = false

        let hand = new MyHand({})

        hand.on('found', ({ key, val, before, beforeState, afterState }) => {
          if (before?.length > 0) {
            before.forEach((it) => {
              it.object.material.emissive = new Color('#000000')
              it.object.material.emissiveIntensity = 0
            })
          }
          if (val?.length > 0) {
            val.forEach((it) => {
              if (it?.object?.userData?.noGlow) {
                return
              }
              it.object.material.emissive = new Color('#00ff00')
              it.object.material.emissiveIntensity = 3
            })
          }
        })

        hand.on('pinch', ({ key, val, before, beforeState, afterState }) => {
          isPinching = val
          hand.onHandList = beforeState['found']
        })

        hand.on('delta', ({ key, val, before, beforeState, afterState }) => {
          if (isPinching) {
            hand.onHandList.forEach((it) => {
              let hasFound = false
              if (it?.object?.userData?.dragGroup) {
                hasFound = true
                it.object.position.fromArray(hand.raycastToFloor)
              }

              it.object.traverseAncestors((ite) => {
                if (ite?.userData?.dragGroup && !hasFound) {
                  hasFound = true
                  ite.position.fromArray(hand.raycastToFloor)
                }
              })
              // it.object.position.lerp(get().raycastToFloor, 0.1)
            })
          }
        })

        myHands.push(hand)
      }

      set({
        handsInsert: myHands.map((h) => {
          return <primitive key={h.o3d.uuid} object={h.o3d}></primitive>
        }),

        /*
          myHands.map((h) => {
            return <primitive key={h.redBall.uuid} object={h.redBall}></primitive>
          })
        */
        redBallInsert: null,

        onLoop: () => {
          let result = get().handResult
          let video = get().video

          // castedScreenSpace

          myHands.forEach((eHand, idx) => {
            if (result?.landmarks[idx]) {
              eHand.change('show', true)
              eHand.o3d.visible = true
              eHand.redBall.visible = true
              eHand.update({
                video,
                result,
                gestures: result.gestures[idx],
                landmarks: result.landmarks[idx],
                worldLandmarks: result.worldLandmarks[idx],
              })
            } else {
              eHand.change('show', false)
              eHand.o3d.visible = false
              eHand.redBall.visible = false
            }
          })
        },
      })

      let dragPlane = new Mesh(
        new PlaneGeometry(1000, 1000, 3, 3),
        new MeshBasicMaterial({ color: 0x000000, wireframe: true, transparent: true, opacity: 1.0 }),
      )
      dragPlane.visible = false
      dragPlane.position.z = -10
      get().camera.add(dragPlane)
      get().scene.add(get().camera)
    },
  }
})
