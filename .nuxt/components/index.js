import { wrapFunctional } from './utils'

export { default as BlenderTubes } from '../../components/BlenderTubes.js'
export { default as CharacterController } from '../../components/characterController.js'
export { default as DynamicLightsBuilder } from '../../components/dynamicLightsBuilder.js'
export { default as GuiManager } from '../../components/guiManager.js'
export { default as Joystick } from '../../components/joystick.vue'
export { default as MouseHandler } from '../../components/mouseHandler.vue'
export { default as ParticlesBuilder } from '../../components/particlesBuilder.js'
export { default as PostprocsBuilder } from '../../components/postprocsBuilder.js'
export { default as PrimaryLoadManager } from '../../components/primaryLoadManager.js'
export { default as SceneBuilder } from '../../components/sceneBuilder.js'
export { default as SequencesBuilder } from '../../components/sequencesBuilder.js'
export { default as SequencesManager } from '../../components/sequencesManager.js'
export { default as SpecificManualCameraTweenBuilder } from '../../components/specificManualCameraTweenBuilder.js'
export { default as States } from '../../components/states.js'
export { default as Stick } from '../../components/stick.vue'
export { default as ThirdPersonCamera } from '../../components/thirdPersonCamera.js'

export const LazyBlenderTubes = import('../../components/BlenderTubes.js' /* webpackChunkName: "components/blender-tubes" */).then(c => wrapFunctional(c.default || c))
export const LazyCharacterController = import('../../components/characterController.js' /* webpackChunkName: "components/character-controller" */).then(c => wrapFunctional(c.default || c))
export const LazyDynamicLightsBuilder = import('../../components/dynamicLightsBuilder.js' /* webpackChunkName: "components/dynamic-lights-builder" */).then(c => wrapFunctional(c.default || c))
export const LazyGuiManager = import('../../components/guiManager.js' /* webpackChunkName: "components/gui-manager" */).then(c => wrapFunctional(c.default || c))
export const LazyJoystick = import('../../components/joystick.vue' /* webpackChunkName: "components/joystick" */).then(c => wrapFunctional(c.default || c))
export const LazyMouseHandler = import('../../components/mouseHandler.vue' /* webpackChunkName: "components/mouse-handler" */).then(c => wrapFunctional(c.default || c))
export const LazyParticlesBuilder = import('../../components/particlesBuilder.js' /* webpackChunkName: "components/particles-builder" */).then(c => wrapFunctional(c.default || c))
export const LazyPostprocsBuilder = import('../../components/postprocsBuilder.js' /* webpackChunkName: "components/postprocs-builder" */).then(c => wrapFunctional(c.default || c))
export const LazyPrimaryLoadManager = import('../../components/primaryLoadManager.js' /* webpackChunkName: "components/primary-load-manager" */).then(c => wrapFunctional(c.default || c))
export const LazySceneBuilder = import('../../components/sceneBuilder.js' /* webpackChunkName: "components/scene-builder" */).then(c => wrapFunctional(c.default || c))
export const LazySequencesBuilder = import('../../components/sequencesBuilder.js' /* webpackChunkName: "components/sequences-builder" */).then(c => wrapFunctional(c.default || c))
export const LazySequencesManager = import('../../components/sequencesManager.js' /* webpackChunkName: "components/sequences-manager" */).then(c => wrapFunctional(c.default || c))
export const LazySpecificManualCameraTweenBuilder = import('../../components/specificManualCameraTweenBuilder.js' /* webpackChunkName: "components/specific-manual-camera-tween-builder" */).then(c => wrapFunctional(c.default || c))
export const LazyStates = import('../../components/states.js' /* webpackChunkName: "components/states" */).then(c => wrapFunctional(c.default || c))
export const LazyStick = import('../../components/stick.vue' /* webpackChunkName: "components/stick" */).then(c => wrapFunctional(c.default || c))
export const LazyThirdPersonCamera = import('../../components/thirdPersonCamera.js' /* webpackChunkName: "components/third-person-camera" */).then(c => wrapFunctional(c.default || c))
