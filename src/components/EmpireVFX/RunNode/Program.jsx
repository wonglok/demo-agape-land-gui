import { useVFX } from '../useVFX'
import { RunNode } from './RunNode'

export function Program() {
  let root = useVFX((state) => state.root)

  return (
    <>
      <RunNode self={root} parent={null}></RunNode>
    </>
  )
}
