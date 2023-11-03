import { initStoreForPostProc } from 'agape-sdk'
// import { getBackendBaseURL } from 'agape-sdk'
import { useEffect } from 'react'
// import { WebSocketAuto } from './WebSocketAuto'
import { Data } from './local/data'
import { useMic } from '../mic/mic'
import { Beat } from '../Runner/Beat'

export function OfflineLoader({ useStore }) {
  useEffect(() => {
    //

    let r = {
      result: Data,
    }

    useStore.setState({
      from: `_${Math.random()}`,
      // cdn
      baseURL: `https://cdn.agape.town`,

      gameMode: `street`,

      insepction: 'normal',

      // envURL: `/envMap/ma-galaxy.webp`,
      //!SECTION
      //
      scene: [], // tree
      postProcessingConfig: initStoreForPostProc({
        postProcessingConfig: r.result?.projectMeta?.postProcessingConfig || {},
      }),

      envURL: r.result?.projectMeta?.envURL,
      myAvatarURL: r.result?.projectMeta?.myAvatarURL,
      colliderGLBURL: r.result?.projectMeta?.colliderGLBURL,
      gameMode: r.result?.projectMeta?.gameMode,
      postprocessing: r.result?.projectMeta?.postprocessing,
      insepction: r.result?.projectMeta?.insepction,
      sceneList: r.result?.sceneList,

      nodesList: r.result?.nodesList,
      edgesList: r.result?.edgesList,

      graphFocus: 'root',

      //

      ready: true,
    })
  }, [useStore])

  return (
    <>
      <Beat useStore={useStore}></Beat>
    </>
  )
}

const processResponse = async (r) => {
  let data = await r.json()

  if (r.ok) {
    return data
  } else {
    throw data
  }
}

//
