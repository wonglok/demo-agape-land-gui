import { Suspense, useEffect, useMemo } from "react"
import { SDFGenCore } from "./SDFGenCore"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Loader, OrbitControls, useGLTF } from "@react-three/drei"

export function SDFGen() {


    return <>
        {/*  */}
        <Suspense fallback={null}>
            <Canvas>
                <Core></Core>
                <OrbitControls target={[5, 0, 0]} object-position={[-5, 20, 20]}></OrbitControls>
            </Canvas>
        </Suspense>
        <Loader></Loader>
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
    </>
}