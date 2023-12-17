import { useEffect, useMemo } from 'react'
import { useCore } from './useCore'
import { useFrame, useThree } from '@react-three/fiber'
// import { GPURun } from "./GPURun";
import { GPURun } from './GPURun'

export function DynamicGPU() {
  let gpu = useCore((r) => r.gpu)
  let show = useCore((r) => r.show)
  let gl = useThree((r) => r.gl)

  useFrame((st, dt) => {
    if (dt >= 4 / 60) {
      dt = 4 / 60
    }
    if (gpu) {
      gpu.run(st, dt)
    }
  })

  useEffect(() => {
    let oldOne = useCore.getState().gpu

    if (oldOne) {
      oldOne.clean()
    }

    let initGPU = new GPURun({ gl })
    useCore.setState({
      gpu: initGPU,
      show: <primitive object={initGPU}></primitive>,
    })

    //
    return () => {}
  }, [gl])

  return <>{<>{show}</>}</>
}

//
