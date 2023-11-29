import { Color, EquirectangularReflectionMapping, Vector3, VideoTexture, sRGBEncoding } from 'three'
import { create } from 'zustand'
import { INDEX_FINGER_TIP, THUMB_TIP } from './FigerNames'

let positionMap = new Map()
let colorMap = new Map()
export const useFingers = create((set, get) => {
  let onLoop = (v) => {
    get().tasks.push(v)
  }
  let lastVideoTime = 0
  return {
    bothHovering: false,
    isZooming: false,

    initPinchDist: 0,
    //
    viewport: { width: 1, height: 1 },

    video: false,
    cancelVideoSetup: () => {},
    tasks: [],
    onLoop: onLoop,

    handednesses: [],
    landmarks: [],
    worldLandmarks: [],
    //

    isPinchingOneHand: false,
    //
    eachVideoFrameProc: () => {
      let video = get().video
      let handLandmarker = get().handLandmarker

      if (!video) {
        return
      }

      if (!handLandmarker) {
        return
      }

      let startTimeMs = performance.now()
      if (lastVideoTime !== video.currentTime) {
        if (!(video.videoWidth > 0 && video.videoHeight > 0)) {
          return
        }

        lastVideoTime = video.currentTime

        let results = handLandmarker.detectForVideo(video, startTimeMs)
        let { handednesses, landmarks, worldLandmarks } = results

        set({
          handednesses: handednesses || [],
          landmarks: landmarks || [],
          worldLandmarks: worldLandmarks || [],
        })

        let sides = handednesses.map((r) => {
          return r[0]?.categoryName?.toLowerCase()
        })

        let bothHovering = sides.includes('left') && sides.includes('right')

        let anyOneHovering = sides.includes('left') || sides.includes('right')

        landmarks = landmarks || []
        landmarks.forEach((hand, hidx) => {
          hand.forEach((finger, fidx, fingers) => {
            //
            finger.color = finger.color || new Color('#ffffff')

            finger.type = fidx
            finger.position = finger.position || new Vector3()
            finger.position.fromArray([
              //
              -(finger.x * 2.0 - 1.0) * 5 * (video.videoWidth / video.videoHeight),
              -(finger.y * 2.0 - 1.0) * 5 * 1,
              -finger.z * 5,
            ])
          })

          return hand
        })

        landmarks.forEach((hand, hidx) => {
          hand.forEach((finger) => {
            finger.color.set('#ffffff')
          })

          let idxT = hand[INDEX_FINGER_TIP]
          let thbT = hand[THUMB_TIP]

          hand.pinchDist = idxT?.position?.distanceTo(thbT?.position)

          if (idxT?.position?.distanceTo(thbT?.position) <= 1) {
            idxT.color.set('#ff0000')
            thbT.color.set('#ff0000')

            hand.isPinching = true
          } else {
            hand.isPinching = false
          }

          //
          return hand
        })

        if (get().bothHovering !== bothHovering) {
          set({
            bothHovering,
          })
        }
        if (get().anyOneHovering !== anyOneHovering) {
          set({
            anyOneHovering,
          })
        }

        if (anyOneHovering && landmarks[0]) {
          //
          let isPinchingOneHand = landmarks.filter((r) => r.isPinching)?.length >= 1.0

          let pinchPos = new Vector3()
            .add(landmarks[0][INDEX_FINGER_TIP]?.position)
            .add(landmarks[0][THUMB_TIP]?.position)
            .multiplyScalar(0.5)

          // console.log(pinchPos)
          if (isPinchingOneHand === true && get().isPinchingOneHand === false) {
            set({
              initPinchPos: pinchPos.clone(),
            })

            window.dispatchEvent(
              new CustomEvent('startPinching', {
                detail: {
                  //
                  position: pinchPos.clone(),
                },
              }),
            )
          } else if (isPinchingOneHand === true && get().isPinchingOneHand === true) {
            window.dispatchEvent(
              new CustomEvent('movePinching', {
                detail: {
                  //
                  expand: pinchPos.clone().divide(get().initPinchPos.clone()),
                  diff: pinchPos.clone().sub(get().pinchPos.clone()),
                  position: pinchPos.clone(),
                },
              }),
            )
          } else if (get().isPinchingOneHand === true && isPinchingOneHand === false) {
            window.dispatchEvent(
              new CustomEvent('stopPinching', {
                detail: {
                  //
                  position: pinchPos.clone(),
                },
              }),
            )
            set({
              initPinchPos: new Vector3(),
            })
          }

          set({ pinchPos: pinchPos })

          if (get().isPinchingOneHand !== isPinchingOneHand) {
            set({
              isPinchingOneHand,
            })
          }
        }

        if (bothHovering && landmarks[0] && landmarks[1]) {
          let isZooming = landmarks.filter((r) => r.isPinching)?.length >= 2.0

          let pinchDist = landmarks[0][INDEX_FINGER_TIP]?.position.distanceTo(landmarks[1][INDEX_FINGER_TIP]?.position)

          if (isZooming === true && get().isZooming === false) {
            set({
              initPinchDist: pinchDist,
            })

            window.dispatchEvent(
              new CustomEvent('startZooming', {
                detail: {
                  //
                  dist: pinchDist,
                },
              }),
            )
          } else if (isZooming === true && get().isZooming === true) {
            window.dispatchEvent(
              new CustomEvent('moveZooming', {
                detail: {
                  //
                  expand: pinchDist / get().initPinchDist,
                  diff: pinchDist - get().pinchDist,
                  dist: pinchDist,
                },
              }),
            )
          } else if (get().isZooming === true && isZooming === false) {
            window.dispatchEvent(
              new CustomEvent('stopZooming', {
                detail: {
                  //
                  dist: pinchDist,
                },
              }),
            )
            set({
              initPinchDist: 0,
            })
          }

          set({ pinchDist: pinchDist })

          if (get().isZooming !== isZooming) {
            set({
              isZooming,
            })
          }
        }
      }
    },
    setup: async () => {
      //
      let video = document.createElement('video')
      video.playsInline = true
      video.autoplay = true

      let stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 256 * (16 / 9),
          height: 256,
        },
        audio: false,
      })
      set({ video: video })

      video.srcObject = stream
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
          get().eachVideoFrameProc()
        }
        id = video.requestVideoFrameCallback(func)

        get().cancelVideoSetup()
        set({
          cancelVideoSetup: () => {
            canRun = false
          },
          videoTexture: videoTexture,
          video: video,
        })
        set({ loading: false, showStartMenu: false })
      }
      video.play()

      let { FilesetResolver, HandLandmarker } = await import('@mediapipe/tasks-vision')

      let vision = await FilesetResolver.forVisionTasks(`/Handlandmark/wasm`)

      let handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `/Handlandmark/hand_landmarker.task`,
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 2,
      })
      video.onplaying = async () => {
        await handLandmarker.setOptions({ runningMode: 'VIDEO', baseOptions: { delegate: 'GPU' } })
        set({ handLandmarker })
      }
      set({ handLandmarker })

      //  public/Handlandmark/hand_landmarker.task
    },
    gui3d: <></>,
    gui2d: <></>,
    //
  }
})
