<template>
	<div>
		<div class="debug-space">
			<!-- <pre>
				<p v-if="sequenceID">current sequence : {{ sequenceID }}</p>
				<p v-if="viewPos">viewPos : {{ viewPos }}</p>
			</pre> -->
			<div ref="currentFPS" class="stats">{{ currentFPSValue }}</div>
			<div ref="downScale" class="stats">{{ $store.state.downScale }}</div>
		</div>

		<canvas 
			class="webgl" 
			ref="canvas"
		/>

	</div>
</template>

<script>
	
	import { worlds } from '@/static/config/worlds.js';
	import { SceneBuilder } from '@/components/sceneBuilder.js';
	import { SequencesManager } from '@/components/sequencesManager.js';

	// THREE
	import * as THREE from 'three';

	export default {

		props: {

			canvasSizeRef: {
				type: Object,
				required: true
			},

			glbs: {
				type: Array,
				required: true
			},

			textures: {
				type: Array,
				required: true
			},

			bobs: {
				type: Array,
				required: true
			},

			viewPos: {
				type: Object,
				required: true
			}

		},

		data(){

			return {
				// Config from worlds.js
				worldConfig: worlds.find( world => world.sequences.find( seq => seq.id === this.sequenceID ) ),

				// Animation
				frameRate: 1/106,
				deltaTime: 0,

				sequenceID: "1.0",
				lastKnownSequenceID: "1.0",

				// Others
				debug: {
					animated: true,
					stats: true
				},

				currentFPS: 0,
				startTime: performance.now(),
				currentFPSValue: 0,
				frames: 0,
				isAdjustingDownScale: false,

				arbitraryFpsIdeal: 60,
				arbitraryFpsLimit: 50,
				arbitraryDownScaleLimit: 2.5,

				currentBobName: null,

				sceneSkeleton: {
					current: null,
					primary: null,
					secondary: null
				},
				
				sceneBundle: {
					current: null,
					primary: null,
					secondary: null
				},

				sequencesManager: {
					current: null,
					primary: null,
					secondary: null
				}

			}

		},

		watch: {

			"sceneSkeleton.current"(newVal){

				this.sceneBundle.current = this.sceneBundle[newVal.type];
				
				this.sequencesManager.current = this.sequencesManager[newVal.type];
				
				this.sceneSkeleton.current.refreshBobs(this.bobs, this.sceneBundle.current.scene);

				this.sequencesManager.current.sequenceChangeHandler(this.sequenceID);

			},

			"sceneBundle.primary"(){
				this.checkIfAllScenesAreReady();
			},
			"sceneBundle.secondary"(){
				this.checkIfAllScenesAreReady();
			},

			sequenceID(newVal, oldVal){

				this.sequencesManager.current.sequenceChangeHandler(newVal, oldVal);

			},

			"canvasSizeRef.width"(){
				this.renderer.setSize(this.canvasSizeRef.width, this.canvasSizeRef.height);

				Object.keys(this.sceneSkeleton).forEach(skeletonKey => {

					this.sceneSkeleton[skeletonKey].onResize(this.canvasSizeRef);
					
				});
			}

		},

		mounted(){

			this.createScene();

			// this.arbitraryFpsLimit = this.$store.state.isMobile ? 25 : 50;
			// this.arbitraryFpsIdeal = this.$store.state.isMobile ? 30 : 60;

		},

		methods: {

			async createScene(){

				this.sceneSkeleton.primary = new SceneBuilder({
					worldConfig: worlds[0], 
					sequenceID: this.sequenceID,
					canvas: this.$refs.canvas,

					glb: this.glbs[0],
					texture: this.textures[0],
					bobs: this.bobs,
					type: "primary"
				});
				
				this.sceneSkeleton.secondary = new SceneBuilder({
					worldConfig: worlds[1], 
					sequenceID: this.sequenceID,
					canvas: this.$refs.canvas,

					glb: this.glbs[1],
					texture: this.textures[1],
					bobs: this.bobs,
					type: "secondary"
				});

				this.sceneBundle.primary = await this.sceneSkeleton.primary.returnBundle();

				this.sceneBundle.secondary = await this.sceneSkeleton.secondary.returnBundle();

			},

			checkIfAllScenesAreReady(){
				
				if( this.sceneBundle.primary && this.sceneBundle.secondary ){

					this.initRenderer(this.sceneBundle.primary.worldConfig);

					this.createSequencesManagers();

					this.sceneSkeleton.current = this.sceneSkeleton.primary;

					this.mainTick();

				}

			},

			createSequencesManagers(){

				this.sequencesManager.primary = new SequencesManager(
					this.sceneBundle.primary,
					this.$parent,
					this.renderer,
					this.clock,
					this.canvasSizeRef,
					this.viewPos,
					this
				);

				this.sequencesManager.secondary = new SequencesManager(
					this.sceneBundle.secondary,
					this.$parent,
					this.renderer,
					this.clock,
					this.canvasSizeRef,
					this.viewPos,
					this
				);

				this.sequencesManager.current = this.sequencesManager.primary;

				this.sequencesManager.current.sequenceChangeHandler(this.sequenceID);

			},

			changeSceneHandler(){

				if( this.sceneBundle.current.name === this.sceneBundle.primary.name ){

					this.sceneSkeleton.current = this.sceneSkeleton.secondary;

				} else {

					this.sceneSkeleton.current = this.sceneSkeleton.primary;

				}

			},

			
			
			initRenderer( currentWorldConfig ){

				// Renderer
				this.renderer = new THREE.WebGLRenderer({
					canvas: this.$refs.canvas,
					// ne peut pas être déclaré en dehors de l'instanciation
					antialias: true
				});

				this.renderer.setSize(this.canvasSizeRef.width, this.canvasSizeRef.height);

				this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

				this.renderer.setClearColor(currentWorldConfig.main.spaceColor);

				this.renderer.outputEncoding = THREE.sRGBEncoding;

				this.renderer.shadowMap.enabled = true;

				this.renderer.shadowMap.type = THREE.PCFShadowMap;

				this.clock = new THREE.Clock();

			},

			// RENDER
			mainTick(){

				if( !this.debug.animated ) return;

				this.computeFPS();

				this.deltaTime += this.clock.getDelta();

				this.sequencesManager.current.checkStuffsToAnimateAtRender(this.deltaTime, this.viewPos);
				
				// NOW CHECK IF FRAMERATE IS GOOD
				if( this.deltaTime > this.frameRate ){
	
					this.handleFpsAndDownScaling();

					// NOW COMPUTE RENDER
					if( this.sequencesManager.current.composer ){
						// console.log("use composer : ", this.sequencesManager.current.name);
						
						this.sequencesManager.current.composer.render();
						
					} else if( this.sceneBundle.current ) {
						// console.log("use classic renderer : ", this.sceneBundle.current.name);

						this.renderer.render(this.sceneBundle.current.scene, this.sceneBundle.current.camera);

					}

					this.deltaTime = this.deltaTime % this.frameRate;

				}

				window.requestAnimationFrame(this.mainTick);

			},

			computeFPS(){
				const t = performance.now();
				const dt = t - this.startTime;

				if( dt > 100 ){
					this.currentFPSValue = parseInt(this.frames * 1000 / dt);

					this.frames = 0;
					this.startTime = t;
				}
				this.frames++;
			},

			handleFpsAndDownScaling(){

				if( this.isAdjustingDownScale ){ return; }


				if( this.currentFPSValue < this.arbitraryFpsLimit || this.$store.state.downScale > this.arbitraryDownScaleLimit ){
					// console.log("adjusting start : fps value : ----> ", this.currentFPSValue);

					this.isAdjustingDownScale = true;

					this.performanceTimeoutID = setTimeout(() => {
						
						if( this.currentFPSValue < this.arbitraryFpsLimit || this.$store.state.downScale > this.arbitraryDownScaleLimit ){
							// console.log("adjusting verify (in timeout): fps value : ", this.currentFPSValue);

							const diff = (this.arbitraryFpsIdeal - this.currentFPSValue) / 10;

							this.$store.commit('setDownScale', (1 + diff));

							this.isAdjustingDownScale = false;

						} else {
							// console.log("finally cancelled because fps is now : ", this.currentFPSValue);
							this.clearDownScaleTimeout();

						}

					}, 2000);

				} else {

					this.clearDownScaleTimeout();

				}

			},

			clearDownScaleTimeout(){
				
				if( this.performanceTimeoutID ){

					clearTimeout(this.performanceTimeoutID);
					this.performanceTimeoutID = null;
					this.isAdjustingDownScale = false;

				}

			}

		}

	}

</script>

<style lang="scss" scoped>

canvas {
  z-index: 3;
  width: 100% !important;
  height: 100% !important;
  // position: fixed;
  // top: 0;
  // left: 0;
  outline: none;
  pointer-events: all;
}

p {
  z-index: 5;
  color: black;
}

.debug-space {
  position: absolute;
  top: 15px;
  left: 15px;
  padding: 0;
  margin: 0;
  background-color: rgba(0,0,200, .5);
  pointer-events: none;

  * {
    padding: 0 15px;
    margin: 0;
    color: white;
  }
}
</style>
