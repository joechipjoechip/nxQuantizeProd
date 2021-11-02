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

			if( index === 0 ){


				// @TODO : dynamiser le cube de projection d'ombre en fonction de la position du personnage
				// cube de projection défini par .far .near .bottom et .top
				// (donc donner linkController ici)
				// ca implique des calculs de position, d'orientation etc
				// le cours sur les vecteurs va etre indispensable ici
				// mais à la fin ce sera opti de ouf


				// PointLight( color : Integer, intensity : Float, distance : Number, decay : Float )
				// const lightToAdd = new THREE.PointLight(
				// 	light.color,
				// 	light.intensity,
				// 	light.distance,
				// 	light.decay
				// );

				const lightToAdd = new THREE.DirectionalLight(
					light.color,
					light.intensity,
					// light.distance,
					// light.decay
				);

				// const spotLightHelper = new THREE.DirectionalLightHelper( lightToAdd, 10 );
				

				lightToAdd.position.copy(light.position);

				lightToAdd.target.position.set(0, 0, 0);

				lightToAdd.shadowCameraVisible = true;

				
				// une seule shadow
				lightToAdd.castShadow = true;

				lightToAdd.shadow.mapSize.width = 1024;
				lightToAdd.shadow.mapSize.height = 1024;
				lightToAdd.shadow.camera.near = 12;
				lightToAdd.shadow.camera.far = 19;

				


				lightToAdd.name = `pointLight-${index}`;

				const spotLightHelper = new THREE.CameraHelper(lightToAdd.shadow.camera);
				spotLightHelper.name = `pointLightHelper-${index}`;

				// et on add à la scene
				this._scene.add(lightToAdd);
				this._scene.add(spotLightHelper);

			}

		});
	}
}

export { DynamicLightsBuilder };
