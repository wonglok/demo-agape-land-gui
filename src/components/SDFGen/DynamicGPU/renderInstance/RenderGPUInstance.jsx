import { BufferAttribute, BufferGeometry, Color, IcosahedronGeometry, InstancedBufferAttribute, InstancedBufferGeometry, Mesh, Object3D, Points, ShaderMaterial } from 'three'
import { fragmentRender } from './fragment'
import { vertexRender } from './vertex'
import { BoxGeometry } from 'three'

export class RenderGPUInstance extends Object3D {
  constructor({ size }) {
    super()

    this.size = size
    let box = new IcosahedronGeometry(0.15, 0)
    box.rotateX(Math.PI / 2 / 2)
    box.rotateY(Math.PI / 2 / 2)
    box.rotateZ(Math.PI / 2 / 2)
    let geometry = new InstancedBufferGeometry()
    geometry.copy(box)
    geometry.instanceCount = size.x * size.y

    geometry.setAttribute('offset', new InstancedBufferAttribute(new Float32Array(size.x * size.y * 3), 3))
    geometry.setAttribute('uvlookup', new InstancedBufferAttribute(new Float32Array(size.x * size.y * 2), 2))

    {
      let idx = 0
      for (let y = 0; y < size.y; y++) {
        for (let x = 0; x < size.x; x++) {
          geometry.attributes.uvlookup.setX(idx, x / size.x)
          geometry.attributes.uvlookup.setY(idx, y / size.y)
          idx++
        }
      }
    }
    {
      let idx = 0
      for (let y = 0; y < size.y; y++) {
        for (let x = 0; x < size.x; x++) {
          geometry.attributes.offset.setX(idx, x / size.x)
          geometry.attributes.offset.setY(idx, y / size.y)
          geometry.attributes.offset.setZ(idx, 0)
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

      pt: { value: window.devicePixelRatio },

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

    this.points = new Mesh(geometry, shader)
    this.points.frustumCulled = false
    this.add(this.points)
  }
}
