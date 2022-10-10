import * as THREE from 'three';
import { core } from '@/static/config/core.js';

class DynamicLightsBuilder {

	constructor(params){

		this._scene = params.scene;
		this._blenderLights = params.lightsArr;
		this._createdLights = [];
		this._core = core;

		this._BuildLights();

		return this._createdLights;

	}

	_BuildLights(){

		// const wellStoredLights = [];
		const lightsToCreate = this._blenderLights;


		this._blenderLights.forEach((blenderLight, index) => {

			let createdLight;

			if( blenderLight.type === "PointLight" ){

				createdLight = new THREE.PointLight(
					blenderLight.color,
					blenderLight.intensity / 1000,
					blenderLight.distance,
					blenderLight.decay
				);

			}

			createdLight.name = `${blenderLight.type}-${index}`;

			createdLight.position.copy(blenderLight.position);


			// maybe a extra dev to do here (@TODO) :
			// put custom property on the light in blender
			// to say if the shadow needs to be casted or not
			// if(blenderLight.userData?.castShadow ){}
			createdLight.shadowCameraVisible = true;

			// une seule shadow
			createdLight.castShadow = true;

			createdLight.shadow.mapSize.width = 512;
			createdLight.shadow.mapSize.height = 512;
			createdLight.shadow.camera.near = 0;
			createdLight.shadow.camera.far = 7;

			this._createdLights.push(createdLight);

			this._BuildHelpers(createdLight, index);

		});

	}

	_BuildHelpers(light, index){

		if( this._core.debug.lightsHelpers.light ){

			let lightHelper;

			if( light.type === "PointLight" ){

				lightHelper = new THREE.PointLightHelper(light, 7);
				
			}
			
			lightHelper.name = `${light.type}-helper-${index}`;

			this._createdLights.push(lightHelper);

		}

		// const spotLightHelper = new THREE.CameraHelper(createdLight.shadow.camera);
		// spotLightHelper.name = `pointLightHelper-${index}`;


	}
}

export { DynamicLightsBuilder };
