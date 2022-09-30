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
		/>
			<!-- @mousemove="mouseMoveHandler" -->
	</div>
</template>

<script>

	import { worlds } from '@/static/config/worlds.js';
	import { SceneBuilder } from '@/components/sceneBuilder.js';

	// THREE
	import * as THREE from 'three';

	export default {

		props: {
			sequenceID: {
				type: String,
				required: true
			}
		},

		data(){
			return {
				// Config from worlds.js
				worldConfig: worlds.find( world => world.sequences.find( seq => seq.id === this.sequenceID ) ),
				act1: null,

				// Animation
				frameRate: 1/60,
				deltaTime: 0,

				// Others
				canvasSizeRef: { 
					width: window.innerWidth, 
					height: window.innerHeight
				},
				debug: {
					animated: true
				}
			}
		},

		watch: {

			"act1.sceneIsReady"( newVal ){

				if( newVal ){
					this.onceSceneIsReady()
				}

			}

		},

		mounted(){

			this.act1 = new SceneBuilder({
				worldConfig: this.worldConfig, 
				canvas: this.$refs.canvas,
				sequenceID: this.sequenceID
			});

		},

		methods: {

			onceSceneIsReady(){

				this.initRenderer(this.act1.worldConfig);

				this.mainTick();

			},

			initRenderer( currentWorldConfig ){

				// Renderer
				this.renderer = new THREE.WebGLRenderer({
					canvas: this.$refs.canvas,
					// ne peut pas être déclaré en dehors de l'instanciation
					antialias: true
				});

				this.renderer.setPixelRatio(window.devicePixelRatio);

				this.renderer.setSize(this.canvasSizeRef.width, this.canvasSizeRef.height);

				this.renderer.setClearColor(currentWorldConfig.main.spaceColor);

				this.renderer.outputEncoding = THREE.sRGBEncoding;

				// this.renderer.shadowMap.enabled = true;

				// this.renderer.shadowMap.type = THREE.PCFShadowMap;

				this.clock = new THREE.Clock();

			},

			checkStuffsToAnimateAtRender(){
				// console.log("ok le check", this.act1.sequencesElements[this.sequenceID].timelines)
				// a lot of stuffs to animate here

				// if an orbit helper is set
				this.act1.sequencesElements[this.sequenceID].helpers.orbit?.update();



				// if any timeline is supposed to .play()
				if( this.act1.sequencesElements[this.sequenceID].timelines ){

					Object.keys(this.act1.sequencesElements[this.sequenceID].timelines).forEach(key => {

						if( this.act1.sequencesElements[this.sequenceID].timelines[key]?.progress() === 0 ){
							this.act1.sequencesElements[this.sequenceID].timelines[key].play();
						}

					});

				}



				// if any BlenderTube is supposed to be played with it lookAt()
				if( this.act1.sequencesElements[this.sequenceID].blenderTubesManager?._tubeTravelTargetPosition ){

					this.act1.camera.lookAt(
						this.act1.sequencesElements[this.sequenceID].blenderTubesManager._tubeTravelTargetPosition
					);
				}

				// etc..

			},

			// RENDER
			mainTick(){

				if( !this.debug.animated ) return;

				window.requestAnimationFrame(this.mainTick);

				this.deltaTime += this.clock.getDelta()

				this.checkStuffsToAnimateAtRender();
				
				// NOW CHECK IF FRAMERATE IS GOOD
				if( this.deltaTime > this.frameRate ){

					// NOW COMPUTE RENDER
					this.renderer.render(this.act1.scene, this.act1.camera);

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
  top: 25px;
  left: 5px;
  background-color: rgba(0,0,200, .5);
  pointer-events: none;

  * {
    padding: 0 15px;
    color: white;
  }
}
</style>
