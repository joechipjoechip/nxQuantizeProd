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

				this.sequenceChangeHandler(newVal, oldVal);

			}

		},

		mounted(){

			const createScene1 = new SceneBuilder({
				worldConfig: this.worldConfig, 
				canvas: this.$refs.canvas,
				sequenceID: this.sequenceID,
			});

			this.scene1 = createScene1.getSceneAndSequencesElements();

			console.log("scene1 -> ", this.scene1)

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

			sequenceChangeHandler( newSequenceID, oldSequenceID ){

				const triggerTimeDecay = this.scene1.sequencesElements[newSequenceID].cameraTriggerTimeDecay;

				this.currentBobName = this.scene1.sequencesElements[newSequenceID].sequenceBobName;



				this.killOldSequence(oldSequenceID);

				this.postProcChangeHandler(newSequenceID);

				this.updateFog(newSequenceID);

				this.bobImposedGestureHandler(newSequenceID);

				this.bobNewPositionHandler(newSequenceID);

				this.bobVisibilitySwitcher(newSequenceID);

				this.cameraFovChangeHandler(newSequenceID);

				this.worldBackgroundColorHandler(newSequenceID);

				this.activeGoodCastShadows(newSequenceID, oldSequenceID);

				// this.updateSpotlightAngle(newSequenceID);

				if( triggerTimeDecay ){
					this.scene1.sceneElements.newSequenceTriggerTime = this.clock.getElapsedTime() + triggerTimeDecay;
				} else {
					this.scene1.sceneElements.newSequenceTriggerTime = this.clock.getElapsedTime();
				}

				setTimeout(() => {
					this.$parent.curtainActive = false;
				}, 100)
	
			},

			killOldSequence( oldSequenceID ){
				const oldTimelines = this.scene1.sequencesElements[oldSequenceID]?.timelines;

				if( oldTimelines ){
					Object.keys(oldTimelines).forEach(timelineKey => {

						if( oldTimelines ){
							oldTimelines[timelineKey]?.kill();
							oldTimelines[timelineKey] = null;
						}

						console.log("oldTimeline killed : ", timelineKey);

					});
				}

			},

			activeGoodCastShadows( newSequenceID, oldSequenceID ){

				this.scene1.sequencesElements[oldSequenceID]?.activeShadows.forEach(light => {
					this.updateInactiveSpotlight(light);
				});

				this.scene1.sequencesElements[newSequenceID]?.activeShadows.forEach(light => {
					this.updateActiveSpotlight(light, newSequenceID)
				});

			},
			
			updateFog( newSequenceID ){

				if( !this.scene1.sequencesElements[newSequenceID].fog ){ return; }

				const { color, intensity, enabled } =  this.scene1.sequencesElements[newSequenceID].fog;

				this.scene1.scene.fog = null; 
				
				if( enabled ){
					this.scene1.scene.fog = new THREE.FogExp2(color, intensity);
				}

			},

			updateInactiveSpotlight( lightToUpdate ){
				lightToUpdate.intensity = 0;

				if( lightToUpdate.name.includes("for-bob-shadow") ){
					lightToUpdate.castShadow = false;
				}
			},

			updateActiveSpotlight( lightToUpdate, newSequenceID ){

				const formatedID = newSequenceID.replace(".", "-");
				const newCoords = this.scene1.sceneElements.positionsCollection.find(obj => obj.name.includes("bob") && obj.name.includes(formatedID))?.position;

				if( !newCoords ){ return; }

				const distance = newCoords.distanceTo(lightToUpdate.position);

				if( distance ){

					// console.log("- - - - - - update angle and intensity - - - - - - ", distance)

					lightToUpdate.angle = (Math.PI/100) / distance;

					lightToUpdate.intensity = (1 / distance) + 1;
	
				}

				if( lightToUpdate.name.includes("for-bob-shadow") ){
					lightToUpdate.castShadow = true;
				}



			},

			postProcChangeHandler( newSequenceID ){

				const sequencePostProcObj = this.scene1.sequencesElements[newSequenceID].postproc?.length;

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

			bobImposedGestureHandler( newSequenceID ){

				const sequenceBobImposedMoves = this.scene1.sequencesElements[newSequenceID].bobImposedMoves;

				Object.keys(this.scene1.sceneElements.bobs).forEach(bobKey => {

					this.scene1.sceneElements.bobs[bobKey]._controls._input._keys = {};

					if( sequenceBobImposedMoves ){

						this.scene1.sceneElements.bobs[bobKey]._controls._input._imposedMoves = sequenceBobImposedMoves;

						Object.keys(sequenceBobImposedMoves).forEach(imposedKey => {
							this.scene1.sceneElements.bobs[bobKey]._controls._input._keys[imposedKey] = sequenceBobImposedMoves[imposedKey];
						});


					} else {

						this.scene1.sceneElements.bobs[bobKey]._controls._input._imposedMoves = {};

					}


					this.bobFlyingShadowsHandler(sequenceBobImposedMoves);

				})


			},

			bobFlyingShadowsHandler( sequenceBobImposedMoves ){

				const bob = this.scene1.sceneElements.bobs[this.currentBobName]._controls._target;

				// if bob is flying, we dont need shadows
				if( bob && sequenceBobImposedMoves?.fly ){

					bob.castShadow = false;
					
				} else {
					
					bob.castShadow = true;
					
				}

			},

			bobNewPositionHandler( newSequenceID ){

				Object.keys(this.scene1.sceneElements.bobs).forEach(bobKey => {

					if( !this.scene1.sceneElements.bobs[bobKey]._controls ){ return; }
	
					const formatedID = newSequenceID.replace(".", "-");
					const newCoords = this.scene1.sceneElements.positionsCollection.find(obj => obj.name.includes("bob") && obj.name.includes(formatedID));
	
					console.log("la con de ses grand mort  : ", this.scene1.sequencesElements[newSequenceID] )
					const thirdPersonInstance = this.scene1.sequencesElements[newSequenceID]?.thirdPersonCamera[bobKey];
	
					if( newCoords ){
	
						this.scene1.sceneElements.bobs[bobKey]._controls.Position = newCoords.position;
						this.scene1.sceneElements.bobs[bobKey]._controls.Rotation = newCoords.rotation;
	
						if( thirdPersonInstance ){
	
							const oldStraightness = thirdPersonInstance._specs.straightness;
							thirdPersonInstance._specs.straightness = 1;
							
							thirdPersonInstance._camera.position.copy(newCoords.position);
							thirdPersonInstance._camera.rotation.copy(newCoords.rotation);
	
							setTimeout(() => {
								thirdPersonInstance._specs.straightness = oldStraightness;
							}, 5);
							
						} else {
	
							this.scene1.camera.position.copy(newCoords.position);
							this.scene1.camera.rotation.copy(newCoords.rotation);
	
						}
	
					} else {
						console.log("- - - - - - !! no new coords !! - - - - - - - ")
					}

				});


			},

			bobVisibilitySwitcher( newSequenceID ){

				const sequenceBobName = this.scene1.sequencesElements[newSequenceID].sequenceBobName;

				Object.keys(this.scene1.sceneElements.bobs).forEach(bobKey => {

					if( this.scene1.sceneElements.bobs[bobKey]._controls._target.name === sequenceBobName ){

						this.scene1.sceneElements.bobs[bobKey]._controls._target.visible = true;
						
					} else {

						this.scene1.sceneElements.bobs[bobKey]._controls._target.visible = false;

					}

				});

			},

			cameraFovChangeHandler( newSequenceID ){

				const baseFov = this.scene1.camera.fov;
				const destinationFov = worlds[0].sequences.find(seq => seq.id === newSequenceID).baseFov;

				const animatedObject = {
					animatedFov: baseFov
				};

				this.scene1.sequencesElements[newSequenceID].timelines.adjustFov = new TimelineLite();
				this.scene1.sequencesElements[newSequenceID].timelines.adjustFov.to(
					animatedObject,
					2,
					{
						animatedFov: destinationFov,

						onUpdate: () => {
							this.scene1.camera.fov = animatedObject.animatedFov;
							// console.log("ajusting fov, from/to : ", this.scene1.camera.fov);
						},

						onComplete: () => {
							this.scene1.sequencesElements[newSequenceID].timelines.adjustFov = null;
						}

					}
				)

			},

			worldBackgroundColorHandler(newSequenceID){

				const newSequenceHasPostProc = worlds[0].sequences.find(seq => seq.id === newSequenceID).postproc?.length;

				if( newSequenceHasPostProc ){
					this.composer.renderer.setClearColor(this.scene1.worldConfig.main.spaceColorWithBloom);
				} else {
					this.renderer.setClearColor(this.scene1.worldConfig.main.spaceColor);
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

				this.renderer.shadowMap.enabled = true;

				this.renderer.shadowMap.type = THREE.PCFShadowMap;

				this.clock = new THREE.Clock();

			},

			initComposer(){

				this.renderPass = new RenderPass(this.scene1.scene, this.scene1.camera);

				this.composer = new EffectComposer(this.renderer);

				this.composer.setSize(this.canvasSizeRef.width, this.canvasSizeRef.height);

				this.composer.setPixelRatio(window.devicePixelRatio);

			},

			fillComposer(){

				const keysToCheck = ["shadersPass", "effectsPass"];

				const currentSequence = this.scene1.sequencesElements[this.sequenceID];

				const sequencePostprocs = currentSequence?.postproc;


				if( sequencePostprocs ){

					this.composer.addPass(this.renderPass);

					sequencePostprocs.forEach(sequencePostproc => {

						// add shaderPass and effectsPass
						keysToCheck.forEach(keyToCheck => {

							if( sequencePostproc[keyToCheck].length ){

								sequencePostproc[keyToCheck].forEach(oneKeyedPass => {
	
									this.composer.addPass(oneKeyedPass);
	
								});
	
							}

						});

					});

				}

			},

			checkStuffsToAnimateAtRender( elapsedTime, deltaTime ){
				// a lot of stuffs to animate here

				const currentSceneElements = this.scene1.sceneElements;
				const currentSequenceElements = this.scene1.sequencesElements[this.sequenceID];



				// if an orbit helper is set
				currentSequenceElements.helpers.orbit?.update();


				// if any timeline is supposed to .play()
				if( currentSequenceElements.timelines ){

					Object.keys(currentSequenceElements.timelines).forEach(key => {

						if( currentSequenceElements.timelines[key]?.progress() === 0 ){
							currentSequenceElements.timelines[key].play();
						}

					});

				}

				// debugger;
				// if any bob in the scene, he needs update for his moves
				if( currentSceneElements.bobs[this.currentBobName] ){
					currentSceneElements.bobs[this.currentBobName]._controls.Update(
						deltaTime / currentSequenceElements.slowmo,
						this.mousePos,
						{
							isFlying: currentSequenceElements.bobImposedMoves?.fly
						}
					);
				}

				// if third-person camera in the scene, it needs updates too
				if( currentSequenceElements.thirdPersonCamera[this.currentBobName] ){
					currentSequenceElements.thirdPersonCamera[this.currentBobName].Update(
						this.scene1.sceneElements.newSequenceTriggerTime,
						elapsedTime, 
						this.mousePos,
						{
							isFlying: currentSequenceElements.bobImposedMoves?.fly
						}
					);
				}

				// if any blur effect, focus needs updates : 
				if( currentSequenceElements.focusTarget ){
					this.focusTargetAndBlurTheRestHandler(currentSequenceElements);
				}

				// if any shadow is casted
				if( this.scene1.sequencesElements[this.sequenceID].activeShadows?.length ){

					currentSceneElements.bobs.link._controls.UpdateDynamicLightShadowCamera(
						this.scene1.sequencesElements[this.sequenceID].activeShadows
					);

				}


				// if any BlenderTube is supposed to be played with its lookAt()
				if( currentSequenceElements.blenderTubesManager?._tubeTravelTargetPosition ){

					this.scene1.camera.lookAt(
						currentSequenceElements.blenderTubesManager._tubeTravelTargetPosition
					);

				}

				// etc..

			},

			focusTargetAndBlurTheRestHandler( currentSequenceElements ){

				const blurPostproc = currentSequenceElements.postproc.find(postproc => postproc.postprocType === "blur");

				const { x, y, z } = currentSequenceElements.thirdPersonCamera._camera.position;

				// compute distance beetween camera and target
				const distance = new THREE.Vector3(x,y,z).distanceTo({...currentSequenceElements.focusTarget._controls._position});


				// update focus value in blur effect
				blurPostproc.effectsPass[0].uniforms.focus.value = distance

				// console.log("blurPostproc stuffs distance --> ", distance, currentSequenceElements.focusTarget)

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
						console.log("use composer");
						
						this.composer.render();
						
					} else {
						console.log("use classic renderer");

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
