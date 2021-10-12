import { wrapFunctional } from './utils'

export { default as NuxtLogo } from '../../components/NuxtLogo.vue'
export { default as Tutorial } from '../../components/Tutorial.vue'
export { default as CanvasVideo } from '../../components/canvasVideo.vue'
export { default as CharacterController } from '../../components/characterController.js'
export { default as ThirdPersonCamera } from '../../components/thirdPersonCamera.js'

export const LazyNuxtLogo = import('../../components/NuxtLogo.vue' /* webpackChunkName: "components/nuxt-logo" */).then(c => wrapFunctional(c.default || c))
export const LazyTutorial = import('../../components/Tutorial.vue' /* webpackChunkName: "components/tutorial" */).then(c => wrapFunctional(c.default || c))
export const LazyCanvasVideo = import('../../components/canvasVideo.vue' /* webpackChunkName: "components/canvas-video" */).then(c => wrapFunctional(c.default || c))
export const LazyCharacterController = import('../../components/characterController.js' /* webpackChunkName: "components/character-controller" */).then(c => wrapFunctional(c.default || c))
export const LazyThirdPersonCamera = import('../../components/thirdPersonCamera.js' /* webpackChunkName: "components/third-person-camera" */).then(c => wrapFunctional(c.default || c))
