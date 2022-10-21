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

			let createdLight;

			console.log("- - - - - blender light : ", blenderLight);

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
				blenderLight.type = "area-converted-to-spot";

				const { hexColor, strength } = blenderLight.userData;

				if( strength && hexColor ){

					// console.log("area light : ", blenderLight, strength)
	
					createdLight = new THREE.SpotLight(
						`#${hexColor}`,
						strength * 10, // intensity
						strength, //distance  
						Math.PI/3, //angle
						0.5, //penumbra
						1 // decay
					);

				}

			} 













			if( createdLight ){

				createdLight.name = `light-${blenderLight.type.toLowerCase()}-${index}`;
	
				createdLight.position.copy(blenderLight.position);
				createdLight.rotation.copy(blenderLight.rotation);

				if( createdLight.shadow ){

					createdLight.name += "-castShadow";
					
					// createdLight.shadowCameraVisible = true;
					createdLight.castShadow = true;

					createdLight.shadow.mapSize.width = 1024;
					createdLight.shadow.mapSize.height = 1024;
					createdLight.shadow.camera.near = 0;
					createdLight.shadow.camera.far = 40;

					createdLight.shadow.camera.position.copy(createdLight.position);
					createdLight.shadow.camera.rotation.copy(createdLight.rotation);
				}

				console.log("/ / / / / dynamic light created as ", createdLight);
	
				this._createdLights.push(createdLight);
	
				this._BuildHelpers(createdLight, index);

			}


		});

	}

	_BuildHelpers(light, index){

		if( this._core.debug.lightsHelpers.light ){

			let lightHelper;

			console.log("wsshhhh", light)


			if( light.name.includes("point") ){

				lightHelper = new THREE.PointLightHelper(light, 7);
				
			}

			if( light.name.includes("spot") ){

				lightHelper = new SpotLightHelper(light);
				light.add(lightHelper);

			}









			if( lightHelper ){

				lightHelper.name = `${light.type}-helper-${index}`;
	
				this._createdLights.push(lightHelper);

			}
			

		}


		if( this._core.debug.lightsHelpers.shadow ){

			let shadowHelper;

			
			if( light.shadow?.camera ){
				
				if( light.name.includes("point") ){

					console.log("au moment de build le camera helper shadow : la light : ", light)
					
					shadowHelper = new THREE.CameraHelper(light.shadow.camera);

					shadowHelper.position.copy(light.position);
					shadowHelper.rotation.copy(light.rotation);

					shadowHelper.name = `camera-helper-shadow-${index}`;
				
				}

			}

			if( shadowHelper ){
				this._createdLights.push(shadowHelper);
			}

		}



	}
}

export { DynamicLightsBuilder };
