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

	import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
	import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

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
				scene1: null,

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

			"scene1.sceneIsReady"( newVal ){

				if( newVal ){
					this.onceSceneIsReady()
				}

			}

		},

		mounted(){

			this.scene1 = new SceneBuilder({
				worldConfig: this.worldConfig, 
				canvas: this.$refs.canvas,
				sequenceID: this.sequenceID
			});

		},

		methods: {

			onceSceneIsReady(){

				this.initRenderer(this.scene1.worldConfig);

				this.fillComposerBeforeRender();

				this.mainTick();

			},

			initRenderer( currentWorldConfig ){

				// Renderer
				this.renderer = new THREE.WebGLRenderer({
					canvas: this.$refs.canvas,
					// ne peut pas être déclaré en dehors de l'instanciation
					antialias: true
				});

				
				this.renderPass = new RenderPass(this.scene1.scene, this.scene1.camera);

				this.composer = new EffectComposer(this.renderer);

				this.composer.setSize(this.canvasSizeRef.width, this.canvasSizeRef.height);
				this.composer.setPixelRatio(window.devicePixelRatio);

				this.renderer.setSize(this.canvasSizeRef.width, this.canvasSizeRef.height);
				this.renderer.setPixelRatio(window.devicePixelRatio);

				this.renderer.setClearColor(currentWorldConfig.main.spaceColor);

				this.renderer.outputEncoding = THREE.sRGBEncoding;

				// this.renderer.shadowMap.enabled = true;

				// this.renderer.shadowMap.type = THREE.PCFShadowMap;

				this.clock = new THREE.Clock();

			},

			checkStuffsToAnimateAtRender( deltaTime ){
				// console.log("ok le check", this.scene1.sequencesElements[this.sequenceID].timelines)
				// a lot of stuffs to animate here

				// if an orbit helper is set
				this.scene1.sequencesElements[this.sequenceID].helpers.orbit?.update();



				// if any timeline is supposed to .play()
				if( this.scene1.sequencesElements[this.sequenceID].timelines ){

					Object.keys(this.scene1.sequencesElements[this.sequenceID].timelines).forEach(key => {

						if( this.scene1.sequencesElements[this.sequenceID].timelines[key]?.progress() === 0 ){
							this.scene1.sequencesElements[this.sequenceID].timelines[key].play();
						}

					});

				}

				// if any bob in the scene, he needs update for his moves
				if( this.scene1.sceneElements.bob.controller ){
					this.scene1.sceneElements.bob.controller._controls.Update(deltaTime);
				}

				// if third-person camera in the scene, it needs updates too
				// if( this.scene1.sequencesElements[this.sequenceID]. ){

				// 	this.currentThirdPersonCamera.Update(elapsedTime, this.mousePos);

				// }



				// if any BlenderTube is supposed to be played with it lookAt()
				if( this.scene1.sequencesElements[this.sequenceID].blenderTubesManager?._tubeTravelTargetPosition ){

					this.scene1.camera.lookAt(
						this.scene1.sequencesElements[this.sequenceID].blenderTubesManager._tubeTravelTargetPosition
					);

				}


				if( this.scene1.sequencesElements[this.sequenceID].postproc?.effect ){

					this.composer.addPass(this.scene1.sequencesElements[this.sequenceID].postproc.effect)

				}

				// etc..

			},

			fillComposerBeforeRender(){

				const keysToCheck = ["shadersPass", "effectsPass"];

				if( this.scene1.sequencesElements[this.sequenceID].postproc?.length ){

					const sequencePostprocs = this.scene1.sequencesElements[this.sequenceID].postproc;

					this.composer.addPass(this.renderPass);

					if( sequencePostprocs?.length ){

						sequencePostprocs.forEach(sequencePostproc => {

							keysToCheck.forEach(keyToCheck => {

								if( sequencePostproc[keyToCheck].length ){
	
									sequencePostproc[keyToCheck].forEach(oneKeyedPass => {
		
										this.composer.addPass(oneKeyedPass);
		
									});
		
								}

							});
	
						})

					}

				}

			},

			// RENDER
			mainTick(){

				if( !this.debug.animated ) return;

				window.requestAnimationFrame(this.mainTick);

				this.deltaTime += this.clock.getDelta()

				this.checkStuffsToAnimateAtRender(this.deltaTime);
				
				// NOW CHECK IF FRAMERATE IS GOOD
				if( this.deltaTime > this.frameRate ){

					// NOW COMPUTE RENDER
					if( this.scene1.sequencesElements[this.sequenceID].postproc.length ){

						this.composer.render();

					} else {

						this.renderer.render(this.scene1.scene, this.scene1.camera)

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
