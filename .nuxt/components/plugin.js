import Vue from 'vue'
import { wrapFunctional } from './utils'

const components = {
  BlenderTubes: () => import('../../components/blenderTubes.js' /* webpackChunkName: "components/blender-tubes" */).then(c => wrapFunctional(c.default || c)),
  CharacterController: () => import('../../components/characterController.js' /* webpackChunkName: "components/character-controller" */).then(c => wrapFunctional(c.default || c)),
  DynamicLightsBuilder: () => import('../../components/dynamicLightsBuilder.js' /* webpackChunkName: "components/dynamic-lights-builder" */).then(c => wrapFunctional(c.default || c)),
  GuiManager: () => import('../../components/guiManager.js' /* webpackChunkName: "components/gui-manager" */).then(c => wrapFunctional(c.default || c)),
  SceneBuilder: () => import('../../components/sceneBuilder.js' /* webpackChunkName: "components/scene-builder" */).then(c => wrapFunctional(c.default || c)),
  SpecificManualCameraTweenBuilder: () => import('../../components/specificManualCameraTweenBuilder.js' /* webpackChunkName: "components/specific-manual-camera-tween-builder" */).then(c => wrapFunctional(c.default || c)),
  ThirdPersonCamera: () => import('../../components/thirdPersonCamera.js' /* webpackChunkName: "components/third-person-camera" */).then(c => wrapFunctional(c.default || c))
}

for (const name in components) {
  Vue.component(name, components[name])
  Vue.component('Lazy' + name, components[name])
}
