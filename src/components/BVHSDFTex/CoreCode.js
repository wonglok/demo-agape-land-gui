import { Clock, FloatType, HalfFloatType, LinearFilter, MeshBasicMaterial, Object3D, RedFormat, WebGL3DRenderTarget } from "three";
import { MeshBVH, StaticGeometryGenerator } from "three-mesh-bvh";
import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass";
import { Matrix4, Mesh, Quaternion, Vector3 } from "three";
import { GenerateSDFMaterial } from "./GenerateSDFMaterial";
import { RenderSDFLayerMaterial } from "./RenderSDFLayerMaterial";
import { RayMarchSDFMaterial } from "./RayMarchSDFMaterial";
import { MeshStandardMaterial } from "three";
import { Box3, Box3Helper } from "three";
import { RGBAFormat } from "three";
import { DynamicSDF } from "./DynamicSDF/DynamicSDF";

export class CoreCode extends Object3D {
    update() { }
    constructor({ gl, glb, camera, scene }) {
        super()

        this.camera = camera;
        this.mode = 'geo'
        this.resolution = 128;
        this.margin = 0.0;
        this.layer = 0;
        this.surface = 0;
        this.gl = gl;
        this.renderer = gl;
        // this.renderer.setClearColor(0, 0);

        glb.scene.updateMatrixWorld(true);

        this.boxHelper = new Box3Helper(new Box3());
        this.add(this.boxHelper);

        this.staticGen = new StaticGeometryGenerator(glb.scene);
        this.staticGen.attributes = ['position', 'normal'];
        this.staticGen.useGroups = false;

        this.geometry = this.staticGen.generate();
        this.mesh = new Mesh(this.geometry, new MeshStandardMaterial({ wireframe: true }));

        this.bvh = new MeshBVH(this.geometry, { maxLeafTris: 1 });
        this.generateSdfPass = new FullScreenQuad(new GenerateSDFMaterial());
        this.layerPass = new FullScreenQuad(new RenderSDFLayerMaterial());
        this.raymarchPass = new FullScreenQuad(new RayMarchSDFMaterial({
            transparent: true
        }));

        this.updateSDF();

        this.gpu = new DynamicSDF({ gl })
        this.gpu.frustumCulled = false
        this.add(this.gpu);

        this.clock = new Clock()

        let m4inv = new Matrix4()
        let v3step = new Vector3()
        this.update = () => {
            let clock = this.clock
            let dt = clock.getDelta()


            if (this.gpu) {
                this.gpu.run({}, dt)

                if (this.sdfTex?.texture) {
                    this.gpu.sdfTex = this.sdfTex.texture
                }
                if (this.geometry.boundingBox) {
                    this.gpu.boundingBox = this.geometry.boundingBox
                }
                if (this.camera && this.mesh) {
                    this.gpu.sdfTransformInverse = m4inv
                    // .copy(this.mesh.matrixWorld)
                    //.invert().premultiply(this.inverseBoundsMatrix)
                }
                if (this.sdfTex?.texture) {
                    const { width, depth, height } = this.sdfTex?.texture.image;
                    this.gpu.normalStep = v3step.set(1 / width, 1 / height, 1 / depth)
                }
            }

            if (!this.sdfTex) {
                return
            }

            if (this.mode === 'geo') {
                this.renderer.render(scene, camera);
            }

            if (this.mode === 'grid' || this.mode === 'layer') {
                // render a layer of the 3d texture
                let tex;
                const material = this.layerPass.material;

                material.uniforms.layer.value = this.layer / this.sdfTex.width;
                material.uniforms.sdfTex.value = this.sdfTex.texture;
                tex = this.sdfTex.texture;

                material.uniforms.layers.value = tex.image.width;

                const gridMode = this.mode === 'layer' ? 0 : 1;
                if (gridMode !== material.defines.DISPLAY_GRID) {

                    material.defines.DISPLAY_GRID = gridMode;
                    material.needsUpdate = true;

                }

                this.layerPass.render(this.renderer);
            }

            if (this.mode === 'ray') {
                // render the ray marched texture
                this.camera.updateMatrixWorld();
                this.mesh.updateMatrixWorld();

                let tex;
                if (this.sdfTex.isData3DTexture) {

                    tex = this.sdfTex;

                } else {

                    tex = this.sdfTex.texture;

                }

                const { width, depth, height } = tex.image;
                this.raymarchPass.material.uniforms.sdfTex.value = tex;
                this.raymarchPass.material.uniforms.normalStep.value.set(1 / width, 1 / height, 1 / depth);
                this.raymarchPass.material.uniforms.surface.value = this.surface;
                this.raymarchPass.material.uniforms.projectionInverse.value.copy(camera.projectionMatrixInverse);
                this.raymarchPass.material.uniforms.sdfTransformInverse.value.copy(this.mesh.matrixWorld).invert().premultiply(this.inverseBoundsMatrix).multiply(this.camera.matrixWorld);
                this.raymarchPass.render(this.renderer);

            }

        }
    }

    updateSDF() {
        const renderer = this.renderer;
        const dim = this.resolution;
        const matrix = new Matrix4();
        const center = new Vector3();
        const quat = new Quaternion();
        const scale = new Vector3();
        const geometry = this.geometry;

        this.geometry.computeBoundingBox();
        // compute the bounding box of the geometry including the margin which is used to
        // define the range of the SDF
        geometry.boundingBox.getCenter(center);
        scale.subVectors(geometry.boundingBox.max, geometry.boundingBox.min);
        scale.x += 2 * this.margin;
        scale.y += 2 * this.margin;
        scale.z += 2 * this.margin;
        matrix.compose(center, quat, scale);
        this.inverseBoundsMatrix = new Matrix4();
        this.inverseBoundsMatrix.copy(matrix).invert();

        // // update the box helper
        this.boxHelper.box.copy(geometry.boundingBox);
        this.boxHelper.box.min.x -= this.margin;
        this.boxHelper.box.min.y -= this.margin;
        this.boxHelper.box.min.z -= this.margin;
        this.boxHelper.box.max.x += this.margin;
        this.boxHelper.box.max.y += this.margin;
        this.boxHelper.box.max.z += this.margin;


        const pxWidth = 1 / dim;
        const halfWidth = 0.5 * pxWidth;

        const startTime = window.performance.now();

        // create a new 3d render target texture
        this.sdfTex = new WebGL3DRenderTarget(dim, dim, dim);
        this.sdfTex.texture.format = RGBAFormat;
        this.sdfTex.texture.type = HalfFloatType;
        this.sdfTex.texture.minFilter = LinearFilter;
        this.sdfTex.texture.magFilter = LinearFilter;

        // prep the sdf generation material pass
        this.generateSdfPass.material.uniforms.bvh.value.updateFrom(this.bvh);
        this.generateSdfPass.material.uniforms.matrix.value.copy(matrix);
        this.sdfTex.texture.needsUpdate = true

        // render into each layer
        for (let i = 0; i < dim; i++) {

            this.generateSdfPass.material.uniforms.zValue.value = i * pxWidth + halfWidth;

            renderer.setRenderTarget(this.sdfTex, i);
            this.generateSdfPass.render(renderer);
        }


        // initiate read back to get a rough estimate of time taken to generate the sdf
        // renderer.readRenderTargetPixels(this.sdfTex, 0, 0, 1, 1, new Float32Array(4));
        renderer.setRenderTarget(null);


        // update the timing display
        const delta = window.performance.now() - startTime;

        console.log('timused', delta)
    }
}