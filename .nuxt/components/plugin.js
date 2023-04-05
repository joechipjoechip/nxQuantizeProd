import Vue from 'vue'
import { wrapFunctional } from './utils'

const components = {
  BlenderTubes: () => import('../../components/BlenderTubes.js' /* webpackChunkName: "components/blender-tubes" */).then(c => wrapFunctional(c.default || c)),
  AudioPlayer: () => import('../../components/audioPlayer.vue' /* webpackChunkName: "components/audio-player" */).then(c => wrapFunctional(c.default || c)),
  CharacterController: () => import('../../components/characterController.js' /* webpackChunkName: "components/character-controller" */).then(c => wrapFunctional(c.default || c)),
  DynamicLightsBuilder: () => import('../../components/dynamicLightsBuilder.js' /* webpackChunkName: "components/dynamic-lights-builder" */).then(c => wrapFunctional(c.default || c)),
  GuiManager: () => import('../../components/guiManager.js' /* webpackChunkName: "components/gui-manager" */).then(c => wrapFunctional(c.default || c)),
  Joystick: () => import('../../components/joystick.vue' /* webpackChunkName: "components/joystick" */).then(c => wrapFunctional(c.default || c)),
  MouseHandler: () => import('../../components/mouseHandler.vue' /* webpackChunkName: "components/mouse-handler" */).then(c => wrapFunctional(c.default || c)),
  ParticlesBuilder: () => import('../../components/particlesBuilder.js' /* webpackChunkName: "components/particles-builder" */).then(c => wrapFunctional(c.default || c)),
  PostprocsBuilder: () => import('../../components/postprocsBuilder.js' /* webpackChunkName: "components/postprocs-builder" */).then(c => wrapFunctional(c.default || c)),
  PrimaryLoadManager: () => import('../../components/primaryLoadManager.js' /* webpackChunkName: "components/primary-load-manager" */).then(c => wrapFunctional(c.default || c)),
  SceneBuilder: () => import('../../components/sceneBuilder.js' /* webpackChunkName: "components/scene-builder" */).then(c => wrapFunctional(c.default || c)),
  SequencesBuilder: () => import('../../components/sequencesBuilder.js' /* webpackChunkName: "components/sequences-builder" */).then(c => wrapFunctional(c.default || c)),
  SequencesManager: () => import('../../components/sequencesManager.js' /* webpackChunkName: "components/sequences-manager" */).then(c => wrapFunctional(c.default || c)),
  SpecificManualCameraTweenBuilder: () => import('../../components/specificManualCameraTweenBuilder.js' /* webpackChunkName: "components/specific-manual-camera-tween-builder" */).then(c => wrapFunctional(c.default || c)),
  States: () => import('../../components/states.js' /* webpackChunkName: "components/states" */).then(c => wrapFunctional(c.default || c)),
  Stick: () => import('../../components/stick.vue' /* webpackChunkName: "components/stick" */).then(c => wrapFunctional(c.default || c)),
  ThirdPersonCamera: () => import('../../components/thirdPersonCamera.js' /* webpackChunkName: "components/third-person-camera" */).then(c => wrapFunctional(c.default || c))
}

for (const name in components) {
  Vue.component(name, components[name])
  Vue.component('Lazy' + name, components[name])
}
