import { wrapFunctional } from './utils'

export { default as CanvasVideo } from '../../components/canvasVideo.vue'
export { default as CharacterController } from '../../components/characterController.js'
export { default as DynamicLightsBuilder } from '../../components/dynamicLightsBuilder.js'
export { default as ThirdPersonCamera } from '../../components/thirdPersonCamera.js'

export const LazyCanvasVideo = import('../../components/canvasVideo.vue' /* webpackChunkName: "components/canvas-video" */).then(c => wrapFunctional(c.default || c))
export const LazyCharacterController = import('../../components/characterController.js' /* webpackChunkName: "components/character-controller" */).then(c => wrapFunctional(c.default || c))
export const LazyDynamicLightsBuilder = import('../../components/dynamicLightsBuilder.js' /* webpackChunkName: "components/dynamic-lights-builder" */).then(c => wrapFunctional(c.default || c))
export const LazyThirdPersonCamera = import('../../components/thirdPersonCamera.js' /* webpackChunkName: "components/third-person-camera" */).then(c => wrapFunctional(c.default || c))
