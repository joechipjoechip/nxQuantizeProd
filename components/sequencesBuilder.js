import { TimelineMax } from 'gsap';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { BlenderTubes } from '@/components/blenderTubes.js';

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

			this._BuildHelpers(sequenceInfos);

			this._CheckBlenderTube(sequenceInfos);
			
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

	_CheckBlenderTube( sequenceInfos ){

		if( sequenceInfos.type === "blender-points" && this._sceneElements.tubes.length ){

			this._BuildBlenderTubes(sequenceInfos)

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

			// ce sera surement ici qu'il faudra faire le lien entre cette caméra sur rails
			// et la caméra 3eme personne ...

		});

		// this._sequencesLib[sequenceInfos.id].timelines.camera.play()
		
	}

}

export { SequencesBuilder };
