import { EnvInspect } from './PostProcessing/EnvInspect.jsx'
// import { EnvLayout } from "./PostProcessing/EnvLayout";
import { EnvSSRWorks } from './PostProcessing/EnvSSRWorks.jsx'
import { EnvStandard } from './PostProcessing/EnvStandard.jsx'
import { EnvWireframe } from './PostProcessing/EnvWireframe.jsx'
import { EnvWow } from './PostProcessing/EnvWow.jsx'

export function PPSwitch({ useStore }) {
  let postprocessing = useStore((r) => r.postprocessing)
  return (
    <>
      {postprocessing === 'wireframe' && (
        <>
          <EnvWireframe></EnvWireframe>
        </>
      )}

      {postprocessing === 'layout' && (
        <>
          <EnvStandard></EnvStandard>
        </>
      )}

      {postprocessing === 'standard' && (
        <>
          <EnvWow></EnvWow>
        </>
      )}

      {postprocessing === 'postproc' && (
        <>
          <EnvSSRWorks useStore={useStore}></EnvSSRWorks>
        </>
      )}

      {postprocessing === 'game' && (
        <>
          <EnvSSRWorks isGame={true} useStore={useStore}></EnvSSRWorks>
        </>
      )}

      {postprocessing === 'inspect' && (
        <>
          <EnvInspect useStore={useStore}></EnvInspect>
        </>
      )}
    </>
  )
}
