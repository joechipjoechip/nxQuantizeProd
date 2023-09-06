import Vue from 'vue'
import { wrapFunctional } from './utils'

const components = {
  BlenderTubes: () => import('../..\\components\\BlenderTubes.js' /* webpackChunkName: "components/blender-tubes" */).then(c => wrapFunctional(c.default || c)),
  CharacterController: () => import('../..\\components\\characterController.js' /* webpackChunkName: "components/character-controller" */).then(c => wrapFunctional(c.default || c)),
  CinemaNew: () => import('../..\\components\\cinemaNew.vue' /* webpackChunkName: "components/cinema-new" */).then(c => wrapFunctional(c.default || c)),
  CustomPhongShaderBuilder: () => import('../..\\components\\customPhongShaderBuilder.js' /* webpackChunkName: "components/custom-phong-shader-builder" */).then(c => wrapFunctional(c.default || c)),
  CustomShaderBuilder: () => import('../..\\components\\customShaderBuilder.js' /* webpackChunkName: "components/custom-shader-builder" */).then(c => wrapFunctional(c.default || c)),
  DynamicLightsBuilder: () => import('../..\\components\\dynamicLightsBuilder.js' /* webpackChunkName: "components/dynamic-lights-builder" */).then(c => wrapFunctional(c.default || c)),
  IndexBackground: () => import('../..\\components\\indexBackground.vue' /* webpackChunkName: "components/index-background" */).then(c => wrapFunctional(c.default || c)),
  IndexBody: () => import('../..\\components\\indexBody.vue' /* webpackChunkName: "components/index-body" */).then(c => wrapFunctional(c.default || c)),
  InstanceThree: () => import('../..\\components\\instanceThree.vue' /* webpackChunkName: "components/instance-three" */).then(c => wrapFunctional(c.default || c)),
  Joystick: () => import('../..\\components\\joystick.vue' /* webpackChunkName: "components/joystick" */).then(c => wrapFunctional(c.default || c)),
  Loopify: () => import('../..\\components\\loopify.js' /* webpackChunkName: "components/loopify" */).then(c => wrapFunctional(c.default || c)),
  MouseHandler: () => import('../..\\components\\mouseHandler.vue' /* webpackChunkName: "components/mouse-handler" */).then(c => wrapFunctional(c.default || c)),
  ParticlesBuilder: () => import('../..\\components\\particlesBuilder.js' /* webpackChunkName: "components/particles-builder" */).then(c => wrapFunctional(c.default || c)),
  PostprocsBuilder: () => import('../..\\components\\postprocsBuilder.js' /* webpackChunkName: "components/postprocs-builder" */).then(c => wrapFunctional(c.default || c)),
  PrimaryLoadManager: () => import('../..\\components\\primaryLoadManager.js' /* webpackChunkName: "components/primary-load-manager" */).then(c => wrapFunctional(c.default || c)),
  SceneBuilder: () => import('../..\\components\\sceneBuilder.js' /* webpackChunkName: "components/scene-builder" */).then(c => wrapFunctional(c.default || c)),
  SceneDisposer: () => import('../..\\components\\sceneDisposer.js' /* webpackChunkName: "components/scene-disposer" */).then(c => wrapFunctional(c.default || c)),
  SequencesBuilder: () => import('../..\\components\\sequencesBuilder.js' /* webpackChunkName: "components/sequences-builder" */).then(c => wrapFunctional(c.default || c)),
  SequencesManager: () => import('../..\\components\\sequencesManager.js' /* webpackChunkName: "components/sequences-manager" */).then(c => wrapFunctional(c.default || c)),
  SpecificManualCameraTweenBuilder: () => import('../..\\components\\SpecificManualCameraTweenBuilder.js' /* webpackChunkName: "components/specific-manual-camera-tween-builder" */).then(c => wrapFunctional(c.default || c)),
  States: () => import('../..\\components\\states.js' /* webpackChunkName: "components/states" */).then(c => wrapFunctional(c.default || c)),
  Stick: () => import('../..\\components\\stick.vue' /* webpackChunkName: "components/stick" */).then(c => wrapFunctional(c.default || c)),
  ThirdPersonCamera: () => import('../..\\components\\thirdPersonCamera.js' /* webpackChunkName: "components/third-person-camera" */).then(c => wrapFunctional(c.default || c)),
  UpdateBobWorker: () => import('../..\\components\\updateBob.worker.js' /* webpackChunkName: "components/update-bob-worker" */).then(c => wrapFunctional(c.default || c)),
  Worker: () => import('../..\\components\\worker.js' /* webpackChunkName: "components/worker" */).then(c => wrapFunctional(c.default || c))
}

for (const name in components) {
  Vue.component(name, components[name])
  Vue.component('Lazy' + name, components[name])
}
