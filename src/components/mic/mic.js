import * as THREE from 'three'
// import { DynamicSonagramTexture, OnlineState } from '../OnlineState'
import { create } from 'zustand'
export const useMic = create(() => {
  return {
    MicTexture: false,
    low: 0,
    mid: 0,
    high: 0,
    avg: 0,
  }
})
export const authorise = () => {
  let mic = setupMic()
  let yyy = setInterval(() => {
    let { texture } = mic.update()
    if (texture) {
      clearInterval(yyy)
      texture.format = THREE.RedFormat
      useMic.setState({ MicTexture: texture })
      // DynamicSonagramTexture.value = texture
      // OnlineState.sonagramTextureSignal = Math.random()
    }
  })
  let tt = 0
  clearInterval(tt)
  tt = setInterval(() => {
    mic.update(({ low, mid, high }) => {
      useMic.setState({ low: low / 255, mid: mid / 255, high: high / 255 })
    })
  })
}

export const setupMic = () => {
  let api = {}
  let fftSize = 512 // up to 2048 with pow2
  let listener = new THREE.AudioListener()

  let analyser = null
  let texture = null
  let sound = null
  let dataPerScan = fftSize / 2.0
  let maxHistory = 60 * 5
  let savedBits = new Uint8Array(new Array(dataPerScan * maxHistory))
  // var bitsArr = new Array(dataPerScan * maxHistory * 3)
  let historyArr = []

  for (let i = 0; i < maxHistory; i++) {
    historyArr.push(new Uint8Array(new Array(dataPerScan)))
  }

  navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
    sound = new THREE.Audio(listener)
    let context = listener.context
    listener.setMasterVolume(0.0)
    let source = context.createMediaStreamSource(stream)
    sound.setNodeSource(source)

    analyser = new THREE.AudioAnalyser(sound, fftSize)

    texture = new THREE.DataTexture(savedBits, dataPerScan, maxHistory, THREE.RedFormat)
  })

  api.pause = () => {
    sound.pause()
  }

  api.update = (onBeat = () => {}) => {
    if (analyser) {
      analyser.getFrequencyData()
      let avg = analyser.getAverageFrequency()

      historyArr.pop()
      let array = analyser.data.slice()
      onBeat({ avg: avg, low: array[0], high: array[array.length - 1], mid: array[Math.floor(array.length / 2)] })
      historyArr.unshift(array)

      // savedBits = new Uint8Array(dataPerScan * maxHistory)

      for (let ai = 0; ai < historyArr.length; ai++) {
        let currnetAI = historyArr[ai]
        for (let bi = 0; bi < currnetAI.length; bi++) {
          let v = currnetAI[bi]
          let idx = ai * dataPerScan + bi
          savedBits[idx] = v
          // bitsArr[idx + 0] = v2
          // bitsArr[idx + 1] = v2
          // bitsArr[idx + 2] = v2
        }
      }

      // console.log(savedBits.length + ' bits updated')
      // analyser.getAverageFrequency()
    }
    if (texture) {
      // texture = new THREE.DataTexture(savedBits, dataPerScan, 1.0 * maxHistory, THREE.LuminanceFormat)
      texture.needsUpdate = true
    }

    return {
      dimension: {
        x: dataPerScan,
        y: maxHistory,
      },
      // bits: bitsArr,
      texture,
    }
  }
  return api
}
