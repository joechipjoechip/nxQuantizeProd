import * as THREE from 'three';
import { TimelineLite } from 'gsap';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

class SequencesManager{

	constructor(sceneBundle, cinema, renderer, clock, canvasSizeRef, vm){

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
		this.isPlaying = false;
		this.bobHandleGround = true;
		this.vm = vm;
		this.stickedBobInputs = {};
		this.isCurrentlyTransitionning = false;
		this.axes = ["x", "y", "z"];
		this.isChoiceScene = false;

		this.currentSequenceElements = null;

		this.vm.$nuxt.$on("bob-inputs-update", ( event ) => { this.updateBobStickedInputs(event, this) });

	}

	updateBobStickedInputs( event, that ){
		if( !that.currentBobName ){ return; }

		if( this.currentSequenceElements?.choiceSequence ){

			//
			
		} else {

			that.sceneBundlePassed.sceneElements.bobs[that.currentBobName]._controls._input._UpdateBobStickedInputs(event);

		}

	}

	sequenceChangeHandler( newSequenceID, oldSequenceID ){

		this.isCurrentlyTransitionning = true;

		this.currentSequenceID = newSequenceID;

		console.log("____ _ _ _ change trigger : ", oldSequenceID, newSequenceID);

		this.currentSequenceElements = this.sceneBundlePassed.sequencesElements[newSequenceID];

		this.updateCommonsValues();
		
		this.initEventualSpecialEvents();

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

		this.activeGoodLightsOnly(newSequenceID);


		this.sceneBundlePassed.sceneElements.newSequenceTriggerTime = this.clock.getElapsedTime();

		this.sceneBundlePassed.sceneElements.newSequenceTriggerTime += this.currentSequenceElements.cameraTriggerTimeDecay || 0;		


		setTimeout(() => {

			this.cinema.curtainActive = false;

			this.isCurrentlyTransitionning = false;

		}, 100);

		console.log("----> current scene : ", this.sceneBundlePassed)

	}

	updateCommonsValues(){

		this.currentBobName = this.currentSequenceElements.sequenceBobName;

		this.currentAliceName = this.currentSequenceElements.aliceInfos?.name;

		this.currentAliceSlowmo = this.currentSequenceElements.aliceInfos?.slowmo || 1;

		this.currentAliceHandleGround = this.currentSequenceElements.aliceInfos?.handleGround;

		this.bobHandleGround = !(
			this.currentSequenceElements.bobImposedMoves?.fly 
			|| this.currentSequenceElements.bobImposedMoves?.floating 
			|| this.currentSequenceElements.bobImposedMoves?.climb
			|| this.currentSequenceElements.bobImposedMoves?.teeter
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

				// console.log("oldTimeline killed : ", oldSequenceID, timelineKey);

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

	activeGoodLightsOnly( newSequenceID ){

		this.sceneBundlePassed.sceneElements.dynamicLights.forEach(light => {

			if( light.name.includes(newSequenceID) || light.name.includes("sun") ){
				light.visible = true;
			} else {
				light.visible = false;
			}

		});


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

	bobVisibilitySwitcher(){

		Object.keys(this.sceneBundlePassed.sceneElements.bobs).forEach(bobKey => {

			const goodBob = this.sceneBundlePassed.sceneElements.bobs[bobKey];

			if( goodBob._controls._target.name === this.currentBobName ){

				goodBob._controls._target.visible = true;

				if( this.currentSequenceElements.sequenceInfos.bobRestoreSize ){

					console.log('V : SIZE RESTORED');
					
					goodBob._controls._target.scale = new THREE.Vector3(
							this.currentSequenceElements.sequenceInfos.bobRestoreSize,
							this.currentSequenceElements.sequenceInfos.bobRestoreSize,
							this.currentSequenceElements.sequenceInfos.bobRestoreSize
						);
						
				} else {
					console.log('X : SIZE NOT RESTORED : ', this.currentSequenceElements);
				}
				
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

		const sequencePostprocs = this.currentSequenceElements?.postproc;


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

		if( !this.currentSequenceElements ){
			debugger;
		}

		// if an orbit helper is set
		this.currentSequenceElements.helpers?.orbit?.update();


		// if any timeline is supposed to .play()
		if( this.currentSequenceElements.timelines ){

			Object.keys(this.currentSequenceElements.timelines).forEach(key => {

				if( this.currentSequenceElements.timelines[key]?.progress() === 0 ){
					this.currentSequenceElements.timelines[key].play();
				}

			});

		}

		// if any bob in the sequence, he needs update for his moves
		if( this.sceneBundlePassed.sceneElements.bobs[this.currentBobName] ){

			this.sceneBundlePassed.sceneElements.bobs[this.currentBobName]._controls.Update(
				deltaTime / this.currentSequenceElements.slowmo,
				{
					bobNeedsToHandleGround: this.bobHandleGround,
					isEndSequence: this.currentSequenceElements.isEndSequence
				},
				currentMousePos,
				this.currentSequenceElements.sequenceImposedMoves
			);
		}

		// if any alice in the sequence, she needs update for her moves
		if( this.sceneBundlePassed.sceneElements.bobs[this.currentAliceName] ){
			this.sceneBundlePassed.sceneElements.bobs[this.currentAliceName]._controls.Update(
				deltaTime / this.currentAliceSlowmo,
				{
					bobNeedsToHandleGround: this.currentAliceHandleGround
				}
			);
		}

		// if third-person camera in the scene, it needs updates too
		if( this.currentSequenceElements.thirdPersonCamera[this.currentBobName] ){
			this.currentSequenceElements.thirdPersonCamera[this.currentBobName].Update(
				this.sceneBundlePassed.sceneElements.newSequenceTriggerTime,
				elapsedTime, 
				currentMousePos,
				{
					cameraNeedsToHandleGround: this.bobHandleGround,
					isCurrentlyTransitionning: this.isCurrentlyTransitionning
				}
			);
		}

		// if any shadow is casted
		if( this.currentSequenceElements.activeShadows?.length && this.currentBobName ){

			this.sceneBundlePassed.sceneElements.bobs[this.currentBobName]._controls.UpdateDynamicLightShadowCamera(
				this.currentSequenceElements.activeShadows,
				this.currentSequenceID
			);

		}

		// if any blur effect, focus needs updates : 
		if( this.currentSequenceElements.focusTarget?._controls ){
			this.focusTargetAndBlurTheRestHandler();
		}

		// if any fake-orbit
		if( this.currentSequenceElements.fakeOrbit ){

			this.currentSequenceElements.blenderTubesManager._FakeOrbit(currentMousePos, this.vm.$store.state.downScale);

		} else if( this.currentSequenceElements.blenderTubesManager?._tubeTravelTargetPosition ){
			// if any BlenderTube is supposed to be played with its lookAt()

			this.sceneBundlePassed.camera.lookAt(
				this.currentSequenceElements.blenderTubesManager._tubeTravelTargetPosition
			);

			this.currentSequenceElements.camera.rotation.y += (currentMousePos.x / 10) * (this.currentSequenceElements.sequenceInfos.cameraInvert?.x ? -1 : 1);
			this.currentSequenceElements.camera.rotation.x += (currentMousePos.y / 10) * (this.currentSequenceElements.sequenceInfos.cameraInvert?.y ? -1 : 1);

		}

		

		// if meshes with custom shader 
		if( this.sceneBundlePassed.sceneElements.meshesForCustomShaderBuilt ){

			this.sceneBundlePassed.sceneElements.meshesForCustomShaderBuilt.forEach(mesh => {
	
				mesh.material.uniforms.iGlobalTime.value = elapsedTime * this.sceneBundlePassed.sceneElements.meshCustomShaderOptions.shaderTimeRatio || 0.5;
				
			});
			
		}
		
		// if bob with custom shader 
		if( this.sceneBundlePassed.sceneElements.bobs[this.currentBobName]?._controls._params.bobInfos.shader ){

			const shaderInfos = this.sceneBundlePassed.sceneElements.bobs[this.currentBobName]?._controls._params.bobInfos.shader;

			this.sceneBundlePassed.sceneElements.bobs[this.currentBobName]._controls._target.children.find(child => child.name !== "Armature").material.uniforms.iGlobalTime.value = shaderInfos.shaderTimeRatio * (shaderInfos.sin ? (Math.sin(elapsedTime) * shaderInfos.sinAmplitude) : elapsedTime);

		}

		// if alice with custom shader 
		if( this.currentSequenceElements.aliceInfos?.customShaderOptions ){

			const shaderInfos = this.currentSequenceElements.aliceInfos.customShaderOptions;

			this.sceneBundlePassed.sceneElements.bobs[this.currentSequenceElements.aliceInfos.name]._controls._target.children.find(child => child.name !== "Armature").material.uniforms.iGlobalTime.value = shaderInfos.shaderTimeRatio * (shaderInfos.sin ? ((Math.sin(elapsedTime) * shaderInfos.sinAmplitude)) : elapsedTime) + (shaderInfos.shaderTimeDecay || 0);

		}


		// if landscapeMove
		if( this.currentSequenceElements.sequenceInfos.landscapeMove ){

			this.axes.forEach(axe => {

				this.sceneBundlePassed.sceneElements.landscape.position[axe] += this.currentSequenceElements.sequenceInfos.landscapeMove[axe]

			});

		}

		// if particles -> update the downScaleRatio
		if( this.sceneBundlePassed.sceneElements.particlesCollection?.length ){

			if( this.vm.$store.state.downScale !== this.vm.$store.state.lastDownScale ){

				this.vm.$store.commit('setLastDownScale', this.vm.$store.state.downScale);

				this.sceneBundlePassed.sceneElements.particlesCollection.forEach(collection => {
	
					collection._builtParticle.material.uniforms.uDownScale.value = this.vm.$store.state.downScale;
	
				});
				
			} 
			
		}

		// if choice is active
		if( this.isChoiceScene ){
			this.handleMouseDuringChoice(currentMousePos.x)
		}

	}

	focusTargetAndBlurTheRestHandler(){

		const { x, y, z } = this.sceneBundlePassed.camera.position;

		// compute distance beetween camera and target
		const distance = new THREE.Vector3(x,y,z).distanceTo({...this.currentSequenceElements.focusTarget._controls._position});

		// update focus value in blur effect
		this.currentSequenceElements.postproc.find(postproc => postproc.postprocType === "blur").effectsPass[0].uniforms.focus.value = distance;

	}

	initEventualSpecialEvents(){

		console.log("initiEventualSpecialEvents : ", this.currentSequenceElements)

		if( !this.currentSequenceElements.choiceSequence ){ return }
				
		// document.addEventListener("keydown", event => this.choiceHandler(event));
		
		setTimeout(()=> {
			this.isChoiceScene = true;
			this.choiceHandler({direction: "left"});
			this.vm.$store.state.audioLoopNeutral.volume(0)
			this.vm.$store.state.audioLoopNeutral.stop()
		}, 300);

	}

	choiceHandler( event ){

		const camera = this.currentSequenceElements.thirdPersonCamera[this.currentBobName]
		const lookAtDecay = 0.03
		const offsetDecay = 0.015

		switch(event.direction){
			case "left":
				this.vm.$store.state.audioLoopDrumOne.volume(1)
				this.vm.$store.state.audioLoopDrumTwo.volume(0)

				camera._specs.lookAt.x = lookAtDecay
				camera._specs.offset.x = offsetDecay * -1
				break;

			case "right":
				this.vm.$store.state.audioLoopDrumOne.volume(0)
				this.vm.$store.state.audioLoopDrumTwo.volume(1)

				camera._specs.lookAt.x = lookAtDecay * -1
				camera._specs.offset.x = offsetDecay
				break;
		}
		
	}

	handleMouseDuringChoice(currentMousePosX){

		if( currentMousePosX > 0 ){
			this.choiceHandler({ direction: "right"})
		} 
		
		if( currentMousePosX < 0 ){
			this.choiceHandler({ direction: "left"})
		}

	}

}

export { SequencesManager };