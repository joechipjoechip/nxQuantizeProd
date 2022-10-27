import { TimelineLite } from 'gsap';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { BlenderTubes } from '@/components/blenderTubes.js';
import { PostprocsBuilder } from './postprocsBuilder';
import { ThirdPersonCamera } from '@/components/thirdPersonCamera.js';

class SequencesBuilder {

	constructor(params){

		this._sequences = params.sequences;
		this._scene = params.scene;
		this._sceneElements = params.sceneElements;
		this._camera = params.camera;
		this._canvas = params.canvas

		// all we do here is to build this _sequencesLib
		// _sequenceLib in the end, will be this.scene1.sequencesElements in sceneBuilder.js
		this._sequencesLib = {};

		this._Build();

		return this._sequencesLib;

	}

	_Build(){

		// here : differents things to check and to build
		// for each sequence
		this._sequences.forEach(sequenceInfos => {

			// here we init the key 1.0 in _sequenceLib
			this._sequencesLib[sequenceInfos.id] = {
				helpersConfig: sequenceInfos.helpers,
				helpers: {},
				timelines: {},
				activeShadows: [],
				fog: sequenceInfos.fog,
				thirdPersonCamera: null,
				bobImposedMoves: null,
				focusTarget: null,
				bobInitialPosition: new THREE.Vector3(0,0,0)
			};

			this._BuildPostprocsCollections(sequenceInfos);

			this._BuildActiveLights(sequenceInfos);

			this._BuildHelpers(sequenceInfos);

			this._BuildBobImposedMoves(sequenceInfos);

			this._DispatchHappenings(sequenceInfos);
			
		});

	}

	_BuildActiveLights( sequenceInfos ){

		this._sceneElements.dynamicLights.forEach(light => {

			if( light.name.includes(sequenceInfos.id) ){
				// || light.name.includes("#allSequences#")
				this._sequencesLib[sequenceInfos.id].activeShadows.push(light);
			}

		});

	}

	_BuildHelpers( sequenceInfos ){
		const goodSequenceLib = this._sequencesLib[sequenceInfos.id];

		if( goodSequenceLib.helpersConfig.orbit ){

			goodSequenceLib.helpers.orbit = new OrbitControls(this._camera, this._canvas);

			goodSequenceLib.helpers.orbit.target = this._sceneElements.landscape.position;
	
			goodSequenceLib.helpers.orbit.enabled = true;
	
			goodSequenceLib.helpers.orbit.enableDamping = true;

		}
		
	}

	_BuildBobImposedMoves( sequenceInfos ){
		if( !sequenceInfos.bobImposedMoves ){ return; }

		this._sequencesLib[sequenceInfos.id].bobImposedMoves = sequenceInfos.bobImposedMoves;
		
	}

	_DispatchHappenings( sequenceInfos ){

		if( sequenceInfos.type === "blender-points" && this._sceneElements.tubes.length ){

			this._BuildBlenderTubes(sequenceInfos)

		}

		if( sequenceInfos.type === "third-person" ){

			this._BuildThirdPersonCamera(sequenceInfos);

		}

	}
	
	_BuildPostprocsCollections( sequenceInfos ){

		if( sequenceInfos.postproc ){
	
			this._sequencesLib[sequenceInfos.id].postproc = [];
	
			this._BuildPostprocs(sequenceInfos);
	
		}
		
	}

	_BuildBlenderTubes( sequenceInfos ){

		this._sequencesLib[sequenceInfos.id].blenderTubesManager = new BlenderTubes({
			sequenceInfos,
			scene: this._scene,
			blenderPoints: this._sceneElements.tubes,
			camera: this._camera
		});

		this._sequencesLib[sequenceInfos.id].timelines.camera = this._sequencesLib[sequenceInfos.id].blenderTubesManager._TweenBuilder();

		this._sequencesLib[sequenceInfos.id].timelines.camera.eventCallback("onComplete", () => {

			if( this._sequencesLib[sequenceInfos.id] ){
				this._sequencesLib[sequenceInfos.id].timelines.camera = null;
			}

			// ce sera peut être ici qu'il faudra faire le lien entre cette caméra sur rails
			// et la caméra 3eme personne ...

		});

		// the .play() is done in instanceThree.vue
		
	}

	_BuildPostprocs( sequenceInfos ){

		sequenceInfos.postproc.forEach(effectObj => {

			const target = this._sceneElements[effectObj.focusTarget];

			if( target ){
				this._sequencesLib[sequenceInfos.id].focusTarget = target;
			}

			this._sequencesLib[sequenceInfos.id].postproc.push(
				new PostprocsBuilder(
					{ 
						sequenceInfos, 
						effectObj,
						canvas: this._canvas,
						camera: this._camera,
						scene: this._scene,
						currentSequenceLib: this._sequencesLib[sequenceInfos.id]
					}
				)
			);

		});

	}
	
	_BuildThirdPersonCamera( sequenceInfos ){

		this._sequencesLib[sequenceInfos.id].thirdPersonCamera = new ThirdPersonCamera({
			target: this._sceneElements.bob.controller._controls,
			camera: this._camera,
			cameraType: sequenceInfos.cameraType
		});

	}

}

export { SequencesBuilder };
