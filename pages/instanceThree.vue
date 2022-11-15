<template>
	<div>
		<div class="debug-space">
			<!-- <p v-if="currentCamera">current camera name : {{ currentCamera.name }}</p> -->
			<pre>
				<p v-if="sequenceID">current sequence : {{ sequenceID }}</p>
			</pre>
			<div ref="stats" class="stats"></div>
		</div>
		<canvas 
			class="webgl" 
			ref="canvas"
			@mousemove="mouseMoveHandler"
		/>
			<!-- @mousemove="mouseMoveHandler" -->
	</div>
</template>

<script>

	import { core } from '@/static/config/core.js';
	import { worlds } from '@/static/config/worlds.js';
	import { SceneBuilder } from '@/components/sceneBuilder.js';
	import { SequencesManager } from '@/components/sequencesManager.js';

	import { TimelineLite } from 'gsap';

	// THREE
	import * as THREE from 'three';

	import * as Stats from 'stats.js';

	export default {

		props: {

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

			downScale: {
				type: Number,
				required: true
			}

		},

		data(){

			return {
				core,
				// Config from worlds.js
				worldConfig: worlds.find( world => world.sequences.find( seq => seq.id === this.sequenceID ) ),

				// Animation
				frameRate: 1/106,
				deltaTime: 0,

				sequenceID: "1.0",
				lastKnownSequenceID: "1.0",

				// Others
				canvasSizeRef: { 
					width: window.innerWidth / this.downScale, 
					height: window.innerHeight / this.downScale
					// width: 1280,
					// height: 700
				},
				mousePos: {
					x: 0,
					y: 0
				},
				mouseRecenterTimeoutID: null,

				debug: {
					animated: true,
					stats: true
				},

				stats: new Stats(),

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

			mousePos(){

				if( this.mouseRecenterTimeoutID ){
					clearTimeout(this.mouseRecenterTimeoutID);
				}

				this.mouseRecenterTimeoutID = setTimeout(
					this.mouseRecenter,
					this.core.mouse.moveTimeout * 1000
				);

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

			if( this.debug.stats ){

				this.stats.showPanel(0);
	
				this.$refs.stats.appendChild(this.stats.dom);

			}

			this.createScene();

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

				this.sceneBundle.primary = await this.sceneSkeleton.primary.createScene();

				this.sceneBundle.secondary = await this.sceneSkeleton.secondary.createScene();

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
					this.mousePos
				);

				this.sequencesManager.secondary = new SequencesManager(
					this.sceneBundle.secondary,
					this.$parent,
					this.renderer,
					this.clock,
					this.canvasSizeRef,
					this.mousePos
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

			mouseMoveHandler( event ){
				
				this.mousePos = {
					x: (((event.offsetX + this.canvasSizeRef.width / 2) / this.canvasSizeRef.width) - 1) * 2,
					y: (((event.offsetY + this.canvasSizeRef.height / 2) / this.canvasSizeRef.height) - 1) * -2
				};

			},

			mouseRecenter(){

				console.log("recentering the mousePos");

				const animatedObject = {
					x: this.mousePos.x,
					y: this.mousePos.y
				};

				const tlRecenter = new TimelineLite();

				tlRecenter.to(animatedObject, this.core.mouse.recenterDuration, {
					x: 0,
					y: 0,
					onUpdate( that ){

						that.mousePos.x = animatedObject.x;
						that.mousePos.y = animatedObject.y;

					},
					onUpdateParams: [this]
				});

			},
			
			initRenderer( currentWorldConfig ){

				// Renderer
				this.renderer = new THREE.WebGLRenderer({
					canvas: this.$refs.canvas,
					// ne peut pas être déclaré en dehors de l'instanciation
					antialias: true
				});

				this.renderer.setSize(this.canvasSizeRef.width / 2, this.canvasSizeRef.height / 2);

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

				if( this.debug.stats ){
					this.stats.begin();
				}

				this.deltaTime += this.clock.getDelta();

				this.sequencesManager.current.checkStuffsToAnimateAtRender(this.deltaTime, this.mousePos);
				
				// NOW CHECK IF FRAMERATE IS GOOD
				if( this.deltaTime > this.frameRate ){

					// NOW COMPUTE RENDER
					if( this.sequencesManager.current.composer ){
						console.log("use composer : ", this.sequencesManager.current.name);
						
						this.sequencesManager.current.composer.render();
						
					} else if( this.sceneBundle.current ) {
						console.log("use classic renderer : ", this.sceneBundle.current.name);

						this.renderer.render(this.sceneBundle.current.scene, this.sceneBundle.current.camera);

					}

					this.deltaTime = this.deltaTime % this.frameRate;

				}

				if( this.debug.stats ){
					this.stats.end();
				}

				window.requestAnimationFrame(this.mainTick);

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
  bottom: 25px;
  left: 5px;
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
