import { wrapFunctional } from './utils'

export { default as BlenderTubes } from '../../components/BlenderTubes.js'
export { default as GuiManager } from '../../components/GuiManager.js'
export { default as SpecificManualCameraTweenBuilder } from '../../components/SpecificManualCameraTweenBuilder.js'
export { default as CharacterController } from '../../components/characterController.js'
export { default as DynamicLightsBuilder } from '../../components/dynamicLightsBuilder.js'
export { default as ThirdPersonCamera } from '../../components/thirdPersonCamera.js'

export const LazyBlenderTubes = import('../../components/BlenderTubes.js' /* webpackChunkName: "components/blender-tubes" */).then(c => wrapFunctional(c.default || c))
export const LazyGuiManager = import('../../components/GuiManager.js' /* webpackChunkName: "components/gui-manager" */).then(c => wrapFunctional(c.default || c))
export const LazySpecificManualCameraTweenBuilder = import('../../components/SpecificManualCameraTweenBuilder.js' /* webpackChunkName: "components/specific-manual-camera-tween-builder" */).then(c => wrapFunctional(c.default || c))
export const LazyCharacterController = import('../../components/characterController.js' /* webpackChunkName: "components/character-controller" */).then(c => wrapFunctional(c.default || c))
export const LazyDynamicLightsBuilder = import('../../components/dynamicLightsBuilder.js' /* webpackChunkName: "components/dynamic-lights-builder" */).then(c => wrapFunctional(c.default || c))
export const LazyThirdPersonCamera = import('../../components/thirdPersonCamera.js' /* webpackChunkName: "components/third-person-camera" */).then(c => wrapFunctional(c.default || c))
