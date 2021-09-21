import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _72230dce = () => interopDefault(import('../pages/cinema.vue' /* webpackChunkName: "pages/cinema" */))
const _dbdab410 = () => interopDefault(import('../pages/clip.vue' /* webpackChunkName: "pages/clip" */))
const _7c900d7c = () => interopDefault(import('../pages/mountainWithPathBackup.vue' /* webpackChunkName: "pages/mountainWithPathBackup" */))
const _4e5a0f6e = () => interopDefault(import('../pages/sceneTestingKeyframes.vue' /* webpackChunkName: "pages/sceneTestingKeyframes" */))
const _555b3f1a = () => interopDefault(import('../pages/world.vue' /* webpackChunkName: "pages/world" */))
const _3b66a74c = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/cinema",
    component: _72230dce,
    name: "cinema"
  }, {
    path: "/clip",
    component: _dbdab410,
    name: "clip"
  }, {
    path: "/mountainWithPathBackup",
    component: _7c900d7c,
    name: "mountainWithPathBackup"
  }, {
    path: "/sceneTestingKeyframes",
    component: _4e5a0f6e,
    name: "sceneTestingKeyframes"
  }, {
    path: "/world",
    component: _555b3f1a,
    name: "world"
  }, {
    path: "/",
    component: _3b66a74c,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
