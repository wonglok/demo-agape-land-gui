import { Box, MeshDiscardMaterial } from '@react-three/drei'
import { useVFX } from '../useVFX'

export function Floor() {
  return (
    <>
      <gridHelper args={[100, 100]}></gridHelper>
      <Box
        onPointerDown={() => {
          //
        }}
        args={[1000000, 0.1, 1000000]}
      >
        <MeshDiscardMaterial></MeshDiscardMaterial>
      </Box>
    </>
  )
}
