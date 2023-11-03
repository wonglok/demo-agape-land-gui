import { SceneIntegration, toTree } from 'agape-sdk'

export function SceneKit({ useStore }) {
  let sceneList = useStore((r) => r.sceneList) || []
  let scene = toTree(sceneList) || []
  return (
    <>
      <SceneIntegration useStore={useStore} scene={scene}></SceneIntegration>
    </>
  )
}
