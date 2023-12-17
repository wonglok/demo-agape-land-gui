import { useEffect } from 'react'
import { useCore } from './useCore'
import { useFrame, useThree } from '@react-three/fiber'
// import { GPURun } from "./GPURun";
import { useMic } from './mic/histroymic'
import { GPURun } from './GPURun'

export function CleanGPU() {
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
    let gpu = new GPURun({ gl, useMic: useMic })
    useCore.setState({
      gpu: gpu,
      show: <primitive object={gpu}></primitive>,
    })
  }, [gl])

  return <>{<>{show}</>}</>
}

//
