self.addEventListener('message', (event) => {
    
    console.log('[WORKER] message recu chez le worker : ', event.data)

})


// pour insérer un worker qqpart : 
// import { BobWorker } from '@/components/updateBob.worker.js';
// (et checker le worker-injector.js)


// puis

// worker = vm.$worker.createWorker();

// worker.addEventListener('message', workerResponseHandler);

// // worker.postMessage('Message sent to worker');



// puis le handler : 
// workerResponseHandler(event) {
//     console.log('[WORKER COMPUTED RESPONSE]', event.data)
// }