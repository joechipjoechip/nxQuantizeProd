// THREE
import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
	}

	get glb(){
		return this._glb;
	}

	set bakeds(x){
		this._bakeds = x;
		this.computeReadyness();
	}

	get bakeds(){
		return this._bakeds;
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
		this.canvas = params.canvas;
		this.worldConfig = params.worldConfig;

		// Internal variables
		this.assetsManager = new AssetsLoadWatcher(this);
		this.scene = null;

		// _ Loaders
		this.dracoLoader = new DRACOLoader();
		this.glbLoader = new GLTFLoader();
		this.textureLoader = new THREE.TextureLoader();
		// _ _ to load compressed glTF (so glB files) we need a DracoLoader
		this.dracoLoader.setDecoderPath("assets/js/draco/");
		this.glbLoader.setDRACOLoader(this.dracoLoader);

		// _ Three elements
		this.aspectRatio = window.innerWidth / window.innerHeight;
		this.camera = new THREE.PerspectiveCamera(75, this.aspectRatio, 0.1, 100);
		this.scene = new THREE.Scene();
		this.sceneElements = {
			landscape: null,
			sky: null,
			bob: null,
			initialCamera: null,
			lights: [],
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

		Object.keys(this.worldConfig.main.meshInfos).forEach(key => {

			// load GLB files
			this.glbLoader.load(
				this.worldConfig.main.meshInfos[key].glbPath, 
				glbFile => { this.glbParser(glbFile) }
			);

		});

	}

	glbParser( glbFile ){

		glbFile.scene.traverse(child => {

			switch( child.name ){

				// find map
				case "landscape":
					this.sceneElements.landscape = child;
					// quand on sera à la gestion des ombres :
					// this.sceneElements.landscapeShadow = child.clone();
					break

				// find sky
				case "sky":
					this.sceneElements.sky = child;
					// quand on sera à la gestion des ombres
					// this.sceneElements.landscapeShadow = child.clone();
					break

				// find camera intial position
				case "camera":
					this.sceneElements.initialCamera = child;
					break

				// find bob initial position
				case "bob-position":
					this.sceneElements.bob = child;
					break
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
		console.log("onceAssetsLoaded trigger");

		this.applyBakedOnMeshes();

		this.composeScene();

		this.addHelpers();

		this.refreshScene();

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

	addHelpers(){

		this.orbit = new OrbitControls(this.camera, this.canvas);

		this.orbit.target = this.sceneElements.landscape.position;

		this.orbit.enabled = true;

		this.orbit.enableDamping = true;

	}

	refreshScene(){

		this.camera.updateProjectionMatrix();

		this.sceneIsReady = true;

	}

};



export { SceneBuilder };
