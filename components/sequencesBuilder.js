import { TimelineLite } from 'gsap';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { BlenderTubes } from '@/components/blenderTubes.js';
import { PostprocsBuilder } from './postprocsBuilder';

class SequencesBuilder {

	constructor(params){

		this._sequences = params.sequences;
		this._scene = params.scene;
		this._sceneElements = params.sceneElements;
		this._camera = params.camera;
		this._canvas = params.canvas

		// all we do here is to build this _sequencesLib
		// _sequenceLib in the end, will be this.act1.sequencesElements in sceneBuilder.js
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
				timelines: {}
			};

			this._BuildPostprocsCollection(sequenceInfos);

			this._BuildHelpers(sequenceInfos);

			this._happeningsDispatcher(sequenceInfos);
			
		});

	}

	_BuildHelpers( sequenceInfos ){

		if( this._sequencesLib[sequenceInfos.id].helpersConfig.orbit ){

			this._sequencesLib[sequenceInfos.id].helpers.orbit = new OrbitControls(this._camera, this._canvas);

			this._sequencesLib[sequenceInfos.id].helpers.orbit.target = this._sceneElements.landscape.position;
	
			this._sequencesLib[sequenceInfos.id].helpers.orbit.enabled = true;
	
			this._sequencesLib[sequenceInfos.id].helpers.orbit.enableDamping = true;

		}
		
	}

	_happeningsDispatcher( sequenceInfos ){

		if( sequenceInfos.type === "blender-points" && this._sceneElements.tubes.length ){

			this._BuildBlenderTubes(sequenceInfos)

		}

	}
	
	_BuildPostprocsCollection( sequenceInfos ){

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

			console.log("vidage de this.timelines.camera");
			this._sequencesLib[sequenceInfos.id].timelines.camera = null;

			// ce sera peut être ici qu'il faudra faire le lien entre cette caméra sur rails
			// et la caméra 3eme personne ...

		});

		// the .play() is done in instanceThree.vue
		
	}

	_BuildPostprocs( sequenceInfos ){

		sequenceInfos.postproc.forEach(effectObj => {

			this._sequencesLib[sequenceInfos.id].postproc.push(
				new PostprocsBuilder(
					{ 
						sequenceInfos, 
						effectObj,
						canvas: this._canvas,
						camera: this._camera,
						scene: this._scene
					}
				)
			);

		});

	}

}

export { SequencesBuilder };
