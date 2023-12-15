import { BufferAttribute, BufferGeometry, Color, Object3D, Points, ShaderMaterial } from 'three'
import { fragmentRender } from './fragment'
import { vertexRender } from './vertex'

export class RenderGPU extends Object3D {
  constructor({ size, onLoop, getTexSet }) {
    super()

    this.size = size
    let geometry = new BufferGeometry()
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(128 * 128 * 3), 3))
    geometry.setAttribute('uv', new BufferAttribute(new Float32Array(128 * 128 * 2), 2))

    {
      let idx = 0
      for (let y = 0; y < size.y; y++) {
        for (let x = 0; x < size.x; x++) {
          geometry.attributes.uv.setX(idx, x / size.x)
          geometry.attributes.uv.setY(idx, y / size.y)
          idx++
        }
      }
    }
    {
      let idx = 0
      for (let y = 0; y < size.y; y++) {
        for (let x = 0; x < size.x; x++) {
          geometry.attributes.position.setX(idx, x / size.x)
          geometry.attributes.position.setY(idx, y / size.y)
          geometry.attributes.position.setZ(idx, 0)
          idx++
        }
      }
    }

    this.uniforms = {
      time: { value: 0 },
      resolution: { value: [size.x, size.y] },
      mouse: { value: [0, 0] },
      posSim: { value: null },
      velSim: { value: null },
      accSim: { value: null },
      audioTexture: { value: null },

      color1: { value: new Color('#e3307e') },
      color2: { value: new Color('#78f0f9') },
      color3: { value: new Color('#f7abb7') },
      color4: { value: new Color('#ffd38b') },
    }
    let shader = new ShaderMaterial({
      uniforms: this.uniforms,
      fragmentShader: fragmentRender,
      vertexShader: vertexRender,
      transparent: true,
    })

    //
    onLoop(() => {
      let { accSim, posSim, velSim, audioTexture } = getTexSet()

      this.uniforms.accSim.value = accSim
      this.uniforms.posSim.value = posSim
      this.uniforms.velSim.value = velSim
      this.uniforms.audioTexture.value = audioTexture

      this.uniforms.time.value = performance.now() //
    })

    this.points = new Points(geometry, shader)

    this.add(this.points)
  }
}
