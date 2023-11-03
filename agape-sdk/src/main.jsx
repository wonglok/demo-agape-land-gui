import { SceneContent } from './Canvas/SceneContent.jsx'
import { PostProcessingModes, InsepctionModes, GameModes, RunnerEnds } from './Canvas/AgapeConstants.jsx'
import { toArray, toTree, editTreeOnArray, forEachTree } from './entry/treeWithArray.jsx'

import { SceneIntegration } from './Canvas/SceneIntegration.jsx'
import { SceneBox } from './Canvas/SceneBox.jsx'
import { PPSwitch } from './Canvas/PPSwitch.jsx'
import { processResponse, getBackendBaseURL, getFrontendBaseURL } from './Canvas/AgapeConstants.jsx'

import { MetaverseGLB } from './Canvas/GameModeSwitcher/RoomView/MetaverseGLB.jsx'
import { Joystick } from './Canvas/GameModeSwitcher/RoomView/Joystick.jsx'
import { AvatarGuide } from './Canvas/GameModeSwitcher/BirdView/AvatarGuide.jsx'
import { Collider } from './Canvas/GameModeSwitcher/BirdView/collider/Collider.jsx'
import { Mouse3D } from './Canvas/GameModeSwitcher/BirdView/Mouse3D.jsx'
import { AvaZoom } from './Canvas/GameModeSwitcher/BirdView/AvaZoom.jsx'
import { BirdCamSync } from './Canvas/GameModeSwitcher/BirdView/BirdCamSync.jsx'
import { LoaderGLB } from './Canvas/GameModeSwitcher/BirdView/LoaderGLB.jsx'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { Background } from './Canvas/Lights/Background.jsx'
import { initStoreForPostProc } from './Canvas/PostProcessing/initStoreForPostProc.jsx'
import { ProductView } from './Canvas/GameModeSwitcher/ProductView/ProductView.jsx'
import { BirdWalk } from './Canvas/GameModeSwitcher/BirdView/BirdWalk.jsx'
import { RoomView } from './Canvas/GameModeSwitcher/RoomView/RoomView.jsx'
import { AgapeNodeRuntime } from './Canvas/AgapeNode/Runtime/AgapeNodeRuntime.jsx'
import { AgapeNodes } from './Canvas/AgapeNode/Runtime/AgapeNodes.jsx'
import * as TemplateEdge from './Canvas/AgapeNode/Runtime/TemplateEdge.jsx'

export const SceneStateManager = SceneContent

export {
  //
  AgapeNodes,
  TemplateEdge,
  //
  AgapeNodeRuntime,
  //
  //
  //
  // Canvas,
  RunnerEnds,
  RoomView,
  BirdWalk,
  initStoreForPostProc,
  ProductView,
  //
  SceneBox,
  Background,
  Joystick,
  MetaverseGLB,
  LoaderGLB,
  AvatarGuide,
  Collider,
  Mouse3D,
  AvaZoom,
  BirdCamSync,
  clone,

  //
  //
  //
  processResponse,
  getBackendBaseURL,
  getFrontendBaseURL,
  //
  PPSwitch,
  SceneIntegration,
  SceneContent,
  PostProcessingModes,
  InsepctionModes,
  GameModes,
  toArray,
  toTree,
  editTreeOnArray,
  forEachTree,
}
