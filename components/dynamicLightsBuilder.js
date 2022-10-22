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

			if( blenderLight.name !== "light-area-2" ){ return; }

			if( blenderLight.name.includes("no_dynamic") ){ return; }

			const isPointLight = blenderLight.name.includes("point");
			const isAreaLight = blenderLight.name.includes("area");
			let createdLight;

			if( isPointLight ){


				createdLight = new THREE.PointLight(
					blenderLight.color,
					blenderLight.intensity / 10,
					blenderLight.distance,
					blenderLight.decay * 1
				);

			}

			if( isAreaLight ){

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

			// AND THEN :

			if( createdLight ){

				createdLight.name = `LIGHT-${blenderLight.type.toLowerCase()}-${index}`;
	
				createdLight.position.copy(blenderLight.position);
				createdLight.rotation.copy(blenderLight.rotation);
				
				if( isAreaLight ){

					createdLight.name = "CASTING-SHADOW_" + createdLight.name;

					createdLight.shadowCameraVisible = true;
					createdLight.castShadow = true;

					createdLight.shadow.mapSize.width = 6144;
					createdLight.shadow.mapSize.height = 6144;
					createdLight.shadow.camera.near = 4.5;
					createdLight.shadow.camera.far = 5.5;
					createdLight.shadow.radius = 3;
				
					createdLight.shadow.camera.left = -1.3;
					createdLight.shadow.camera.right = 1.3;
					createdLight.shadow.camera.top = 1.3;
					createdLight.shadow.camera.bottom = -1.3;
				}

				// if( isPointLight){
				// 	// createdLight.shadow.camera.fov = 50;
				// 	createdLight.shadow.camera.near = 2;
				// 	createdLight.shadow.camera.far = 8;
				// }

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
				
				if( light.name.includes("directional") || light.name.includes("pointlight") ){
					
					shadowHelper = new THREE.CameraHelper(light.shadow.camera);

					// shadowHelper.position.copy(light.position);
					// shadowHelper.rotation.copy(light.rotation);

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
