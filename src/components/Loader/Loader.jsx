import { initStoreForPostProc } from 'agape-sdk'
import { getBackendBaseURL } from 'agape-sdk'
import { useEffect } from 'react'
import { WebSocketAuto } from './WebSocketAuto'

export function Loader({ projectID = false, useStore }) {
  useEffect(() => {
    //
    ////production

    if (!projectID) {
      let projectIDConst = '_06ba23c86d4f0a36ef09f87e114c86ba'
      if (process.env.NODE_ENV === 'development') {
        projectIDConst = '_1ceba52d0deec9748fd73cf8d550f1c5'
      }

      projectID = projectIDConst
    }

    let socket = new WebSocketAuto({ roomID: projectID, url: getBackendBaseURL().ws })

    socket.on('all-ready', () => {
      //
      useStore.setState({ socket: socket })
      useStore.setState({ ready: true })

      socket.on('liveState', (ev) => {
        console.log(ev)

        let r = {
          result: ev.state,
        }

        console.log('evlivestate  ', ev.state)

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
        })
      })

      socket.send({
        action: 'liveState',
        payload: {
          projectID: projectID,
        },
      })
    })

    // //AWSBackends["production"]
    // fetch(`${getBackendBaseURL().rest}${`/public-project`}`, {
    //   method: 'post',
    //   mode: 'cors',
    //   body: JSON.stringify({
    //     action: 'internetGet',
    //     jwt: '',
    //     payload: {
    //       projectID: projectID,
    //     },
    //   }),
    // })
    //   .then(processResponse)
    //   .then((r) => {
    //     //

    //   })
  }, [useStore])
  return null
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
