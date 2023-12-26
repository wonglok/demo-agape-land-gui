import { Suspense, useEffect, useMemo } from "react"
import { CoreCode } from "./CoreCode"
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, StatsGl, useGLTF } from "@react-three/drei"
import { RGBELoader } from "three-stdlib"
import { Color, EquirectangularReflectionMapping } from "three"
import { PPSwitch } from "agape-sdk/src/main"
// import { Bloom, EffectComposer, SelectiveBloom } from "@react-three/postprocessing"

export function BVHSDFTex() {
    return <>
        {/*  */}
        <Canvas>
            <Suspense fallback={null}>
                <Core></Core>
            </Suspense>
            <StatsGl></StatsGl>
            <PerspectiveCamera makeDefault far={1000}></PerspectiveCamera>
            <OrbitControls makeDefault target={[0, 0, 0]} object-position={[0, 15, 15]}></OrbitControls>
        </Canvas>

        {/* <Loader></Loader> */}
        {/*  */}
    </>
}

function Core() {
    //
    let rgbe = useLoader(RGBELoader, `/agape-sdk/hdr/nycnight.hdr`)
    let scene = useThree((s) => s.scene)

    rgbe.mapping = EquirectangularReflectionMapping
    scene.environment = rgbe
    scene.background = new Color('#000000')

    let gl = useThree((s) => s.gl)
    let glb = useGLTF(`/slide/spiral.glb`)
    let camera = useThree(r => r.camera)
    let { o3d, display, bloom, lights } = useMemo(() => {
        let o3d = new CoreCode({ gl, glb, camera, scene })

        let bloom = []
        o3d.traverse(it => {
            if (it.geometry) {
                bloom.push(it)
            }
        })
        let lights = []
        glb.scene.traverse(it => {
            if (it.intensity) {
                lights.push(it)
                it.visible = true
            }
            if (it.material) {
                it.material.map = null
            }
        })

        return {
            display: <primitive object={o3d}></primitive>,
            o3d,
            bloom: bloom,
            lights: lights,
        }
    }, [])

    useFrame(() => {
        o3d.update()
    }, 1000)

    return <>
        {display}

        <primitive object={glb.scene}></primitive>

    </>
}