import { BoxHelper, Clock, FloatType, HalfFloatType, LinearFilter, Matrix4, Mesh, Object3D, Quaternion, RGBAFormat, RedFormat, Vector3, WebGL3DRenderTarget } from "three";
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { sceneToCollider } from "./sceneToGeometry";
import { GPURun } from "./DynamicGPU/GPURun";

export class CoreCode extends Object3D {
    constructor({ gl: renderer, glb }) {
        super()
        this.clock = new Clock()

        const params = {

            resolution: 100,
            margin: 0.0,
            surface: 0.0,
        };

        this.update = () => {
            //
            console.log('setup in progress....')
            //
        }
        this.setup = async () => {
            let { geometry, bvh, collider } = await sceneToCollider({ scene: glb.scene })

            // this.add(collider)

            glb.scene.traverse(it => {
                if (it.isLight) {
                    it.visible = false
                }
            })

            this.gpuRun = new GPURun({ gl: renderer })

            this.add(this.gpuRun)

            let et = 0
            this.update = () => {
                let dt = this.clock.getDelta()

                if (dt >= 4 / 60) {
                    dt = 4 / 60
                }

                et += dt;

                this.gpuRun.bvhSource = bvh
                this.gpuRun.run({}, dt)
            }
        }

        this.setup()
    }
}