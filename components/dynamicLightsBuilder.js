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

		this._BuildSun();
		this._BuildLights();

		console.log("- - - - > all createdLights : ", this._createdLights);

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

	_BuildLights(){

		this._blenderLights.forEach((blenderLight, index) => {

			// if( index !== 3 ){ return }

			let createdLight;

			if( blenderLight.name.indexOf("point") !== -1 ){


				createdLight = new THREE.PointLight(
					blenderLight.color,
					blenderLight.intensity / 10,
					blenderLight.distance,
					blenderLight.decay
				);

				// console.log("builT a pointlight as ", createdLight)

			}

			if( blenderLight.name.indexOf("area") !== -1 ){

				// update manually type (because if not, blender export set it as "Object-3D")
				blenderLight.type = "directional";

				const { hexColor, strength } = blenderLight.userData;

				if( strength && hexColor ){
	
					createdLight = new THREE.DirectionalLight(
						`#${hexColor}`,
						strength / 10, // intensity
					);

				}

			} 













			if( createdLight ){

				createdLight.name = `LIGHT-${blenderLight.type.toLowerCase()}-${index}`;
	
				createdLight.position.copy(blenderLight.position);
				createdLight.rotation.copy(blenderLight.rotation);

				if( createdLight.shadow ){

					createdLight.name += "_castShadow";
					
					createdLight.shadowCameraVisible = true;
					createdLight.castShadow = true;

					createdLight.shadow.mapSize.width = 2048;
					createdLight.shadow.mapSize.height = 2048;
					createdLight.shadow.camera.near = 6;
					createdLight.shadow.camera.far = 8;

					createdLight.shadowCameraLeft = -0.3;
					createdLight.shadowCameraRight = 0.3;
					createdLight.shadowCameraTop = 0.3;
					createdLight.shadowCameraBottom = -0.3;

				}

				this._createdLights.push(createdLight);
	
				this._BuildHelper(createdLight, index);

			}


		});

	}

	_BuildHelper(light, index){

		if( this._core.debug.lightsHelpers.light ){

			let lightHelper;

			if( light.name.includes("point") ){
				lightHelper = new THREE.PointLightHelper(light, 7);
			}

			if( light.name.includes("spot") ){
				lightHelper = new SpotLightHelper(light);
				light.add(lightHelper);
			}

			if( light.name.includes("directional") ){
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
				
				if( light.name.includes("directional") ){
					
					shadowHelper = new THREE.CameraHelper(light.shadow.camera);

					shadowHelper.position.copy(light.position);
					shadowHelper.rotation.copy(light.rotation);

					shadowHelper.name = `${light.type}-helper_shadow-${index}`;
				
				}

			}

			if( shadowHelper ){
				this._createdLights.push(shadowHelper);
			}

		}



	}
}

export { DynamicLightsBuilder };
