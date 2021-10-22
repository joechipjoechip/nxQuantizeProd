import * as THREE from 'three';

class DynamicLightsBuilder {

	constructor(params){

		this._lights = params.lightsArr;
		this._scene = params.scene;

		this._Inits();

	}

	_Inits(){

		const wellStoredLights = [];
		const lightsToCreate = [];

		// Blender exporte les lights en 2 objets distincts, 
		// donc on est obligé de retraiter la data pour l'organiser mieux
		for(let i = 0; i < this._lights.length; i = i + 2){

			wellStoredLights[i] = [];

			wellStoredLights[i].push(this._lights[i]);

			wellStoredLights[i].push(this._lights[i + 1]);

		};

		// the .filter is necessary to remove empty slots caused by the previous treatment
		wellStoredLights.filter(a => a).forEach((collection, indexCollection) => {

			lightsToCreate[indexCollection] = {};

			collection.forEach(entity => {

				if( entity instanceof THREE.PointLight || entity instanceof THREE.SpotLight ){

					const { r, g, b } = entity.color;

					lightsToCreate[indexCollection].color = new THREE.Color(r, g, b);

					lightsToCreate[indexCollection].intensity = entity.intensity * 0.005;

					lightsToCreate[indexCollection].decay = entity.decay;

					lightsToCreate[indexCollection].distance = entity.distance;

				} else {
					// so : instanceof Object3D

					lightsToCreate[indexCollection].position = new THREE.Vector3(
						entity.position.x,
						entity.position.y,
						entity.position.z
					);

				}

			});

		});

		// now all data is well organized : we can create and add theses lights
		lightsToCreate.forEach((light, index) => {

			// PointLight( color : Integer, intensity : Float, distance : Number, decay : Float )
			const lightToAdd = new THREE.PointLight(
				light.color,
				light.intensity,
				light.distance,
				light.decay
			);

			const spotLightHelper = new THREE.PointLightHelper( lightToAdd, 30 );
			spotLightHelper.name = `pointLightHelper-${index}`;

			lightToAdd.position.copy(light.position);


			lightToAdd.name = `pointLight-${index + 1}`;

			// et on add à la scene
			this._scene.add(lightToAdd);
			this._scene.add(spotLightHelper);

		});
	}
}

export { DynamicLightsBuilder };
