import * as THREE from 'three';
import { worlds } from '@/static/config/worlds.js';
import { TimelineLite } from 'gsap';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

class SequencesManager{

	constructor(sceneBundle, cinema, renderer, clock, canvasSizeRef, mousePos){

		this.sceneBundlePassed = sceneBundle;
		this.name = sceneBundle.name;
		this.cinema = cinema;
		this.renderer = renderer;
		this.composer = null;
		this.clock = clock;
		this.canvasSizeRef = canvasSizeRef;
		this.currentSequenceID = null;
		this.currentBobName = null;
		this.mousePos = mousePos;
		this.isPlaying = false;
		this.handleGround = true;

	}

	sequenceChangeHandler( newSequenceID, oldSequenceID ){

		this.currentSequenceID = newSequenceID;

		console.log("____ _ _ _ change trigger : ", oldSequenceID, newSequenceID);

		const currentSequenceElements = this.sceneBundlePassed.sequencesElements[newSequenceID];

		const triggerTimeDecay = currentSequenceElements.cameraTriggerTimeDecay;

		this.currentBobName = currentSequenceElements.sequenceBobName;

		this.handleGround = !(
			currentSequenceElements.bobImposedMoves?.fly 
			|| currentSequenceElements.bobImposedMoves?.floating 
			|| currentSequenceElements.bobImposedMoves?.climb
		);

		this.killOldSequence(oldSequenceID);

		this.postProcChangeHandler(newSequenceID);

		this.updateFog(newSequenceID);

		this.bobImposedGestureHandler(newSequenceID);

		this.bobAndCameraNewPositionHandler(newSequenceID);

		this.bobVisibilitySwitcher(newSequenceID);

		this.cameraFovChangeHandler(newSequenceID);

		this.worldBackgroundColorHandler(newSequenceID);

		this.activeGoodCastShadows(newSequenceID, oldSequenceID);
		
		

		if( triggerTimeDecay ){
			this.sceneBundlePassed.sceneElements.newSequenceTriggerTime = this.clock.getElapsedTime() + triggerTimeDecay;
		} else {
			this.sceneBundlePassed.sceneElements.newSequenceTriggerTime = this.clock.getElapsedTime();
		}

		setTimeout(() => {
			this.cinema.curtainActive = false;
		}, 100)

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

	bobImposedGestureHandler( newSequenceID ){

		const sequenceBobImposedMoves = this.sceneBundlePassed.sequencesElements[newSequenceID].bobImposedMoves;

		Object.keys(this.sceneBundlePassed.sceneElements.bobs).forEach(bobKey => {

			const goodBob = this.sceneBundlePassed.sceneElements.bobs[bobKey];

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

		})


	}

	bobFlyingShadowsHandler( sequenceBobImposedMoves ){

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

					const oldStraightness = thirdPersonInstance._specs.straightness;
					thirdPersonInstance._specs.straightness = 1;
					
					thirdPersonInstance._camera.position.copy(newCoords.position);
					thirdPersonInstance._camera.rotation.copy(newCoords.rotation);

					
					setTimeout(() => {
						thirdPersonInstance._specs.straightness = oldStraightness;
					}, 50);
					
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

		const goodCamera = this.sceneBundlePassed.scene.children.find(child => child.name === "third-person-camera");
		const baseFov = goodCamera.fov;
		const destinationFov = this.sceneBundlePassed.worldConfig.sequences.find(seq => seq.id === newSequenceID).baseFov;

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
					goodCamera.fov = animatedObject.animatedFov;
				},

				onComplete: () => {
					this.sceneBundlePassed.sequencesElements[newSequenceID].timelines.adjustFov = null;
				}

			}
		)

	}

	initComposer(){

		this.renderPass = new RenderPass(this.sceneBundlePassed.scene, this.sceneBundlePassed.camera);

		this.composer = new EffectComposer(this.renderer);

		this.composer.setSize(this.canvasSizeRef.width, this.canvasSizeRef.height);

		this.composer.setPixelRatio(1);

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

		// debugger;
		// if any bob in the scene, he needs update for his moves
		if( currentSceneElements.bobs[this.currentBobName] ){
			currentSceneElements.bobs[this.currentBobName]._controls.Update(
				deltaTime / currentSequenceElements.slowmo,
				currentMousePos,
				{
					bobNeedsToHandleGround: this.handleGround
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
					cameraNeedsToHandleGround: this.handleGround
				},
				
			);
		}

		// if any blur effect, focus needs updates : 
		if( currentSequenceElements.focusTarget ){
			this.focusTargetAndBlurTheRestHandler(currentSequenceElements);
		}

		// if any shadow is casted
		if( currentSequenceElements.activeShadows?.length ){

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

		}


		// if any particles
		if( currentSceneElements.particlesCollection.length ){

			currentSceneElements.particlesCollection.forEach(particleInstance => {
				particleInstance._builtParticle.material.uniforms.uTime.value = elapsedTime / (currentSequenceElements.slowmo || 1);
			});

		}

		// etc..

	}

	focusTargetAndBlurTheRestHandler( currentSequenceElements ){

		const blurPostproc = currentSequenceElements.postproc.find(postproc => postproc.postprocType === "blur");

		const goodTarget = currentSequenceElements.focusTarget._controls._target.name;

		if( !goodTarget ){
			return;
		}

		const { x, y, z } = currentSequenceElements.thirdPersonCamera[goodTarget]._camera.position;

		// compute distance beetween camera and target
		const distance = new THREE.Vector3(x,y,z).distanceTo({...currentSequenceElements.focusTarget._controls._position});

		// update focus value in blur effect
		blurPostproc.effectsPass[0].uniforms.focus.value = distance

		// console.log("blurPostproc stuffs distance --> ", distance, currentSequenceElements.focusTarget)

	}


}

export { SequencesManager };