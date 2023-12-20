import { BoxGeometry, Clock, FloatType, HalfFloatType, Mesh, Object3D, Raycaster, Vector2, Vector3 } from 'three'

import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer'
import { posSimShader } from './simulation/posSimShader'
import { velSimShader } from './simulation/velSimShader'
import { RenderGPU } from './render/RenderGPU'
import { accSimShader } from './simulation/accSimShader'
import { useMic } from './mic/histroymic'

export class GPURun extends Object3D {
  constructor({ gl }) {
    super()

    this.works = []

    this.size = new Vector2(512, 512)

    this.gl = gl
    this.gpu = new GPUComputationRenderer(this.size.x, this.size.y, this.gl)

    this.gpu.setDataType(FloatType)

    this.iTex = {
      posSim: this.gpu.createTexture(),
      velSim: this.gpu.createTexture(),
      accSim: this.gpu.createTexture(),
    }

    this.preProcess()
    this.iVars = {
      posSim: this.gpu.addVariable('posSim', posSimShader, this.iTex.posSim),
      velSim: this.gpu.addVariable('velSim', velSimShader, this.iTex.velSim),
      accSim: this.gpu.addVariable('accSim', accSimShader, this.iTex.accSim),
    }

    this.gpu.setVariableDependencies(this.iVars.posSim, [this.iVars.posSim, this.iVars.accSim, this.iVars.velSim])
    this.gpu.setVariableDependencies(this.iVars.velSim, [this.iVars.velSim, this.iVars.accSim, this.iVars.posSim])
    this.gpu.setVariableDependencies(this.iVars.accSim, [this.iVars.accSim, this.iVars.posSim])

    let bug = this.gpu.init()

    if (bug) {
      // console.log(bug)
      return
    }

    this.run = (st, dt) => {
      this.works.forEach((fnc) => {
        fnc(st, dt)
      })
      this.gpu.compute()
    }

    this.onLoop = (v) => {
      this.works.push(v)
    }

    this.render = new RenderGPU({
      size: this.size,
      gpu: this.gpu,
    })
    this.onLoop(() => {
      this.render.uniforms.accSim.value = this.gpu.getCurrentRenderTarget(this.iVars.accSim).texture
      this.render.uniforms.posSim.value = this.gpu.getCurrentRenderTarget(this.iVars.posSim).texture
      this.render.uniforms.velSim.value = this.gpu.getCurrentRenderTarget(this.iVars.velSim).texture
      this.render.uniforms.audioTexture.value = useMic.getState().MicTexture
      this.render.uniforms.time.value = performance.now() //
    })
    this.add(this.render)

    this.iVars.posSim.material.uniforms.mouseNow = { value: new Vector3() }
    this.iVars.velSim.material.uniforms.mouseNow = { value: new Vector3() }
    this.iVars.accSim.material.uniforms.mouseNow = { value: new Vector3() }

    this.iVars.posSim.material.uniforms.mouseLast = { value: new Vector3() }
    this.iVars.velSim.material.uniforms.mouseLast = { value: new Vector3() }
    this.iVars.accSim.material.uniforms.mouseLast = { value: new Vector3() }

    this.iVars.posSim.material.uniforms.audioTexture = { value: null }
    this.iVars.velSim.material.uniforms.audioTexture = { value: null }
    this.iVars.accSim.material.uniforms.audioTexture = { value: null }

    this.iVars.posSim.material.uniforms.dt = { value: 0 }
    this.iVars.velSim.material.uniforms.dt = { value: 0 }
    this.iVars.accSim.material.uniforms.dt = { value: 0 }

    this.iVars.posSim.material.uniforms.time = { value: 0 }
    this.iVars.velSim.material.uniforms.time = { value: 0 }
    this.iVars.accSim.material.uniforms.time = { value: 0 }
    let c = new Clock()

    let lastMouse = new Vector3()
    let raycastMouse = new Vector3()

    let meshRc = new Mesh(new BoxGeometry(100000, 100000, 0.1))
    this.add(meshRc)
    meshRc.visible = false
    let rc = new Raycaster()

    this.onLoop((st, dt) => {
      // rc.setFromCamera(st.mouse, st.camera)
      // meshRc.lookAt(st.camera.position)
      let res = rc.intersectObjects([meshRc], false)

      if (res[0]) {
        raycastMouse.lerp(res[0].point, 1.0)
      }

      let MicTexture = useMic.getState().MicTexture

      this.iVars.posSim.material.uniforms.dt.value = dt
      this.iVars.velSim.material.uniforms.dt.value = dt
      this.iVars.accSim.material.uniforms.dt.value = dt

      let t = c.getElapsedTime()
      this.iVars.posSim.material.uniforms.time.value = t
      this.iVars.velSim.material.uniforms.time.value = t
      this.iVars.accSim.material.uniforms.time.value = t

      if (MicTexture) {
        this.iVars.posSim.material.uniforms.audioTexture.value = MicTexture
        this.iVars.velSim.material.uniforms.audioTexture.value = MicTexture
        this.iVars.accSim.material.uniforms.audioTexture.value = MicTexture
      }

      if (raycastMouse) {
        this.iVars.posSim.material.uniforms.mouseLast.value.copy(lastMouse) // = { value: new Vector3() }
        this.iVars.velSim.material.uniforms.mouseLast.value.copy(lastMouse) // = { value: new Vector3() }
        this.iVars.accSim.material.uniforms.mouseLast.value.copy(lastMouse) // = { value: new Vector3() }

        this.iVars.posSim.material.uniforms.mouseNow.value.copy(raycastMouse) // = { value: new Vector3() }
        this.iVars.velSim.material.uniforms.mouseNow.value.copy(raycastMouse) // = { value: new Vector3() }
        this.iVars.accSim.material.uniforms.mouseNow.value.copy(raycastMouse) // = { value: new Vector3() }

        lastMouse.copy(raycastMouse)
      }
    })

    this.clean = () => {
      //
      Object.values(this.iTex).forEach((it) => {
        it.dispose()
      })
    }
  }

  preProcess() {
    //
    {
      let idx = 0
      for (let y = 0; y < this.size.y; y++) {
        for (let x = 0; x < this.size.x; x++) {
          this.iTex.posSim.image.data[idx * 4 + 0.0] = (Math.random() * 2.0 - 1.0) * 1.0
          this.iTex.posSim.image.data[idx * 4 + 1.0] = (Math.random() * 2.0 - 1.0) * 1.0 + 2
          this.iTex.posSim.image.data[idx * 4 + 2.0] = (Math.random() * 2.0 - 1.0) * 1.0
          this.iTex.posSim.image.data[idx * 4 + 3.0] = 1
          idx++
        }
      }

      this.iTex.posSim.needsUpdate = true
    }

    {
      let idx = 0
      for (let y = 0; y < this.size.y; y++) {
        for (let x = 0; x < this.size.x; x++) {
          this.iTex.velSim.image.data[idx * 4 + 0.0] = (Math.random() * 2.0 - 1.0) * 1.0
          this.iTex.velSim.image.data[idx * 4 + 1.0] = (Math.random() * 2.0 - 1.0) * 1.0
          this.iTex.velSim.image.data[idx * 4 + 2.0] = (Math.random() * 2.0 - 1.0) * 1.0
          this.iTex.velSim.image.data[idx * 4 + 3.0] = 0.0
          idx++
        }
      }

      this.iTex.velSim.needsUpdate = true
    }
    {
      let idx = 0
      for (let y = 0; y < this.size.y; y++) {
        for (let x = 0; x < this.size.x; x++) {
          this.iTex.accSim.image.data[idx * 4 + 0.0] = (Math.random() * 2.0 - 1.0) * 1.0
          this.iTex.accSim.image.data[idx * 4 + 1.0] = (Math.random() * 2.0 - 1.0) * 1.0
          this.iTex.accSim.image.data[idx * 4 + 2.0] = (Math.random() * 2.0 - 1.0) * 1.0
          this.iTex.accSim.image.data[idx * 4 + 3.0] = (Math.random() * 2.0 - 1.0) * 1.0
          idx++
        }
      }

      this.iTex.accSim.needsUpdate = true
    }
  }
}
