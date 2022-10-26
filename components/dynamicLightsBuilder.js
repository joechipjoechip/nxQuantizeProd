import * as THREE from 'three';
import { core } from '@/static/config/core.js';

import { SpotLightHelper } from 'three';


class DynamicLightsBuilder {

	constructor(params){

		this._scene = params.scene;
		this._blenderLights = params.lightsArr;
		this._createdLights = [];
		this._core = core;
		this._sunConfig = params.sunConfig;

		this._ParseBlenderLights();
		this._BuildSun();
		this._BuildLights();

		console.log("! ! ! all blenderLights : ", this._blenderLights);
		console.log("! ! ! all createdLights : ", this._createdLights);

		return this._createdLights;

	}

	_BuildSun(){

		const sun = new THREE.AmbientLight(
			this._sunConfig.color, 
			this._sunConfig.intensity
		);

		sun.name = "light-sun";

		this._createdLights.push(sun);
	}

	_ParseBlenderLights(){

		this._blenderLights.forEach((blenderLight) => {

			let sequenceID = blenderLight.name.split("_")[1];
			let sequencesArr = [];
	
			if( sequenceID.includes("&") ){

				sequencesArr = sequenceID.split("&");

				sequenceID = sequencesArr.shift();

				sequencesArr.forEach(sequenceOtherID => {

					blenderLight.name = blenderLight.name.replace(sequenceOtherID, "").replace(/&/gi, "");

				});

			}
	
			if( sequencesArr.length ){

				sequencesArr.forEach(sequenceOtherID => {

					const newBlenderLight = blenderLight.clone();
					
					newBlenderLight.name = newBlenderLight.name.replace(sequenceID, sequenceOtherID);

					this._blenderLights.push(newBlenderLight);

				});
			}

		});


	}

	_BuildLights(){

		this._blenderLights.forEach((blenderLight, index) => {

			// debug
			// if( blenderLight.name !== "light-area-2" ){ return; }

			if( blenderLight.name.includes("no_dynamic") ){ return; }

			const sequenceID = blenderLight.name.split("_")[1].replace("-", ".");

			const isPointLight = blenderLight.name.includes("point");
			const isSpotlight = blenderLight.name.includes("spot-for-bob-shadow");
			
			let createdLight;

			if( isPointLight ){

				blenderLight.type = "PointLight";

				createdLight = new THREE.PointLight(
					blenderLight.color,
					blenderLight.intensity / 10,
					blenderLight.distance,
					blenderLight.decay * 1
				);

				createdLight.name = `point-light-#${sequenceID}#`;

			}

			if( isSpotlight ){

				

				// update manually type (because if not, blender export set it as "Object-3D")
				// and yes, rect areas from blender become here spotlights !
				blenderLight.type = "SpotLight";

				debugger;

				createdLight = new THREE.SpotLight(
					`#${blenderLight.userData.hexColor}` || 0xFFFFFF, // color
					blenderLight.intensity / 10, //intensity
					0, // Distance
					Math.PI/300, //angle (radians)
					0, // penumbra
					0 // decay
				);

				createdLight.name = `spot-for-bob-shadow--needFakeBob--#${sequenceID}#`;

			}

			// AND THEN :

			if( createdLight && createdLight.name.includes("--needFakeBob--")){
	
				createdLight.position.copy(blenderLight.position);
				createdLight.rotation.copy(blenderLight.rotation);

				if( isSpotlight ){

					createdLight.name += "__CASTING-SHADOW";

					createdLight.castShadow = false;
					// will be activated at threeinstance.vue at activeGoodCastShadows()

					createdLight.shadow.mapSize.width = 256;
					createdLight.shadow.mapSize.height = 256;
					createdLight.shadow.camera.near = 0.01;
					createdLight.shadow.camera.far = 15;
					createdLight.shadow.radius = 2;
				
					// createdLight.updateMatrix(true);
				}

				this._createdLights.push(createdLight);
	
				this._BuildHelper(createdLight, index);

			}


		});

	}

	_BuildHelper(light, index){

		if( this._core.debug.lightsHelpers.light ){

			const type = light.type.toLowerCase()

			let lightHelper;

			if( type.includes("point") ){
				lightHelper = new THREE.PointLightHelper(light, 7);
			}

			if( type.includes("spot") ){
				lightHelper = new SpotLightHelper(light);
				light.add(lightHelper);
			}

			if( type.includes("directional") ){
				lightHelper = new THREE.DirectionalLightHelper(light)
				light.add(lightHelper);
			}








			// AND FINALLY
			if( lightHelper ){

				lightHelper.name = `${light.type}-helper_light-${index}`;
	
				this._createdLights.push(lightHelper);

			}
			

		}


		if( this._core.debug.lightsHelpers.shadow ){

			let shadowHelper;

			if( light.shadow?.camera ){
				
				shadowHelper = new THREE.CameraHelper(light.shadow.camera);
				shadowHelper.name = `${light.type}-helper_shadow-${index}`;
				
			}

			if( shadowHelper ){
				this._createdLights.push(shadowHelper);
			}

		}

	}
}

export { DynamicLightsBuilder };
