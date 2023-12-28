import { useThree, useLoader } from "@react-three/fiber"
import { EquirectangularReflectionMapping } from "three"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"
export function YoEnv({ files = '', background }) {
    let rgb = useLoader(RGBELoader, files)
    let scene = useThree((r) => r.scene)

    rgb.mapping = EquirectangularReflectionMapping
    scene.environment = rgb
    if (background) {
        scene.background = rgb
    }

    return <>

        {/*  */}
        {/*  */}

    </>
}

