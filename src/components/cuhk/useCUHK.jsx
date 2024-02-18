import { create } from 'zustand'

export const useCUHK = create((set, get) => {
  return {
    //
    //
    envURL: '/querlo/ma-galaxy.jpeg',
    myAvatarURL: '/assets/2023-04-07-walk/lok-groom.glb',
    colliderGLBURL: '/world/2023-02-18-CUHK/hospital008-webp.glb',
    gameMode: 'room',
    postprocessing: 'game',
    insepction: 'normal',
    postProcessingConfig: {
      multisampling: 4,
      emissiveIntensity: 1,
      envMapIntensity: 1,
      ssrPass: {
        useThisOne: true,
        intensity: 1,
        exponent: 1,
        distance: 15,
        fade: 0,
        roughnessFade: 1,
        thickness: 10,
        ior: 1.45,
        maxRoughness: 1,
        maxDepthDifference: 10,
        blend: 0.9,
        correction: 1,
        correctionRadius: 1,
        blur: 0,
        blurKernel: 1,
        blurSharpness: 10,
        jitter: 0.08,
        jitterRoughness: 0.08,
        steps: 10,
        refineSteps: 5,
        missedRays: false,
        useNormalMap: true,
        useRoughnessMap: true,
        resolutionScale: 1,
        velocityResolutionScale: 0.05,
      },
      bloomPass: {
        useThisOne: false,
        mipmapBlur: true,
        luminanceThreshold: 0.5,
        intensity: 3,
        resolutionScale: 1,
      },
      wavePass: {
        useThisOne: false,
        speed: 1,
        maxRadius: 1.07,
        waveSize: 1.09,
        amplitude: 0.3,
        intensity: 0.5,
      },
      chromePass: {
        useThisOne: false,
        offsetX: 0.002,
        offsetY: 0.002,
        radialModulation: true,
        modulationOffset: 0.5,
      },
      colorPass: {
        useThisOne: false,
        hue: 0,
        satuation: 0,
        brightness: 0,
        contrast: 0.0,
        saturation: 0.0,
      },
      aoPass: {
        useThisOne: true,
        intensity: 3,
        aoRadius: 1,
        distanceFalloff: 1,
        color: '#000000',
      },
    },
  }
})
