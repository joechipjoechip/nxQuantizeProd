import BobWorker from '@/components/updateBob.worker.js';

console.log("le plugin injector : ", new BobWorker())

export  default (context, inject) => {
  inject('worker', {
   createWorker () {
   return new BobWorker()
  }
 })
}