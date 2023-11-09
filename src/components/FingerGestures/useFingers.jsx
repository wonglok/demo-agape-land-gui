import { EquirectangularReflectionMapping, VideoTexture, sRGBEncoding } from 'three'
import { create } from 'zustand'

export const useFingers = create((set, get) => {
  return {
    //
    gui2d: <></>,
    video: false,
    cancelVideoSetup: () => {},
    setupVideo: async () => {
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
          get().eachVideoFrameProc({ video })
        }
        id = video.requestVideoFrameCallback(func)

        get().cancelVideoSetup()
        set({
          cancelVideoSetup: () => {
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

      set({ video: video })

      let { FilesetResolver, GestureRecognizer, HandLandmarker } = await import('@mediapipe/tasks-vision')
    },
    gui3d: <></>,
    //
  }
})
