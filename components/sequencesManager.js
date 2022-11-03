import * as THREE from 'three';
import { worlds } from '@/static/config/worlds.js';
import { TimelineLite } from 'gsap';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

class SequencesManager{

	constructor(sceneTransmitted, canvas, canvasSizeRef, cinema){

		this.scene1 = sceneTransmitted;
		this.canvas = canvas;
		this.canvasSizeRef = canvasSizeRef;
		this.cinema = cinema;

	}

	sequenceChangeHandler( newSequenceID, oldSequenceID ){

		console.log("____ _ _ _ change trigger : ", oldSequenceID, newSequenceID);

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

		if( triggerTimeDecay ){
			this.scene1.sceneElements.newSequenceTriggerTime = this.scene1.clock.getElapsedTime() + triggerTimeDecay;
		} else {
			this.scene1.sceneElements.newSequenceTriggerTime = this.scene1.clock.getElapsedTime();
		}

		setTimeout(() => {
			this.cinema.curtainActive = false;
		}, 100)

	}

	killOldSequence( oldSequenceID ){
		if(!oldSequenceID){ return; }

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

	}

	activeGoodCastShadows( newSequenceID, oldSequenceID ){

		this.scene1.sequencesElements[oldSequenceID]?.activeShadows.forEach(light => {
			this.updateInactiveSpotlight(light);
		});

		this.scene1.sequencesElements[newSequenceID]?.activeShadows.forEach(light => {
			this.updateActiveSpotlight(light, newSequenceID)
		});

	}
	
	updateFog( newSequenceID ){

		if( !this.scene1.sequencesElements[newSequenceID].fog ){ return; }

		const { color, intensity, enabled } =  this.scene1.sequencesElements[newSequenceID].fog;

		this.scene1.scene.fog = null; 
		
		if( enabled ){
			this.scene1.scene.fog = new THREE.FogExp2(color, intensity);
		}

	}

	updateInactiveSpotlight( lightToUpdate ){
		lightToUpdate.intensity = 0;

		if( lightToUpdate.name.includes("for-bob-shadow") ){
			lightToUpdate.castShadow = false;
		}
	}

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



	}

	postProcChangeHandler( newSequenceID ){

		const sequencePostProcObj = this.scene1.sequencesElements[newSequenceID].postproc?.length;

		if( sequencePostProcObj ){

			this.initComposer();

			if( sequencePostProcObj.effect ){

				this.scene1.composer.addPass(this.scene1.sequencesElements[newSequenceID].postproc.effect)

			}

			this.fillComposer();

		} else {

			this.scene1.renderPass = null;
			this.scene1.composer = null;

		}

	}

	bobImposedGestureHandler( newSequenceID ){

		const sequenceBobImposedMoves = this.scene1.sequencesElements[newSequenceID].bobImposedMoves;

		Object.keys(this.scene1.sceneElements.bobs).forEach(bobKey => {

			const goodBob = this.scene1.sceneElements.bobs[bobKey];

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

		const bob = this.scene1.sceneElements.bobs[this.currentBobName]._controls._target;

		// if bob is flying, we dont need shadows
		if( bob && sequenceBobImposedMoves?.fly ){

			bob.castShadow = false;
			
		} else {
			
			bob.castShadow = true;
			
		}

	}

	bobNewPositionHandler( newSequenceID ){

		
		Object.keys(this.scene1.sceneElements.bobs).forEach(bobKey => {
			const goodBob = this.scene1.sceneElements.bobs[bobKey];

			if( !goodBob._controls ){ return; }

			const formatedID = newSequenceID.replace(".", "-");
			const newCoords = this.scene1.sceneElements.positionsCollection.find(obj => obj.name.includes("bob") && obj.name.includes(formatedID));

			const thirdPersonInstance = this.scene1.sequencesElements[newSequenceID]?.thirdPersonCamera[bobKey];

			if( newCoords ){

				goodBob._controls.Position = newCoords.position;
				goodBob._controls.Rotation = newCoords.rotation;

				if( thirdPersonInstance ){

					console.log("thirdperson instance spotted : ", thirdPersonInstance);

					const oldStraightness = thirdPersonInstance._specs.straightness;
					thirdPersonInstance._specs.straightness = 1;
					
					thirdPersonInstance._camera.position.copy(newCoords.position);
					thirdPersonInstance._camera.rotation.copy(newCoords.rotation);

					
					setTimeout(() => {
						thirdPersonInstance._specs.straightness = oldStraightness;
					}, 5);
					
					this.scene1.camera.position.copy(thirdPersonInstance._camera.position);

				} else {

					this.scene1.camera.position.copy(newCoords.position);
					this.scene1.camera.rotation.copy(newCoords.rotation);

				}

			} else {
				console.log("- - - - - - !! no new coords !! - - - - - - - ")
			}

		});


	}

	bobVisibilitySwitcher( newSequenceID ){

		const sequenceBobName = this.scene1.sequencesElements[newSequenceID].sequenceBobName;

		Object.keys(this.scene1.sceneElements.bobs).forEach(bobKey => {

			const goodBob = this.scene1.sceneElements.bobs[bobKey];

			if( goodBob._controls._target.name === sequenceBobName ){

				goodBob._controls._target.visible = true;
				
			} else {

				goodBob._controls._target.visible = false;

			}

		});

	}

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

	}

	worldBackgroundColorHandler(newSequenceID){

		const newSequenceHasPostProc = worlds[0].sequences.find(seq => seq.id === newSequenceID).postproc?.length;

		if( newSequenceHasPostProc ){
			this.scene1.composer.renderer.setClearColor(this.scene1.worldConfig.main.spaceColorWithBloom);
		} else {
			this.scene1.renderer.setClearColor(this.scene1.worldConfig.main.spaceColor);
		}

	}

	initRenderer( currentWorldConfig ){

		// Renderer
		this.scene1.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
			// ne peut pas être déclaré en dehors de l'instanciation
			antialias: true
		});

		this.scene1.renderer.setSize(this.canvasSizeRef.width, this.canvasSizeRef.height);

		this.scene1.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		this.scene1.renderer.setClearColor(currentWorldConfig.main.spaceColor);

		this.scene1.renderer.outputEncoding = THREE.sRGBEncoding;

		this.scene1.renderer.shadowMap.enabled = true;

		this.scene1.renderer.shadowMap.type = THREE.PCFShadowMap;

		this.scene1.clock = new THREE.Clock();

	}

	initComposer(){

		this.scene1.renderPass = new RenderPass(this.scene1.scene, this.scene1.camera);

		this.scene1.composer = new EffectComposer(this.scene1.renderer);

		this.scene1.composer.setSize(this.canvasSizeRef.width, this.canvasSizeRef.height);

		this.scene1.composer.setPixelRatio(window.devicePixelRatio);

	}

	fillComposer(){

		const keysToCheck = ["shadersPass", "effectsPass"];

		const currentSequence = this.scene1.sequencesElements[this.sequenceID];

		const sequencePostprocs = currentSequence?.postproc;


		if( sequencePostprocs ){

			this.scene1.composer.addPass(this.scene1.renderPass);

			sequencePostprocs.forEach(sequencePostproc => {

				// add shaderPass and effectsPass
				keysToCheck.forEach(keyToCheck => {

					if( sequencePostproc[keyToCheck].length ){

						sequencePostproc[keyToCheck].forEach(oneKeyedPass => {

							this.scene1.composer.addPass(oneKeyedPass);

						});

					}

				});

			});

		}

	}

}

export { SequencesManager };