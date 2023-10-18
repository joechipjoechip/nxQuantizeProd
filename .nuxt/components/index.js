export { default as BenchmarkScore } from '../..\\components\\benchmarkScore.vue'
export { default as BenchmarkUi } from '../..\\components\\benchmarkUi.vue'
export { default as BlenderTubes } from '../..\\components\\BlenderTubes.js'
export { default as CharacterController } from '../..\\components\\characterController.js'
export { default as CinemaNew } from '../..\\components\\cinemaNew.vue'
export { default as CustomPhongShaderBuilder } from '../..\\components\\customPhongShaderBuilder.js'
export { default as CustomShaderBuilder } from '../..\\components\\customShaderBuilder.js'
export { default as DynamicLightsBuilder } from '../..\\components\\dynamicLightsBuilder.js'
export { default as Hud } from '../..\\components\\hud.vue'
export { default as IndexBackground } from '../..\\components\\indexBackground.vue'
export { default as IndexBody } from '../..\\components\\indexBody.vue'
export { default as InstanceThree } from '../..\\components\\instanceThree.vue'
export { default as Joystick } from '../..\\components\\joystick.vue'
export { default as Loopify } from '../..\\components\\loopify.js'
export { default as MainHub } from '../..\\components\\mainHub.vue'
export { default as MobileBlurCurtain } from '../..\\components\\mobileBlurCurtain.vue'
export { default as MouseHandler } from '../..\\components\\mouseHandler.vue'
export { default as ParticlesBuilder } from '../..\\components\\particlesBuilder.js'
export { default as PostprocsBuilder } from '../..\\components\\postprocsBuilder.js'
export { default as PrimaryLoadManager } from '../..\\components\\primaryLoadManager.js'
export { default as SceneBuilder } from '../..\\components\\sceneBuilder.js'
export { default as SceneDisposer } from '../..\\components\\sceneDisposer.js'
export { default as SequencesBuilder } from '../..\\components\\sequencesBuilder.js'
export { default as SequencesManager } from '../..\\components\\sequencesManager.js'
export { default as SpecificManualCameraTweenBuilder } from '../..\\components\\SpecificManualCameraTweenBuilder.js'
export { default as States } from '../..\\components\\states.js'
export { default as Stick } from '../..\\components\\stick.vue'
export { default as ThirdPersonCamera } from '../..\\components\\thirdPersonCamera.js'
export { default as UpdateBobWorker } from '../..\\components\\updateBob.worker.js'
export { default as Worker } from '../..\\components\\worker.js'
export { default as IconsArrowLeft } from '../..\\components\\icons\\arrow-left.vue'
export { default as IconsArrowRight } from '../..\\components\\icons\\arrow-right.vue'
export { default as IconsBandcamp } from '../..\\components\\icons\\bandcamp.vue'
export { default as IconsCamera } from '../..\\components\\icons\\camera.vue'
export { default as IconsInstagram } from '../..\\components\\icons\\instagram.vue'
export { default as IconsLinktree } from '../..\\components\\icons\\linktree.vue'
export { default as IconsMove } from '../..\\components\\icons\\move.vue'
export { default as IconsPlay } from '../..\\components\\icons\\play.vue'
export { default as IconsSpotify } from '../..\\components\\icons\\spotify.vue'
export { default as IconsWebsite } from '../..\\components\\icons\\website.vue'
export { default as IconsYoutube } from '../..\\components\\icons\\youtube.vue'
export { default as IconsZoom } from '../..\\components\\icons\\zoom.vue'
export { default as MicroBasicLoader } from '../..\\components\\micro\\basicLoader.vue'
export { default as MicroLoaderOne } from '../..\\components\\micro\\loaderOne.vue'

// nuxt/nuxt.js#8607
function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
