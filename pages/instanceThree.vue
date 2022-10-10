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

	import { TimelineLite } from 'gsap';

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
				core,
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
				mousePos: {
					x: 0,
					y: 0
				},
				mouseRecenterTimeoutID: null,

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

			sequenceID(newVal){

				this.sequenceChangeHandler(newVal);

			}

		},

		mounted(){

			this.scene1 = new SceneBuilder({
				worldConfig: this.worldConfig, 
				canvas: this.$refs.canvas,
				sequenceID: this.sequenceID
			});

			// this.initComposer();
			// this.fillComposer();

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

				this.sequenceChangeHandler(this.sequenceID);

				this.mainTick();

			},

			sequenceChangeHandler( newSequenceID ){

				const sequencePostProcObj = this.scene1.sequencesElements[newSequenceID].postproc;

				if( sequencePostProcObj ){

					this.initComposer();

					if( sequencePostProcObj.effect ){

						this.composer.addPass(this.scene1.sequencesElements[newSequenceID].postproc.effect)

					}

					this.fillComposer();

				} else {

					this.renderPass = null;
					this.composer = null;

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
				this.renderer.setPixelRatio(window.devicePixelRatio);

				this.renderer.setClearColor(currentWorldConfig.main.spaceColor);

				this.renderer.outputEncoding = THREE.sRGBEncoding;

				// this.renderer.shadowMap.enabled = true;

				// this.renderer.shadowMap.type = THREE.PCFShadowMap;

				this.clock = new THREE.Clock();

			},

			fillComposer(){

				const keysToCheck = ["shadersPass", "effectsPass"];

				const sequencePostprocs = this.scene1.sequencesElements[this.sequenceID]?.postproc;

				if( sequencePostprocs ){

					this.composer.addPass(this.renderPass);

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

			},

			initComposer(){

				this.renderPass = new RenderPass(this.scene1.scene, this.scene1.camera);

				this.composer = new EffectComposer(this.renderer);

				this.composer.setSize(this.canvasSizeRef.width, this.canvasSizeRef.height);

				this.composer.setPixelRatio(window.devicePixelRatio);

			},

			checkStuffsToAnimateAtRender( elapsedTime, deltaTime ){
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
				if( this.scene1.sequencesElements[this.sequenceID].thirdPersonCamera ){

					this.scene1.sequencesElements[this.sequenceID].thirdPersonCamera.Update(elapsedTime, this.mousePos);

				}



				// if any BlenderTube is supposed to be played with it lookAt()
				if( this.scene1.sequencesElements[this.sequenceID].blenderTubesManager?._tubeTravelTargetPosition ){

					this.scene1.camera.lookAt(
						this.scene1.sequencesElements[this.sequenceID].blenderTubesManager._tubeTravelTargetPosition
					);

				}

				// etc..

			},

			// RENDER
			mainTick(){

				if( !this.debug.animated ) return;

				window.requestAnimationFrame(this.mainTick);

				this.deltaTime += this.clock.getDelta();

				this.checkStuffsToAnimateAtRender(this.clock.getElapsedTime(), this.deltaTime);
				
				// NOW CHECK IF FRAMERATE IS GOOD
				if( this.deltaTime > this.frameRate ){

					// NOW COMPUTE RENDER
					if( this.composer ){

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
