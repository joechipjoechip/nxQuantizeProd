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

class AssetsLoadWatcher {

	constructor(params){

		this._that = params;
		
		this._glb = false;
		this._bakeds = false;
		this._allReady = false;
		this._sceneIsReady = false;

	}

	set glb(x){
		console.log("set glb")
		this._glb = x;
		this.computeReadyness();
		if( x ){
			this._that.createBob();
		}
	}

	get glb(){
		return this._glb;
	}

	set allReady(x){
		this._allReady = x;

		if( this._allReady ){
			this._that.onceAssetsAreLoaded();
		}
	}

	get allReady(){
		return this._allReady;
	}

	computeReadyness(){
		if( this.glb && this.bakeds ){
			this.allReady = true;
		}
	}

};

class SceneBuilder {

	constructor( params ) {

		// Get data from instanciation
		const { canvas, worldConfig, sequenceID } = params;

		this.canvas = canvas;
		this.worldConfig = worldConfig;
		this.sequenceID = sequenceID;

		// Internal variables
		this.assetsManager = new AssetsLoadWatcher(this);

		// _ Loaders
		this.dracoLoader = new DRACOLoader();
		this.glbLoader = new GLTFLoader();
		this.textureLoader = new THREE.TextureLoader();
		// _ _ to load compressed glTF (so glB files) we need a DracoLoader
		this.dracoLoader.setDecoderPath("assets/js/draco/");
		this.glbLoader.setDRACOLoader(this.dracoLoader);

		// _ Three elements
		this.aspectRatio = window.innerWidth / window.innerHeight;
		this.camera = new THREE.PerspectiveCamera(50, this.aspectRatio, 0.001, 50);
		this.camera.name = "camera";
		this.scene = new THREE.Scene();
		this.sequencesElements = {};
		this.sceneElements = {
			landscape: null,
			sky: null,
			bobs: {},
			initialCamera: null,
			tubes: [],
			blenderLights: [],
			dynamicLights: [],
			emissiveShapesFromBlender: [],
			emissiveShapesBuilt: [],
			positionsCollection: [],
			particlesWorld: this.worldConfig.main.particles,
			particlesCollection: [],
			happenings: {},
			bobMoves: {},
			bobFiles: {},
			misc: {
				landscape: {
					texture: null,
					material: null
				},
				sky: {
					texture: null,
					material: null
				}
			}
		};

		this.orbit = null;
		this.sceneIsReady = false;

		// Start
		this.loadsManager();

		
	}

	loadsManager(){

		this.loadGlb();

		this.loadTextures();

	}

	loadGlb(){

		Object.keys(this.worldConfig.main.meshInfos).forEach((key, index) => {

			const extension = this.worldConfig.main.meshInfos[key].glbPath.split(".")[1];

			switch( extension ){

				case "glb":
					// load GLB files
					this.glbLoader.load(
						this.worldConfig.main.meshInfos[key].glbPath, 
						glbFile => { this.glbParser(glbFile, index) }
					);
					break;

			}

		});

	}


	async loadBobTarget( mainObj ){

		return new Promise(res => {

			const loader = new FBXLoader();
			let target;

			let filePath = mainObj.fbxPath.split("/");
			const fileName = filePath.pop();
			filePath = filePath.join("/");

			loader.setPath(`.${filePath}/`);

			loader.load(fileName, (fbx) => {

				fbx.scale.setScalar(mainObj.infos.scale);

				fbx.traverse(c => {
					if( c.type !== "Bone" ){
						c.castShadow = true;
					}
				});

				target = fbx;
				target.name = mainObj.name;
				
				target.position.copy(mainObj.position);
				target.rotation.copy(mainObj.rotation);
				
				res(target);

			});
			
		});

	}

	async loadMoves( targets ){

		return new Promise(res => {

			const mixers = {};
			const animations = {};
	
			targets.forEach(target => {
	
				mixers[target.name] = new THREE.AnimationMixer(target);
	
			});
	
			const manager = new THREE.LoadingManager();
			const loader = new FBXLoader(manager);
	
			manager.onLoad = () => {
				res({ animations, mixers });
			};

			const _OnLoad = (animName, anim) => {
				
				const clip = anim.animations[0];

				Object.keys(mixers).forEach(mixerKey => {
	
					const action = mixers[mixerKey].clipAction(clip);
	
					if( !animations.hasOwnProperty(mixerKey) ){
						animations[mixerKey] = {};
					}
	
					animations[mixerKey][animName] = {
						clip: clip,
						action: action
					};
	
				});
	
			};
	
			loader.setPath("./assets/3d/persos/moves/smallGuy/");
	
			core.movesSpecs.smallGuy.forEach(fbxAnimName => {
	
				loader.load(`${fbxAnimName}.fbx`, (a) => { _OnLoad(fbxAnimName, a); });
	
			});

		});

	}

	createBob(){

		const { position, rotation } = this.sceneElements.positionsCollection.find(blenderObject => blenderObject.name === "bob-position_1-0");

		const promises = [];

		Object.keys(this.worldConfig.main.bobs).forEach(bobKey => {

			const bobInfos = Object.assign(
				{ position, rotation },
				this.worldConfig.main.bobs[bobKey]
			);

			promises.push(this.loadBobTarget(bobInfos));
			
		});


		Promise.all([promises[0], promises[1]])
			.then(
				targets => {

					// console.log("promise.all -> result all : ", targets);

					targets.forEach(bobFbx => {
						this.scene.add(bobFbx);
					});

					this.loadMoves(targets).then(movesObj => {

						targets.forEach(target => {

							this.sceneElements.bobs[target.name] = new CharacterController({
								scene: this.scene,
								target,
								animations: movesObj.animations[target.name],
								mixer: movesObj.mixers[target.name],
								bobInfos: this.worldConfig.main.bobs[target.name].infos
							});

						});

						this.onceBobIsLoaded();


					});

				},
				reason => {

					console.log("reason : ", reason)

				}
			);

	}


	glbParser( glbFile ){

		this.sceneElements.landscape = glbFile.scene.getObjectByName("landscape");

		this.sceneElements.initialCamera = glbFile.scene.getObjectByName("camera");

		this.createLandscapeShadow(this.sceneElements.landscape.clone());

		glbFile.scene.traverse(child => {

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

		this.assetsManager.glb = true;

	}

	loadTextures(){

		Object.keys(this.worldConfig.main.meshInfos.world.imagePath).forEach((key, index) => {

			this.sceneElements.misc[key].texture = this.textureLoader.load(
				this.worldConfig.main.meshInfos.world.imagePath[key],
				() => this.createBakedMaterial(key, index)
			);

		});

	}

	onceAssetsAreLoaded(){

		console.log("onceAssetsLoaded triggered");

		this.applyBakedOnMeshes();

		this.createElementsOnTheFly();

		this.composeScene();

		this.initScene();

	}

	onceBobIsLoaded(){

		console.log("onceBobIsLoaded triggered");

		this.sequencesBuild();

		this.refreshAndStartScene();

	}

	applyBakedOnMeshes(){

		Object.keys(this.worldConfig.main.meshInfos.world.imagePath).forEach(key => {

			this.sceneElements[key].material = this.sceneElements.misc[key].material;

		});

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
		fakeBob.position.copy(new THREE.Vector3());

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

	createBakedMaterial( key, index ){

		this.sceneElements.misc[key].texture.flipY = false;

		this.sceneElements.misc[key].texture.encoding = THREE.sRGBEncoding;

		this.sceneElements.misc[key].material = new THREE.MeshBasicMaterial({
			map: this.sceneElements.misc[key].texture
		});

		if( index === Object.keys(this.worldConfig.main.meshInfos.world.imagePath).length - 1 ){
			this.assetsManager.bakeds = true;
		}

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

		// // bobs 
		// Object.keys(this.sceneElements.bobs).forEach(bobKey => {
		// 	this.scene.add(this.sceneElements.bobs[bobKey]);
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

	sequencesBuild(){

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

	refreshAndStartScene(){

		this.camera.updateProjectionMatrix();

		// we say : ok good, ready
		// this value is watched in instanceThree.vue
		// and allow rendering start
		this.sceneIsReady = true;
		
	}

	getSceneAndSequencesElements(){
		return this;
	}

};



export { SceneBuilder };
