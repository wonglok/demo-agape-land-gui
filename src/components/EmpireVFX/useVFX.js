import { create } from 'zustand'

export const useVFX = create((set, get) => {
  return {
    //
    controls: false,
    dragbjects: [],

    isDown: false,
    hand: false,
  }
})
