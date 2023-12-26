import { Suspense, useEffect, useMemo } from "react"
import { CoreCode } from "./CoreCode"
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber"
import { OrbitControls, Stats, useGLTF } from "@react-three/drei"
import { PPSwitch } from "agape-sdk/src/main"
import { useBVHPhysics } from "./useBVHPhysics"
import { RGBELoader } from "three-stdlib"
import { Color, EquirectangularReflectionMapping } from "three"
// import { Bloom, EffectComposer, SelectiveBloom } from "@react-three/postprocessing"

export function BVHPhysics() {
    return <>
        {/*  */}
        <Canvas>
            <Suspense fallback={null}>
                <Core></Core>
            </Suspense>
            <OrbitControls target={[5, 0, 0]} object-position={[-5, 20, 20]}></OrbitControls>
        </Canvas>

        {/* <Loader></Loader> */}
        <Stats></Stats>
        {/*  */}
    </>
}

function Core() {
    let rgbe = useLoader(RGBELoader, `/agape-sdk/hdr/nycnight.hdr`)
    let scene = useThree((s) => s.scene)

    rgbe.mapping = EquirectangularReflectionMapping
    scene.environment = rgbe
    scene.background = new Color('#000000')

    let gl = useThree((s) => s.gl)
    let glb = useGLTF(`/slide/spiral.glb`)
    let { o3d, display, bloom, lights } = useMemo(() => {
        let o3d = new CoreCode({ gl, glb })

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
    })

    return <>
        {display}

        <primitive object={glb.scene}></primitive>
        <PPSwitch useStore={useBVHPhysics}></PPSwitch>
    </>
}