import * as THREE from 'three'

export const setup = ({ url }) => {
  let api = {}
  let fftSize = 512 // up to 2048 with pow2
  let listener = new THREE.AudioListener()
  let audio = new THREE.Audio(listener)
  let mediaElement = new Audio(url)
  mediaElement.loop = true
  mediaElement.play()
  audio.setMediaElementSource(mediaElement)
  let analyser = new THREE.AudioAnalyser(audio, fftSize)

  console.log(analyser.data)

  let texture = new THREE.DataTexture(analyser.data, fftSize / 2.0, 1.0, THREE.RedFormat)

  api.pause = () => {
    mediaElement.pause()
  }

  api.update = () => {
    analyser.getFrequencyData()
    // analyser.getAverageFrequency()
    texture.needsUpdate = true

    return {
      texture,
    }
  }
  api.credit = {
    author: 'skullbeatz',
    link: 'http://www.newgrounds.com/audio/listen/376737',
  }

  return api
}
