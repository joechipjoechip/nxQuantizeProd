import { core } from '@/static/config/core.js';

// THREE
import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import { SequencesBuilder } from '@/components/sequencesBuilder.js';
import { CharacterController } from '@/components/characterController.js';
import { DynamicLightsBuilder } from '@/components/dynamicLightsBuilder.js';
import { ParticlesBuilder } from '@/components/particlesBuilder.js';

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { createNoSubstitutionTemplateLiteral } from 'typescript';



class SceneBuilder {

	constructor( params ) {

		// Get data from instanciation
		const { canvas, worldConfig, sequenceID, glb, texture, bobs } = params;

		this.canvas = canvas;
		this.worldConfig = worldConfig;
		this.sequenceID = sequenceID;
		this.glb = glb;
		this.texture = texture;

		this.bobs = {};
		bobs.forEach(bob => {
			this.bobs[bob.name] = bob.instance;
		});

		// _ Three elements
		this.aspectRatio = window.innerWidth / window.innerHeight;
		this.camera = new THREE.PerspectiveCamera(50, this.aspectRatio, 0.001, 50);
		this.camera.name = "camera";
		this.scene = new THREE.Scene();
		this.sequencesElements = {};
		this.sceneElements = {
			landscape: null,
			sky: null,
			bobs: this.bobs,
			initialCamera: null,
			tubes: [],
			blenderLights: [],
			dynamicLights: [],
			emissiveShapesFromBlender: [],
			emissiveShapesBuilt: [],
			positionsCollection: [],
			particlesWorld: this.worldConfig.main.particles || [],
			particlesCollection: [],
			happenings: {}
		};

		this.orbit = null;
		this.sceneIsReady = false;
		
	}

	createScene(){

		return new Promise(res => {

			this.glbParser(this.glb);

			this.bindBobAndScene();
	
			this.createAndApplyBakedMaterial(this.texture);
	
			this.createElementsOnTheFly();
	
			this.sequencesBuild();
	
			this.composeScene();
	
			this.initScene();
	
			this.refreshAndStartScene();

			res(this);

		});

	}

	glbParser( glbObj ){

		if( !glbObj ){
			debugger;
		}

		this.sceneElements.landscape = glbObj.glbFile.scene.getObjectByName("landscape");

		this.sceneElements.initialCamera = glbObj.glbFile.scene.getObjectByName("camera");

		this.createLandscapeShadow(this.sceneElements.landscape.clone());

		glbObj.glbFile.scene.traverse(child => {

			// console.log("child -> ", child.name);
				
			// find camera paths for blenderTubes
			if( child.name.includes("plan-") ){

				this.sceneElements.tubes.push(child);

			}

			// find lights
			if( child.name.includes("light") ){

				this.sceneElements.blenderLights.push(child);

			}

			// find emissive shapes
			if( child.name.includes("emissive") ){

				this.sceneElements.emissiveShapesFromBlender.push(child);

			}

			// find misc positions
			if( child.name.includes("position_") ){

				this.sceneElements.positionsCollection.push(child);

			}

			// find debug objects
			if( child.name.includes("debug-object") ){

				if( !this.sceneElements.debugObjects ){
					this.sceneElements.debugObjects = [];
				}

				child.castShadow = true;
				child.receiveShadow = true;
				
				this.sceneElements.debugObjects.push(child);
			}

		});

	}

	bindBobAndScene(){

		Object.keys(this.bobs).forEach(bobKey => {

			this.scene.add(this.bobs[bobKey]._controls._target);

			this.bobs[bobKey]._controls._scene = this.scene;

		});


	}

	createAndApplyBakedMaterial( textureTransmitted ){

		// create baked material
		const texture = textureTransmitted.file;

		texture.flipY = false;

		texture.encoding = THREE.sRGBEncoding;

		const bakedMaterial = new THREE.MeshBasicMaterial({
			map: texture
		});

		// apply baked material
		this.sceneElements.landscape.material = bakedMaterial;

	}

	createElementsOnTheFly(){

		// dynamic lights
		this.sceneElements.dynamicLights = new DynamicLightsBuilder({
			lightsArr: this.sceneElements.blenderLights,
			ambientConfig: this.worldConfig.main.ambient
		});

		// emissive shapes
		this.sceneElements.emissiveShapesFromBlender.forEach(emissiveShape => {
			this.createEmissiveShape(emissiveShape);
		});

		// particles
		this.sceneElements.particlesWorld.forEach(particle => {

			this.sceneElements.particlesCollection.push(
				new ParticlesBuilder(particle)
			);
		
		});

		// fakebob
		const fakeBob = new THREE.Object3D();
		fakeBob.name = "fakeBob";
		fakeBob.position.copy(new THREE.Vector3(0,0,0));

		this.sceneElements.fakeBob = fakeBob;
		

	}

	createEmissiveShape( shapeFromBlender ){

		const emissiveMaterial = new THREE.MeshBasicMaterial({
			emissive: `#${shapeFromBlender.userData.hexColor || 'FFFFFF'}`,
			emissiveIntensity: 2,
			// side: THREE.DoubleSide
		});

		shapeFromBlender.material = emissiveMaterial;

		this.sceneElements.emissiveShapesBuilt.push(shapeFromBlender)

	}

	createLandscapeShadow( blenderObj ){

		const shadowLandscapeMesh = blenderObj;

		const shadowMaterial = new THREE.ShadowMaterial({
			color: 0x000000,
			opacity: 0.48
		});

		shadowLandscapeMesh.name += "-shadow";

		// shadowLandscapeMesh.castShadow = true;
		shadowLandscapeMesh.receiveShadow = true;

		shadowLandscapeMesh.material = shadowMaterial;

		this.sceneElements.landscapeShadow = shadowLandscapeMesh;

	}

	sequencesBuild(){

		// console.log("at sequence build --> camera = ", this.camera);

		this.sequencesElements = new SequencesBuilder(
			{
				sequences: this.worldConfig.sequences,
				scene: this.scene,
				sceneElements: this.sceneElements,
				camera: this.camera,
				canvas: this.canvas,
				that: this
			}
		);

	}

	composeScene(){

		// Here we add :

		// landscape
		this.scene.add(this.sceneElements.landscape);

		// landscape shadow
		this.scene.add(this.sceneElements.landscapeShadow);

		// emissive shapes
		this.sceneElements.emissiveShapesBuilt
			.forEach(emissiveBuilt => {
				this.scene.add(emissiveBuilt);
			});

		// bobs 
		// Object.keys(this.bobs).forEach(bobKey => {
		// 	this.scene.add(this.bobs[bobKey]._controls._target);
		// })

		// dynamic lights
		this.sceneElements.dynamicLights
			.forEach(light => {

				this.scene.add(light);

				// handle fakeBob
				if(light.name.includes("--needFakeBob--")){
					light.target = this.sceneElements.fakeBob;
					this.scene.add(light.target);

				}
				
			});

		// particles
		this.sceneElements.particlesCollection
			.forEach(item => {
				this.scene.add(item._builtParticle);
			});

		// debug objects
		this.sceneElements.debugObjects
			?.forEach(debugObject => {
				this.scene.add(debugObject);
			});
		
	}

	initScene(){

		// and we initialise
		this.camera.position.copy(this.sceneElements.initialCamera.position);
		this.camera.rotation.copy( this.sceneElements.initialCamera.rotation);
	
		this.scene.add(this.camera);

	}

	refreshAndStartScene(){

		this.camera.updateProjectionMatrix();
		
	}

};



export { SceneBuilder };
