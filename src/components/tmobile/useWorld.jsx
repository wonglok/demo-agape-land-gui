import { create } from 'zustand'

export const useWorld = create((set, get) => {
  return {
    //
    //
    envURL: `/Handlandmark/room.hdr`,
    myAvatarURL: '/assets/2023-04-07-walk/lok-groom.glb',
    colliderGLBURL: '/tmobile/r6-t-mobile--1636713668.glb',
    gameMode: 'room',
    postprocessing: 'game',
    insepction: 'normal',
    postProcessingConfig: {
      multisampling: 8,
      emissiveIntensity: 0.5,
      envMapIntensity: 0.5,
      ssrPass: {
        useThisOne: true,
        intensity: 0.5,
        exponent: 1,
        distance: 15,
        fade: 0.5,
        roughnessFade: 1,
        thickness: 10,
        ior: 1.45,
        maxRoughness: 1,
        maxDepthDifference: 10,
        blend: 0.9,
        correction: 1,
        correctionRadius: 1,
        blur: 0,
        blurKernel: 0,
        blurSharpness: 10,
        jitter: 0.1,
        jitterRoughness: 0.1,
        steps: 5,
        refineSteps: 3,
        missedRays: true,
        useNormalMap: true,
        useRoughnessMap: true,
        resolutionScale: 1,
        velocityResolutionScale: 0.5,
      },
      bloomPass: {
        useThisOne: true,
        mipmapBlur: true,
        luminanceThreshold: 0.85,
        intensity: 2,
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
        aoRadius: 2,
        distanceFalloff: 1,
        color: '#000000',
      },
    },
  }
})