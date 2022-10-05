// THREE
import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import { SequencesBuilder } from '@/components/sequencesBuilder.js';
import { CharacterController } from '@/components/characterController.js';

class AssetsLoadWatcher {

	constructor(params){

		this._that = params;
		
		this._glb = false;
		this._bakeds = false;
		this._allReady = false;

	}

	set glb(x){
		console.log("set glb")
		this._glb = x;
		this.computeReadyness();
		if( x ){
			this._that.loadFbx();
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
		this.scene = new THREE.Scene();
		this.sequencesElements = {};
		this.sceneElements = {
			landscape: null,
			sky: null,
			bob: {},
			initialCamera: null,
			tubes: [],
			lights: [],
			happenings: {},
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

	loadFbx(){

		const { position, rotation } = this.sceneElements.bob.initialPosition;
		let filePath = this.worldConfig.main.meshInfos.bob.glbPath.split("/");
		const fileName = filePath.pop();

		filePath = filePath.join("/");

		this.sceneElements.bob.controller = new CharacterController({
			file: {
				path: filePath,
				name: fileName
			},
			scene: this.scene,
			camera: this.currentCamera,
			bobInfos: Object.assign(this.worldConfig.main.meshInfos.bob.infos, {
				start: { position, rotation }
			}),
			sceneBuilderThis: this
		});
		
	}

	glbParser( glbFile, indexGlb ){

		glbFile.scene.traverse(child => {

			switch( child.name ){

				// find map
				case "landscape":
					this.sceneElements.landscape = child;
					// quand on sera à la gestion des ombres :
					// this.sceneElements.landscapeShadow = child.clone();
					break;

				// find sky
				case "sky":
					this.sceneElements.sky = child;
					break;

				// find camera intial position
				case "camera":
					this.sceneElements.initialCamera = child;
					break;

				// find bob initial position
				case "bob-position":
					this.sceneElements.bob.initialPosition = child;
					break;

			}
				
			// find camera paths for blenderTubes
			if( child.name.indexOf("plan-") !== -1 ){

				this.sceneElements.tubes.push(child);

			}

			// find lights
			if( child.name.indexOf("light-") !== -1 ){

				this.sceneElements.lights.push(child);

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

	onceAssetsAreLoaded(){

		console.log("onceAssetsLoaded triggered");

		this.applyBakedOnMeshes();

		this.composeScene();

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

	composeScene(){

		// Here we add landcape / sky? / bob?
		Object.keys(this.worldConfig.main.meshInfos.world.imagePath).forEach(key => {

			this.scene.add(this.sceneElements[key]);

		});

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

};



export { SceneBuilder };
