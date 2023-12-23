import { useEffect } from 'react'
import * as THREE from 'three'
import { GPURun } from '../EmpireVFX/Run/DynamicGPU/GPURun'

class AlvaARConnectorTHREE {
  static Initialize(THREE) {
    return (pose, rotationQuaternion, translationVector) => {
      const m = new THREE.Matrix4().fromArray(pose)
      const r = new THREE.Quaternion().setFromRotationMatrix(m)
      const t = new THREE.Vector3(pose[12], pose[13], pose[14])

      rotationQuaternion !== null && rotationQuaternion.set(-r.x, r.y, r.z, r.w)
      translationVector !== null && translationVector.set(t.x, -t.y, -t.z)
    }
  }
}

class ARCamView {
  //
  constructor(container, width, height, x = 0, y = 0, z = -10, scale = 1.0) {
    this.applyPose = AlvaARConnectorTHREE.Initialize(THREE)

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setClearColor(0, 0)
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(window.devicePixelRatio)

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    this.camera.rotation.reorder('YXZ')
    this.camera.updateProjectionMatrix()

    this.object = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1, 2),
      new THREE.MeshNormalMaterial({ flatShading: true }),
    )
    this.object.scale.set(scale, scale, scale)
    this.object.position.set(x, y, z)
    this.object.visible = false

    this.scene = new THREE.Scene()
    this.scene.add(this.object)

    this.gpu = new GPURun({ gl: this.renderer })
    this.scene.add(this.gpu)
    this.scene.add(new THREE.AmbientLight(0x808080))
    this.scene.add(new THREE.HemisphereLight(0x404040, 0xf0f0f0, 1))
    this.scene.add(this.camera)

    container.appendChild(this.renderer.domElement)

    let clock = new THREE.Clock()
    const render = () => {
      requestAnimationFrame(render.bind(this))
      let dt = clock.getDelta()
      this.gpu.run({}, dt)
      this.renderer.render(this.scene, this.camera)
    }

    render()
  }

  updateCameraPose(pose) {
    this.applyPose(pose, this.camera.quaternion, this.camera.position)

    this.object.visible = true
    this.gpu.visible = fatruelse
  }

  lostCamera() {
    this.object.visible = false
    this.gpu.visible = false
  }
}

async function main() {
  let { Stats } = await window.remoteImport('/slam-ar/assets/stats.js')
  let { AlvaAR } = await window.remoteImport('/slam-ar/assets/alva_ar.js')
  // let { ARCamView } = await window.remoteImport('/slam-ar/assets/view.js')
  let { Camera, onFrame, resize2cover } = await window.remoteImport('/slam-ar/assets/utils.js')

  const config = {
    video: {
      facingMode: 'environment',
      aspectRatio: 16 / 9,
      width: { ideal: 1280 },
    },
    audio: false,
  }

  const $container = document.getElementById('container')
  const $view = document.createElement('div')
  const $canvas = document.createElement('canvas')
  const $overlay = document.getElementById('overlay')
  const $start = document.getElementById('start_button')
  const $splash = await new Promise((resolve) => {
    let ttt = setInterval(() => {
      let splash = document.getElementById('splash')
      if (splash) {
        clearInterval(ttt)
        resolve(splash)
      }
    }, 100)
  })
  const splashFadeTime = 800

  $splash.style.transition = `opacity ${splashFadeTime / 1000}s ease`
  $splash.style.opacity = 0

  async function demo(media) {
    const $video = media.el

    const size = resize2cover($video.videoWidth, $video.videoHeight, $container.clientWidth, $container.clientHeight)

    $canvas.width = $container.clientWidth
    $canvas.height = $container.clientHeight
    $video.style.width = size.width + 'px'
    $video.style.height = size.height + 'px'

    const ctx = $canvas.getContext('2d', { alpha: false, desynchronized: true })
    const alva = await AlvaAR.Initialize($canvas.width, $canvas.height)
    const view = new ARCamView($view, $canvas.width, $canvas.height)

    Stats.add('total')
    Stats.add('video')
    Stats.add('slam')

    $container.appendChild($canvas)
    $container.appendChild($view)

    document.body.appendChild(Stats.el)
    document.body.addEventListener('click', () => alva.reset(), false)

    /** @type {HTMLVideoElement} */
    let vid = $video

    let SLAMFFrame = () => {
      Stats.next()
      Stats.start('total')

      ctx.clearRect(0, 0, $canvas.width, $canvas.height)

      if (!document['hidden']) {
        Stats.start('video')
        ctx.drawImage($video, 0, 0, $video.videoWidth, $video.videoHeight, size.x, size.y, size.width, size.height)
        const frame = ctx.getImageData(0, 0, $canvas.width, $canvas.height)
        Stats.stop('video')

        Stats.start('slam')
        const pose = alva.findCameraPose(frame)
        Stats.stop('slam')

        if (pose) {
          view.updateCameraPose(pose)
        } else {
          view.lostCamera()

          const dots = alva.getFramePoints()

          for (const p of dots) {
            ctx.fillStyle = 'white'
            ctx.fillRect(p.x, p.y, 2, 2)
          }
        }
      }

      Stats.stop('total')
      Stats.render()

      return true
    }

    let hh = () => {
      vid.requestVideoFrameCallback(hh)
      SLAMFFrame()
    }
    vid.requestVideoFrameCallback(hh)

    //
  }

  setTimeout(() => {
    // $splash.remove()
    $splash.style.opacity = 0
    $splash.style.pointerEvents = 'none'

    $start.addEventListener(
      'click',
      () => {
        $overlay.style.opacity = 0
        $overlay.style.pointerEvents = 'none'
        // $overlay.remove()

        Camera.Initialize(config)
          .then((media) => demo(media))
          .catch((error) => alert('Camera ' + error))
      },
      { once: true },
    )
  }, splashFadeTime)
}

export function SlamAR() {
  useEffect(() => {
    setTimeout(() => {
      main()
    }, 100)
  }, [])

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
      * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html,
        body {
            font-family: 'Helvetica', sans-serif;
            overflow: hidden;
            background: #000;
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        #container {
            position: relative;
            width: 100%;
            height: 100%;
            display: block;
            overflow: hidden;
            line-height: 0;
        }

        #container > * {
            position: absolute;
            display: block;
            user-select: none;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            animation: fadeIn 1.2s;
        }

        canvas {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
        }

        #container > video {
            object-fit: cover;
            object-position: 50% 50%;
        }

        #splash {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            opacity: 1;
        }

        #overlay {
            position: absolute;
            font-size: 16px;
            z-index: 2;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            background: rgba(0, 0, 0, 0.5);
        }

        #overlay::before{
            position: absolute;
            width: 100%;
            white-space: pre-wrap;
            content: "Please allow access \A to your camera.";
            top:calc(50% + 50px);
            text-align: center;
            color: #949494;
        }

        #overlay button {
            background: transparent;
            border: 1px solid rgb(255, 255, 255);
            border-radius: 4px;
            color: #ffffff;
            padding: 12px 18px;
            text-transform: uppercase;
            cursor: pointer;
        }

        @keyframes fadeIn {
            0% {
                opacity: 0;
            }
            50% {
                opacity: 0.6;
            }
            100% {
                opacity: 1;
            }
        }

        @media screen and (max-device-width: 480px) and (orientation: landscape) {
            #container {
                display: none;
            }

            body::before {
                content: "Rotate device to portrait mode.";
                color: white;
            }
        }

        @media screen and (max-device-width: 480px) and (orientation: portrait) {
            #container {
                display: block;
            }

            body::before {
                content: none;
            }
        }
    `,
        }}
      ></style>

      <div id='container'></div>
      <div id='overlay'>
        <button id='start_button'>Start</button>
        <div id='splash'></div>
      </div>

      {/*  */}
      {/* <a href='/slam-ar/camera.html' target='_blank' rel='noopener noreferrer'>
        SLAM AR
      </a> */}

      {/*  */}
    </>
  )
}
