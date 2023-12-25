import { Suspense, useEffect, useMemo } from "react"
import { SDFGenCore } from "./SDFGenCore"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, Loader, OrbitControls, Stats, useGLTF } from "@react-three/drei"
import { PPSwitch } from "agape-sdk/src/main"
import { useBVHPhysics } from "./useBVHPhysics"

export function SDFGen() {


    return <>
        {/*  */}
        <Canvas>
            <Suspense fallback={null}>
                <Core></Core>
            </Suspense>
            <OrbitControls target={[5, 0, 0]} object-position={[-5, 20, 20]}></OrbitControls>
        </Canvas>

        <Loader></Loader>
        <Stats></Stats>
        {/*  */}
    </>
}

function Core() {
    let gl = useThree((s) => s.gl)
    let glb = useGLTF(`/nyc/v28-v1.glb`)
    let { o3d, display } = useMemo(() => {
        let o3d = new SDFGenCore({ gl, glb })
        return {
            display: <primitive object={o3d}></primitive>,
            o3d,
        }
    }, [])

    useFrame(() => {
        o3d.update()
    })

    return <>
        {display}
        <primitive object={glb.scene}></primitive>
        <Environment files={`/agape-sdk/hdr/nycnight.hdr`}></Environment>
        <PPSwitch useStore={useBVHPhysics}></PPSwitch>
    </>
}