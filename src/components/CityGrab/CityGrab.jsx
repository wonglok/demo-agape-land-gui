import { Canvas } from '@react-three/fiber'
import { MouseGesture } from './MouseGesture'
import { useMouse } from './useMouse.js'
import { Stats } from '@react-three/drei'
import { useEffect, useRef } from 'react'
// import { useEffect } from 'react'

export function CityGrab() {
  let showStartMenu = useMouse((r) => r.showStartMenu)
  let video = useMouse((r) => r.video)
  let loading = useMouse((r) => r.loading)

  return (
    <>
      {/*  */}
      <Canvas
        onCreated={(st) => {
          st.gl.domElement.ontouchstart = (ev) => {
            ev.preventDefault()
          }
          st.gl.domElement.ontouchmove = (ev) => {
            ev.preventDefault()
          }
        }}
      >
        {/*  */}

        <Stats></Stats>

        <MouseGesture></MouseGesture>

        {/*  */}
      </Canvas>

      {showStartMenu && (
        <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center'>
          {<button className='bg-gray-200 p-2'>{loading ? `Processing...` : `Downloading....`}</button>}
        </div>
      )}

      {video && (
        <div className='absolute right-0 top-0'>
          <InsertV dom={video}></InsertV>
        </div>
      )}
    </>
  )
}

function InsertV({ dom }) {
  let ref = useRef()
  useEffect(() => {
    let target = ref.current
    ref.current.appendChild(dom)
    return () => {
      target.innerHTML = ''
    }
  }, [dom])
  return <div className='w-36 -scale-x-100' ref={ref}></div>
}
