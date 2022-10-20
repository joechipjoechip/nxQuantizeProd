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

			if( blenderLight.name.indexOf("point") !== -1 ){

				createdLight = new THREE.PointLight(
					blenderLight.color,
					blenderLight.intensity / 1000,
					blenderLight.distance,
					blenderLight.decay
				);

			}

			if( blenderLight.name.indexOf("area") !== -1 ){

				// update manually type (because if not, its set at "Object-3D")
				blenderLight.type = "area-converted-to-spot";

				const { hexColor, strength } = blenderLight.userData;

				if( strength && hexColor ){

					console.log("area light : ", blenderLight, strength)
	
					createdLight = new THREE.SpotLight(
						`#${hexColor}`,
						strength < 10 ? strength * 10 : strength/10,
						strength * 10, //distance  
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
	
	
				// maybe a extra dev to do here (@TODO) :
				// put custom property on the light in blender
				// to say if the shadow needs to be casted or not
				// if(blenderLight.userData?.castShadow ){}
				createdLight.shadowCameraVisible = true;
	
				// une seule shadow
				createdLight.castShadow = true;
	
				if( createdLight.shadow?.mapSize ){
					createdLight.shadow.mapSize.width = 512;
					createdLight.shadow.mapSize.height = 512;
					createdLight.shadow.camera.near = 0;
					createdLight.shadow.camera.far = 7;
				}
	
				this._createdLights.push(createdLight);
	
				this._BuildHelpers(createdLight, index);

			}


		});

	}

	_BuildHelpers(light, index){

		if( this._core.debug.lightsHelpers.light ){

			let lightHelper;

			console.log("wsshhhh", light)


			if( light.name.indexOf("point") !== -1 ){

				lightHelper = new THREE.PointLightHelper(light, 7);
				
			}

			if( light.name.indexOf("spot") !== -1 ){

				lightHelper = new SpotLightHelper(light);
				light.add(lightHelper);

			}









			if( lightHelper ){

				lightHelper.name = `${light.type}-helper-${index}`;
	
				this._createdLights.push(lightHelper);

			}
			

		}

		// const spotLightHelper = new THREE.CameraHelper(createdLight.shadow.camera);
		// spotLightHelper.name = `pointLightHelper-${index}`;


	}
}

export { DynamicLightsBuilder };
