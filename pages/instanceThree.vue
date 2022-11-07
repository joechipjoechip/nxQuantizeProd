<template>
	<div>
		<div class="debug-space">
			<!-- <p v-if="currentCamera">current camera name : {{ currentCamera.name }}</p> -->
			<pre>
				<p v-if="sequenceID">current sequence : {{ sequenceID }}</p>
			</pre>
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

	export default {

		props: {

			sequenceID: {
				type: String,
				required: true
			},

			worlds: {
				type: Object,
				required: true
			},

			bob: {
				type: Object,
				required: true
			}

		},

		data(){

			return {
				core,
				// Config from worlds.js
				worldConfig: worlds.find( world => world.sequences.find( seq => seq.id === this.sequenceID ) ),
				scene1: null,

				// Animation
				frameRate: 1/106,
				deltaTime: 0,

				// Others
				canvasSizeRef: { 
					width: window.innerWidth, 
					height: window.innerHeight
					// width: 1280,
					// height: 700
				},
				mousePos: {
					x: 0,
					y: 0
				},
				mouseRecenterTimeoutID: null,

				debug: {
					animated: true
				},

				currentBobName: null
			}

		},

		watch: {

			"scene1.sceneIsReady"( newVal ){

				if( newVal ){
					this.onceSceneIsReady()
				}

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

				this.sequencesManager1.sequenceChangeHandler(newVal, oldVal);

			}

		},

		mounted(){



			// const createScene1 = new SceneBuilder({
			// 	worldConfig: this.worldConfig, 
			// 	canvas: this.$refs.canvas,
			// 	sequenceID: this.sequenceID,
			// });

			// // 

			// this.scene1 = createScene1.getSceneAndSequencesElements();

		},

		methods: {

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

			onceSceneIsReady(){

				this.initRenderer(this.scene1.worldConfig);

				this.sequencesManager1 = new SequencesManager(
					this.scene1,
					this.$parent,
					this.renderer,
					this.clock,
					this.canvasSizeRef,
					this.mousePos
				);

				this.sequencesManager1.sequenceChangeHandler(this.sequenceID);

				this.mainTick();

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

				window.requestAnimationFrame(this.mainTick);

				this.deltaTime += this.clock.getDelta();

				this.sequencesManager1.checkStuffsToAnimateAtRender(this.deltaTime, this.mousePos);
				
				// NOW CHECK IF FRAMERATE IS GOOD
				if( this.deltaTime > this.frameRate ){

					// NOW COMPUTE RENDER
					if( this.sequencesManager1.composer ){
						console.log("use composer");
						
						this.sequencesManager1.composer.render();
						
					} else {
						console.log("use classic renderer");

						this.renderer.render(this.scene1.scene, this.scene1.camera);

					}

					this.deltaTime = this.deltaTime % this.frameRate;

				}
			}

		}

	}

</script>

<style lang="scss" scoped>

canvas {
  z-index: 3;
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
