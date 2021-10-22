import Vue from 'vue'
import { wrapFunctional } from './utils'

const components = {
  CharacterController: () => import('../../components/CharacterController.js' /* webpackChunkName: "components/character-controller" */).then(c => wrapFunctional(c.default || c)),
  DynamicLightsBuilder: () => import('../../components/DynamicLightsBuilder.js' /* webpackChunkName: "components/dynamic-lights-builder" */).then(c => wrapFunctional(c.default || c)),
  GuiManager: () => import('../../components/GuiManager.js' /* webpackChunkName: "components/gui-manager" */).then(c => wrapFunctional(c.default || c)),
  SpecificManualCameraTweenBuilder: () => import('../../components/SpecificManualCameraTweenBuilder.js' /* webpackChunkName: "components/specific-manual-camera-tween-builder" */).then(c => wrapFunctional(c.default || c)),
  ThirdPersonCamera: () => import('../../components/ThirdPersonCamera.js' /* webpackChunkName: "components/third-person-camera" */).then(c => wrapFunctional(c.default || c)),
  CanvasVideo: () => import('../../components/canvasVideo.vue' /* webpackChunkName: "components/canvas-video" */).then(c => wrapFunctional(c.default || c))
}

for (const name in components) {
  Vue.component(name, components[name])
  Vue.component('Lazy' + name, components[name])
}
