import * as THREE from 'three';
import { core } from '@/static/config/core.js';
import { TimelineLite } from 'gsap';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

class SequencesManager{

	constructor(sceneBundle, cinema, renderer, clock, canvasSizeRef, mousePos, vm){

		this.sceneBundlePassed = sceneBundle;
		this.name = sceneBundle.name;
		this.cinema = cinema;
		this.renderer = renderer;
		this.composer = null;
		this.clock = clock;
		this.canvasSizeRef = canvasSizeRef;
		this.currentSequenceID = null;
		this.currentBobName = null;
		this.currentAliceName = null;
		this.mousePos = mousePos;
		this.isPlaying = false;
		this.bobHandleGround = true;
		this.vm = vm;
		this.stickedBobInputs = {};
		this.isCurrentlyTransitionning = false;
		this.axes = ["x", "y", "z"];

		this.vm.$nuxt.$on("bob-inputs-update", ( event ) => { this.updateBobStickedInputs(event, this) });

	}

	updateBobStickedInputs( event, that ){
		if( !that.currentBobName ){ return; }

		that.sceneBundlePassed.sceneElements.bobs[that.currentBobName]._controls._input._UpdateBobStickedInputs(event);

	}

	sequenceChangeHandler( newSequenceID, oldSequenceID ){

		this.isCurrentlyTransitionning = true;

		this.currentSequenceID = newSequenceID;

		console.log("____ _ _ _ change trigger : ", oldSequenceID, newSequenceID);

		const currentSequenceElements = this.sceneBundlePassed.sequencesElements[newSequenceID];

		this.updateCommonsValues(currentSequenceElements);

		this.killOldSequence(oldSequenceID);

		this.postProcChangeHandler(newSequenceID);

		this.updateFog(newSequenceID);

		this.bobImposedGestureHandler(newSequenceID);
		
		this.bobAndCameraNewPositionHandler(newSequenceID);
		
		this.bobVisibilitySwitcher(newSequenceID);
		
		this.aliceManager(newSequenceID);

		this.aliceImposedGestureHandler(newSequenceID);

		this.cameraFovChangeHandler(newSequenceID);

		this.worldBackgroundColorHandler(newSequenceID);

		this.activeGoodCastShadows(newSequenceID, oldSequenceID);


		this.sceneBundlePassed.sceneElements.newSequenceTriggerTime = this.clock.getElapsedTime();

		this.sceneBundlePassed.sceneElements.newSequenceTriggerTime += currentSequenceElements.cameraTriggerTimeDecay || 0;		


		setTimeout(() => {

			this.cinema.curtainActive = false;

			this.isCurrentlyTransitionning = false;

		}, 100);


	}

	updateCommonsValues( currentSequenceElements ){

		this.currentBobName = currentSequenceElements.sequenceBobName;

		this.currentAliceName = currentSequenceElements.aliceInfos?.name;

		this.currentAliceSlowmo = currentSequenceElements.aliceInfos?.slowmo || 1;

		this.currentAliceHandleGround = currentSequenceElements.aliceInfos?.handleGround;

		this.bobHandleGround = !(
			currentSequenceElements.bobImposedMoves?.fly 
			|| currentSequenceElements.bobImposedMoves?.floating 
			|| currentSequenceElements.bobImposedMoves?.climb
		);

	}

	killOldSequence( oldSequenceID ){
		if(!oldSequenceID){ return; }

		const oldTimelines = this.sceneBundlePassed.sequencesElements[oldSequenceID]?.timelines;

		if( oldTimelines ){
			Object.keys(oldTimelines).forEach(timelineKey => {

				if( oldTimelines[timelineKey] ){
					oldTimelines[timelineKey]?.kill();
					oldTimelines[timelineKey] = null;
				}

				console.log("oldTimeline killed : ", oldSequenceID, timelineKey);

			});
		}

	}

	aliceManager( newSequenceID ){

		if( !this.currentAliceName ){
			return;
		}
		
		const aliceInfos = this.sceneBundlePassed.sequencesElements[newSequenceID].aliceInfos;

		const newSequenceIDFormated = newSequenceID.replace(".", "-");

		const currentSceneElements = this.sceneBundlePassed.sceneElements;

		const aliceControls = currentSceneElements.bobs[this.currentAliceName]?._controls;

		const aliceFuturInfos = currentSceneElements.positionsCollection.find(position => position.name.includes("alice") && position.name.includes(newSequenceIDFormated));

		if( !aliceFuturInfos ){ return; }

		aliceControls._isAlice = true;

		aliceControls._target.visible = true;

		aliceControls._target.scale = new THREE.Vector3(
			aliceInfos.scale,
			aliceInfos.scale,
			aliceInfos.scale
		);

		aliceControls._target.position.copy(aliceFuturInfos.position);
		aliceControls._target.rotation.copy(aliceFuturInfos.rotation);

		if( aliceInfos.offset ){
			const { x,y,z } = aliceInfos.offset;

			aliceControls._target.position.x += x;
			aliceControls._target.position.y += y;
			aliceControls._target.position.z += z;
		}

		if( aliceInfos.rotate ){
			const { x,y,z } = aliceInfos.rotate;

			aliceControls._target.rotation.x += x;
			aliceControls._target.rotation.y += y;
			aliceControls._target.rotation.z += z;
		}

	}

	activeGoodCastShadows( newSequenceID, oldSequenceID ){

		this.sceneBundlePassed.sequencesElements[oldSequenceID]?.activeShadows.forEach(light => {
			this.updateInactiveSpotlight(light);
		});

		this.sceneBundlePassed.sequencesElements[newSequenceID]?.activeShadows.forEach(light => {
			this.updateActiveSpotlight(light, newSequenceID)
		});

	}
	
	updateFog( newSequenceID ){

		if( !this.sceneBundlePassed.sequencesElements[newSequenceID].fog ){ return; }

		const { color, intensity, enabled } =  this.sceneBundlePassed.sequencesElements[newSequenceID].fog;

		this.sceneBundlePassed.scene.fog = null; 
		
		if( enabled ){
			this.sceneBundlePassed.scene.fog = new THREE.FogExp2(color, intensity);
		}

	}

	updateInactiveSpotlight( lightToUpdate ){

		if( lightToUpdate.name.includes("for-bob-shadow") ){
			lightToUpdate.castShadow = false;
		}

	}

	updateActiveSpotlight( lightToUpdate, newSequenceID ){

		const formatedID = newSequenceID.replace(".", "-");
		const newCoords = this.sceneBundlePassed.sceneElements.positionsCollection.find(obj => obj.name.includes("bob") && obj.name.includes(formatedID))?.position;

		if( !newCoords ){ return; }

		const distance = newCoords.distanceTo(lightToUpdate.position);

		if( distance ){

			// console.log("- - - - - - update angle and intensity - - - - - - ", distance)

			lightToUpdate.angle = (Math.PI/80) / distance;

			// lightToUpdate.intensity = ((1 / distance) + 1) / 10;
			// lightToUpdate.intensity = 0;

		}

		if( lightToUpdate.name.includes("for-bob-shadow") ){
			lightToUpdate.castShadow = true;
		}



	}

	postProcChangeHandler( newSequenceID ){

		const sequencePostProcObj = this.sceneBundlePassed.sequencesElements[newSequenceID].postproc?.length;

		if( sequencePostProcObj ){

			this.initComposer();

			if( sequencePostProcObj.effect ){

				this.composer.addPass(this.sceneBundlePassed.sequencesElements[newSequenceID].postproc.effect)

			}

			this.fillComposer();

		} else {

			this.renderPass = null;
			this.composer = null;

		}

	}

	aliceImposedGestureHandler( newSequenceID ){

		const sequenceAlice = this.sceneBundlePassed.sequencesElements[newSequenceID]?.aliceInfos;

		if( !sequenceAlice ){ return; }

		const sequenceAliceImposedMoves = sequenceAlice.move;

		const goodAlice = this.sceneBundlePassed.sceneElements.bobs[sequenceAlice.name];

		if( goodAlice._controls._input ){

			goodAlice._controls._input._keys = {};
	
			if( sequenceAliceImposedMoves ){
	
				goodAlice._controls._input._imposedMoves = sequenceAliceImposedMoves;
	
				Object.keys(sequenceAliceImposedMoves).forEach(imposedKey => {
					goodAlice._controls._input._keys[imposedKey] = sequenceAliceImposedMoves[imposedKey];
				});
	
	
			} else {
	
				goodAlice._controls._input._imposedMoves = {};
	
			}

		}

	}

	bobImposedGestureHandler( newSequenceID ){

		const sequenceBobImposedMoves = this.sceneBundlePassed.sequencesElements[newSequenceID].bobImposedMoves;

		Object.keys(this.sceneBundlePassed.sceneElements.bobs).forEach(bobKey => {

			const goodBob = this.sceneBundlePassed.sceneElements.bobs[bobKey];

			if( goodBob._controls._input ){

				goodBob._controls._input._keys = {};
	
				if( sequenceBobImposedMoves ){
	
					goodBob._controls._input._imposedMoves = sequenceBobImposedMoves;
	
					Object.keys(sequenceBobImposedMoves).forEach(imposedKey => {
						goodBob._controls._input._keys[imposedKey] = sequenceBobImposedMoves[imposedKey];
					});
	
	
				} else {
	
					goodBob._controls._input._imposedMoves = {};
	
				}
	
	
				this.bobFlyingShadowsHandler(sequenceBobImposedMoves);

			}

		})


	}

	bobFlyingShadowsHandler( sequenceBobImposedMoves ){

		if( !this.currentBobName ){
			return;
		}

		const bob = this.sceneBundlePassed.sceneElements.bobs[this.currentBobName]._controls._target;

		// if bob is flying, we dont need shadows
		if( bob && sequenceBobImposedMoves?.fly ){

			bob.castShadow = false;
			
		} else {
			
			bob.castShadow = true;
			
		}

	}

	bobAndCameraNewPositionHandler( newSequenceID ){
		
		Object.keys(this.sceneBundlePassed.sceneElements.bobs).forEach(bobKey => {

			const goodBob = this.sceneBundlePassed.sceneElements.bobs[bobKey];

			if( !goodBob._controls ){ return; }

			const formatedID = newSequenceID.replace(".", "-");
			const newCoords = this.sceneBundlePassed.sceneElements.positionsCollection.find(obj => obj.name.includes("bob") && obj.name.includes(formatedID));

			const thirdPersonInstance = this.sceneBundlePassed.sequencesElements[newSequenceID]?.thirdPersonCamera[bobKey];
			
			if( newCoords ){

				goodBob._controls.Position = newCoords.position;
				goodBob._controls.Rotation = newCoords.rotation;

				if( thirdPersonInstance ){
					
					thirdPersonInstance._camera.position.copy(newCoords.position);
					thirdPersonInstance._camera.rotation.copy(newCoords.rotation);
					
					this.sceneBundlePassed.camera.position.copy(thirdPersonInstance._camera.position);
					
				} else {

					this.sceneBundlePassed.camera.position.copy(newCoords.position);
					this.sceneBundlePassed.camera.rotation.copy(newCoords.rotation);

				}

			} else {
				console.log("- - - - - - !! no new coords !! - - - - - - - ")
			}

		});


	}

	bobVisibilitySwitcher( newSequenceID ){

		const sequenceBobName = this.sceneBundlePassed.sequencesElements[newSequenceID].sequenceBobName;

		Object.keys(this.sceneBundlePassed.sceneElements.bobs).forEach(bobKey => {

			const goodBob = this.sceneBundlePassed.sceneElements.bobs[bobKey];

			if( goodBob._controls._target.name === sequenceBobName ){

				goodBob._controls._target.visible = true;
				
			} else {

				goodBob._controls._target.visible = false;

			}

		});

	}

	cameraFovChangeHandler( newSequenceID ){
		const goodCamera = this.sceneBundlePassed.camera;

		const goodSequence = this.sceneBundlePassed.worldConfig.sequences.find(seq => seq.id === newSequenceID);

		const baseFov = goodCamera.getEffectiveFOV();

		const destinationFov = goodSequence.baseFov;

		if( goodSequence.fovTransition ){
	
			const animatedObject = {
				animatedFov: baseFov
			};
	
			this.sceneBundlePassed.sequencesElements[newSequenceID].timelines.adjustFov = new TimelineLite();
			this.sceneBundlePassed.sequencesElements[newSequenceID].timelines.adjustFov.to(
				animatedObject,
				2,
				{
					animatedFov: destinationFov,
	
					onUpdate: () => {
						goodCamera.setFocalLength(animatedObject.animatedFov);
						// console.log("updateFov : ", goodCamera.getEffectiveFOV());
					},
	
					onComplete: () => {
						this.sceneBundlePassed.sequencesElements[newSequenceID].timelines.adjustFov = null;
					}
	
				}
			)

		} else {

			goodCamera.setFocalLength(destinationFov);

		}

	}

	initComposer(){

		this.renderPass = new RenderPass(this.sceneBundlePassed.scene, this.sceneBundlePassed.camera);

		this.composer = new EffectComposer(this.renderer);

		this.composer.setSize(this.canvasSizeRef.width, this.canvasSizeRef.height);

		this.composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

	}

	fillComposer(){

		const keysToCheck = ["shadersPass", "effectsPass"];

		const currentSequence = this.sceneBundlePassed.sequencesElements[this.currentSequenceID];

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

	}

	worldBackgroundColorHandler(newSequenceID){

		const goodWorld = this.sceneBundlePassed.worldConfig;
		const newSequenceHasPostProc = goodWorld.sequences.find(seq => seq.id === newSequenceID).postproc?.length;

		if( newSequenceHasPostProc && this.composer.renderer ){
			this.composer.renderer.setClearColor(this.sceneBundlePassed.worldConfig.main.spaceColorWithBloom);
		} else {
			this.renderer.setClearColor(this.sceneBundlePassed.worldConfig.main.spaceColor);
		}

	}

	checkStuffsToAnimateAtRender(deltaTime, currentMousePos){
		// a lot of stuffs to animate here

		const elapsedTime = this.clock.getElapsedTime();

		const currentSceneElements = this.sceneBundlePassed.sceneElements;
		const currentSequenceElements = this.sceneBundlePassed.sequencesElements[this.currentSequenceID];



		if( !currentSequenceElements ){
			debugger;
		}

		// if an orbit helper is set
		currentSequenceElements.helpers?.orbit?.update();


		// if any timeline is supposed to .play()
		if( currentSequenceElements.timelines ){

			Object.keys(currentSequenceElements.timelines).forEach(key => {

				if( currentSequenceElements.timelines[key]?.progress() === 0 ){
					currentSequenceElements.timelines[key].play();
				}

			});

		}

		// if any bob in the sequence, he needs update for his moves
		if( currentSceneElements.bobs[this.currentBobName] ){

			currentSceneElements.bobs[this.currentBobName]._controls.Update(
				deltaTime / currentSequenceElements.slowmo,
				currentMousePos,
				{
					bobNeedsToHandleGround: this.bobHandleGround,
					// stickedBobInputs: this.stickedBobInputs
				}
			);
		}

		// if any alice in the sequence, she needs update for her moves
		if( currentSceneElements.bobs[this.currentAliceName] ){
			currentSceneElements.bobs[this.currentAliceName]._controls.Update(
				deltaTime / this.currentAliceSlowmo,
				currentMousePos,
				{
					bobNeedsToHandleGround: this.currentAliceHandleGround
				}
			);
		}

		// if third-person camera in the scene, it needs updates too
		if( currentSequenceElements.thirdPersonCamera[this.currentBobName] ){
			currentSequenceElements.thirdPersonCamera[this.currentBobName].Update(
				this.sceneBundlePassed.sceneElements.newSequenceTriggerTime,
				elapsedTime, 
				currentMousePos,
				{
					cameraNeedsToHandleGround: this.bobHandleGround,
					isCurrentlyTransitionning: this.isCurrentlyTransitionning
				}
			);
		}

		// if any blur effect, focus needs updates : 
		if( currentSequenceElements.focusTarget?._controls ){
			this.focusTargetAndBlurTheRestHandler(currentSequenceElements);
		}

		// if any shadow is casted
		if( currentSequenceElements.activeShadows?.length && this.currentBobName ){

			currentSceneElements.bobs[this.currentBobName]._controls.UpdateDynamicLightShadowCamera(
				currentSequenceElements.activeShadows,
				this.currentSequenceID
			);

		}


		// if any BlenderTube is supposed to be played with its lookAt()
		if( currentSequenceElements.blenderTubesManager?._tubeTravelTargetPosition ){

			this.sceneBundlePassed.camera.lookAt(
				currentSequenceElements.blenderTubesManager._tubeTravelTargetPosition
			);

			currentSequenceElements.camera.rotation.y += (currentMousePos.x / 10)
			currentSequenceElements.camera.rotation.x += (currentMousePos.y / 10)

		}

		// if any fake-orbit
		if( currentSequenceElements.fakeOrbit ){

			currentSequenceElements.blenderTubesManager._FakeOrbit(currentMousePos, this.vm.$store.state.downScale);

		}


		// if any particles
		if( currentSceneElements.particlesCollection.length ){

			currentSceneElements.particlesCollection.forEach(particleInstance => {
				particleInstance._builtParticle.material.uniforms.uTime.value = elapsedTime;
			});

		}


		// if landscapeMove
		if( currentSequenceElements.sequenceInfos.landscapeMove ){

			this.axes.forEach(axe => {

				currentSceneElements.landscape.position[axe] += currentSequenceElements.sequenceInfos.landscapeMove[axe]

			});

		}

		// if particles -> update the downScaleRatio
		if( currentSceneElements.particlesCollection?.length ){

			if( this.vm.$store.state.downScale !== this.vm.$store.state.lastDownScale ){

				this.vm.$store.commit('setLastDownScale', this.vm.$store.state.downScale);

				currentSceneElements.particlesCollection.forEach(collection => {
	
					collection._builtParticle.material.uniforms.uDownScale.value = this.vm.$store.state.downScale;
					
					collection._builtParticle.material.uniformsNeedUpdate = true;
	
				});
				
			} else {

				currentSceneElements.particlesCollection.forEach(collection => {
	
					if( collection._builtParticle.material.uniformsNeedUpdate ){

						collection._builtParticle.material.uniformsNeedUpdate = false;

					}
	
				});

			}

		}

	}

	focusTargetAndBlurTheRestHandler( currentSequenceElements ){

		const { x, y, z } = this.sceneBundlePassed.camera.position;

		// compute distance beetween camera and target
		const distance = new THREE.Vector3(x,y,z).distanceTo({...currentSequenceElements.focusTarget._controls._position});

		// update focus value in blur effect
		currentSequenceElements.postproc.find(postproc => postproc.postprocType === "blur").effectsPass[0].uniforms.focus.value = distance

	}


}

export { SequencesManager };