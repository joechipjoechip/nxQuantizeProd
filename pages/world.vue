<template>
	<div>
		<p v-if="currentCamera">current camera name : {{ currentCamera.name }}</p>
		<canvas 
			class="webgl" 
			ref="canvas"
			@mousemove="mouseMoveHandler"
		></canvas>
			<!-- @click="onCanvasClickHandler" -->
	</div>
</template>

<script>

	// GSAP
	import { TimelineMax } from 'gsap';

	// THREE
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
	import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

	// TWEENS BUILDER
	import { SpecificManualCameraTweenBuilder } from '@/components/SpecificManualCameraTweenBuilder.js';
	import { BlenderTubes } from '@/components/BlenderTubes.js';

	// CHARACTER HANDLERS
	import { CharacterController } from '@/components/CharacterController.js';
	import { ThirdPersonCamera } from '@/components/ThirdPersonCamera.js';

	// MISC
	import { DynamicLightsBuilder } from '@/components/DynamicLightsBuilder.js';
	import { GuiManager } from '@/components/GuiManager.js';


	export default {
		props: {

			mainConfig: {
				type: Object,
				required: true
			},

			thisWorld: {
				type: Object,
				required: true
			},

			thisWorldKey: {
				type: String,
				required: true
			},

			visibleSequenceID: {
				type: String,
				required: true
			},

			visibleWorldKey: {
				type: String,
				required: true
			},

		},

		data(){
			return{
				scene: null,
				gltf: [],
				orbit: null,
				currentTarget: null,
				oldTarget: null,
				elementsAtInit: {
					lights: [],
					landscape: null,
					link: null,
					linkPositions: []
				},
				linkController: null,
				linkHasBeenAdded: false,
				generatedCameras: {},
				thirdPersonCamera: {},
				currentCamera: null,
				landscape: null,
				link: null,
				timelines: {},
				// une place est un point de vue caméra position/rotation/fov
				currentPlace: null,
				oldPlace: null,
				animationMixer: null,
				debug: {
					animated: true
				},
				mousePos: {
					x: window.innerWidth / 2,
					y: window.innerHeight / 2
				},
				canvasSizeRef: { 
					width: window.innerWidth, 
					height: window.innerHeight
				},
				mouseRecenterTimeoutID: null
			}
		},

		computed: {

			animateWorld(){
				return this.thisWorldKey === this.visibleWorldKey;
			},

			currentSequence(){
				return this.thisWorld.sequences.find(seq => seq.id === this.visibleSequenceID);
			},

			currentPlaces(){
				return this.currentSequence?.paths?.places;
			}

		},

		mounted(){

			Object.keys(this.mainConfig.generatedCamerasSpecs).forEach(key =>{

				this.generatedCameras[key] = null;

			});

			this.initThree();

		},

		watch: {

			"debug.animated"( newVal ){

				if( newVal ){

					console.log("animation started");
					this.mainTick();

				} else {

					console.log("animation stopped");

				}

			},

			mousePos(){

				if( this.mouseRecenterTimeoutID ){
					clearTimeout(this.mouseRecenterTimeoutID);
				}

				this.mouseRecenterTimeoutID = setTimeout(
					this.mouseRecenter,
					this.mainConfig.mouse.moveTimeout * 1000
				);

			},

			animateWorld( newVal ){

				if( newVal ){

					console.log("let s run : ", this.thisWorldKey, this.currentSequence?.id, this.scene);

					// this.mainTick();

				} else {

					console.log("let s stop : ", this.thisWorldKey, this.currentSequence?.id, this.scene);

				}

			},

			currentSequence( newVal ){

				if( newVal ){

					this.onCurrentSequenceChange(newVal);
					
				}

			},

			"scene.children"( newVal ){

				if( newVal.find(child => child.name === "mainMapMerged") && !this.orbit?.enabled ){

					this.orbit = new OrbitControls(this.currentCamera, this.$refs.canvas);

					this.orbit.target = this.elementsAtInit.landscape.position;

					this.orbit.enabled = true;

					this.orbit.enableDamping = true;
					
				}


				// trigger when link is added
				if( newVal.find(child => child.name === "linkMain") && !this.linkHasBeenAdded){

					console.log("link has been added");

					// this.addLights();

					this.linkHasBeenAdded = true;

				}

			},

			linkHasBeenAdded( newVal ){

				console.log("watch du linkHasBeenAdded : ", newVal);

				this.createGeneratedCameras();


			},

			currentCamera( newVal ){

				this.currentCameraSpecs = this.mainConfig.generatedCamerasSpecs[newVal.name];

				this.currentThirdPersonCamera = this.thirdPersonCamera[newVal.name];

			}

		},

		methods: {

			mouseRecenter(){

				console.log("recentering the mousePos");

				const animatedObject = {
					x: this.mousePos.x,
					y: this.mousePos.y
				};

				const tlRecenter = new TimelineMax();

				tlRecenter.to(animatedObject, this.mainConfig.mouse.recenterDuration, {
					x: 0,
					y: 0,
					onUpdate( that ){

						that.mousePos.x = animatedObject.x;
						that.mousePos.y = animatedObject.y;

					},
					onUpdateParams: [this]
				});

			},

			updateCanvasRefSize(){

				const { width, height } = this.$refs.canvas.getBoundingClientRect();

				this.canvasSizeRef = { 
					width: width !== 0 ? width : window.innerWidth, 
					height: height !== 0 ? height : window.innerHeight
				};

			},

			mouseMoveHandler( event ){
				
				this.mousePos = {
					x: (((event.offsetX + this.canvasSizeRef.width / 2) / this.canvasSizeRef.width) - 1) * 2,
					y: (((event.offsetY + this.canvasSizeRef.height / 2) / this.canvasSizeRef.height) - 1) * -2
				};

			},

			onCurrentSequenceChange( newSequence ){

				if( this.gltf.length < 1 ) return;

				// lors de ce watch, en fait, on ne ferra qu'aller updater :
				// fog / camera position / animation / material (éventuellement) / etc
				// et lancer les mouvements de camera spécifiques à la currentSequence
				// ainsi que le isVisible ! !
				this.initSceneUpdatedValues();

				this.checkIfCurves();

				if( newSequence.animatedMesh ){

					this.animateMesh();

				}

				if( newSequence.hasOwnProperty("link") ){

					const linkInfos = newSequence.link;
					linkInfos.start = this.elementsAtInit.linkPositions[0];

					// on intialise le link avec son controller
					this.linkController = new CharacterController({
						scene: this.scene,
						camera: this.currentCamera,
						linkInfos
					});

				}

				this.initGui();

				// here comes the move
				this.actionDispatcher(newSequence);
	
				this.mainTick();

			},

			gltfInits(){

				// console.log("enter in gltfInits with : ", this.gltf);

				// 1 - on récupère les models dans this.elementsAtInit
				this.gltf.forEach(gltf => {

					gltf.scene.traverse(child => {
	
						// find map
						if( child.name === this.thisWorld.base.meshsInfos.map.name ){
	
							this.elementsAtInit.landscape = child;
	
						}

						// find lights
						if( child.name.indexOf("light-") !== -1 ){
	
							this.elementsAtInit.lights.push(child);
	
						}

						// find link's positions
						if( child.name.indexOf("link-position-") !== -1 ){
	
							this.elementsAtInit.linkPositions.push(child);
	
						}
	
					});

				});

				// 2.1 - on add le landscape
				if( this.elementsAtInit.landscape ){

					if( this.bakedMaterial ){

						console.log(" / / / / / / / landscape is BAKED");

						this.elementsAtInit.landscape.material = this.bakedMaterial;

						this.scene.add(this.elementsAtInit.landscape);

						this.landscape = this.elementsAtInit.landscape;

					}

				}

				// 2.2 - on add les lights dynamiques (qui ne vont s'appliquer qu'à link)
				if( this.elementsAtInit.lights.length > 0 ){

					this.addLights();

				}

			},

			createGeneratedCameras(){

				Object.keys(this.mainConfig.generatedCamerasSpecs).forEach(key => {

					this.buildOneGeneratedCamera(key);

				});

			},

			addLights(){

				new DynamicLightsBuilder({
					lightsArr: this.elementsAtInit.lights,
					scene: this.scene
				});

			},

			buildOneGeneratedCamera( cameraType ){

				const aspectRatio = window.innerWidth / window.innerHeight;

				const cameraToAdd = new THREE.PerspectiveCamera(75, aspectRatio, 0.0001, 20);

				const realLink = this.scene.children.find(child => child.name === "linkMain");

				const cameraInitialPosition = realLink.position.add(new THREE.Vector3(0, 0.1, 0));;

				cameraToAdd.position.copy(cameraInitialPosition);

				// console.log("generation de la cam dynamique : target._controls : ", cameraInitialPosition);

				cameraToAdd.name = cameraType;

				this.scene.add(cameraToAdd);

				this.generatedCameras[cameraType] = cameraToAdd;

				this.thirdPersonCamera[cameraType] = new ThirdPersonCamera({
					target: this.linkController._controls,
					camera: this.generatedCameras[cameraType],
					specs: this.mainConfig.generatedCamerasSpecs[cameraType]
				});

			},

			getRandomInt( min, max){
				return Math.floor(Math.random() * (max - min + 1)) + min;
			},

			onCanvasClickHandler(){

				const actualCamName = this.currentCamera.name;
				const generatedCamerasKeys = Object.keys(this.mainConfig.generatedCamerasSpecs);

				// bit dirty but quick (and removed later then)

				let randomOtherName = generatedCamerasKeys[this.getRandomInt(0, generatedCamerasKeys.length - 1)];

				while( actualCamName === randomOtherName ){

					randomOtherName = generatedCamerasKeys[this.getRandomInt(0, generatedCamerasKeys.length - 1)];

				}

				this.currentCamera = this.generatedCameras[randomOtherName];

			},

			checkIfCurves(){

				if( this.currentSequence?.blenderCurvesAndTubes ){

					console.log(`TUBES : in ${this.thisWorldKey}, sequence.id: ${this.currentSequence.id}`);

					this.blenderTubesManager = new BlenderTubes({
						currentSequence: this.currentSequence,
						gltf: this.gltf,
						scene: this.scene,
						currentCamera: this.currentCamera
					});

				}
				
			},

			animateMesh(){

				// console.log("init de l'animationMixer (scene / gltf) ", this.scene, this.gltf);

				// on créé le mixer (général, qui va TOUT animer
				this.animationMixer = new THREE.AnimationMixer(this.scene);


				// on créé les clips
				// -> clips elements
				this.gltf.forEach(gltf => {

					gltf.animations.forEach(anim => {
	
						// console.log(`une anim : ${anim?.name}`, anim);
	
						const action = this.animationMixer.clipAction(anim);
	
						action.play();
	
					});

				});
				
			},

			animateLink(){

				// cette fonction n'est plus utilisée, mais je la garde de côté car
				// elle pourrait être reprise (après quelques modifs) pour provoquer des mouvements
				// d'objets d'un point A à un point B

				// deplacer la position du mesh de link
				const startPos = this.elementsAtInit.linkPositions.find(entity => entity.name.indexOf("start") !== -1).position;
				const endPos = this.elementsAtInit.linkPositions.find(entity => entity.name.indexOf("end") !== -1).position;

				const animatedObject = {
					x: startPos.x,
					y: startPos.y,
					z: startPos.z
				};

				this.link.position.set(startPos.x, startPos.y, startPos.z);

				const tl = new TimelineMax();

				tl.to(animatedObject, 10, {
					x: endPos.x,
					y: endPos.y,
					z: endPos.z,

					onUpdate( link ){
						link.position.set(animatedObject.x, animatedObject.y + 0.1, animatedObject.z);
					},
					onUpdateParams: [this.link],

					onComplete( that ){

						that.animateLink();

					},
					onCompleteParams: [this]
				});


			},


			// MAINS INITS WORLD
			initThree(){

				const meshKeys = Object.keys(this.thisWorld.base.meshsInfos);
				const gltfToLoadNb = meshKeys.length;

				// BASE : 
				// Scene
				this.scene = new THREE.Scene();

				if( this.thisWorld.base.fog.enabled ){

					this.scene.fog = new THREE.FogExp2(
							this.thisWorld.base.fog.color, 
							this.thisWorld.base.fog.intensity
					);

				}

				// LOADERS
				this.textureLoader = new THREE.TextureLoader();

				// DRACO loader
				// si on a compressé le model à l'export dans blender, on aura besoin d'un DRACOLoader
				const dracoLoader = new DRACOLoader();
				dracoLoader.setDecoderPath("draco/");

				// ATTENTION : ne pas oublier d'aller copier les fichier .js qui se trouvent dans static/draco

				// GLTF loader
				const gltfLoader = new GLTFLoader();
				gltfLoader.setDRACOLoader(dracoLoader);

				// Textures
				this.loadBaseBakedTexture();

				// MATERIALS
				// baked materials
				this.bakedMaterial = new THREE.MeshBasicMaterial({
					map: this.bakedTexture
				});

				// MODEL
				meshKeys.forEach(key => {

					gltfLoader.load(this.thisWorld.base.meshsInfos[key].url,
						(gltf) => {
	
							this.gltf.push(gltf);
	
							if( this.gltf.length === gltfToLoadNb ){

								this.gltfInits();

							}
	
						}
					);

				});

				// Camera
				const aspectRatio = window.innerWidth / window.innerHeight;
				this.elementsAtInit.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.0001, 100);

				this.elementsAtInit.camera.name = "baseCamera";

				// init camera infos
				const cameraInitialInfos = this.currentSequence?.paths?.initial;

				if( cameraInitialInfos ){

					this.elementsAtInit.camera.position.set(
						cameraInitialInfos.position.x,
						cameraInitialInfos.position.y,
						cameraInitialInfos.position.z
					);
	
					this.elementsAtInit.camera.rotation.set(
						cameraInitialInfos.rotation.x,
						cameraInitialInfos.rotation.y,
						cameraInitialInfos.rotation.z
					);

					this.elementsAtInit.camera.fov = cameraInitialInfos.fov.value;

				}

				// init this.oldFov
				this.oldFov = this.elementsAtInit.camera.fov;

				// then add it to the scene
				this.scene.add(this.elementsAtInit.camera);

				this.currentCamera = this.scene.children.find(child => child.name === "baseCamera");

				this.currentCamera.updateProjectionMatrix();


				// Axes helper : 
				// const axesHelper = new THREE.AxesHelper(2);
				// scene.add(axesHelper);

				// Renderer
				this.renderer = new THREE.WebGLRenderer({
					canvas: this.$refs.canvas,
					// ne peut pas être déclaré en dehors de l'instanciation
					antialias: true
				});

				this.renderer.setPixelRatio(window.devicePixelRatio);

				this.renderer.setSize(this.canvasSizeRef.width, this.canvasSizeRef.height);

				this.renderer.setClearColor("#000000");

				this.renderer.outputEncoding = THREE.sRGBEncoding;

				// this.renderer.shadowMap.enabled = true;

				// this.renderer.shadowMap.type = THREE.PCFShadowMap;

				this.clock = new THREE.Clock();

			},

			initGui(){

				new GuiManager({
					mainConfig: this.mainConfig,
					debug: this.debug,
					elementsAtInit: this.elementsAtInit,
					orbit: this.orbit,
					scene: this.scene
				});

			},


			// SEQUENCE INITS :
			initSceneUpdatedValues(){

				if( !this.currentSequence ){ return; }

				if( this.currentSequence.config?.fog?.enabled ){
					// si la séquence le demande, le fog est écrasé

					this.scene.fog = new THREE.FogExp2(
						this.currentSequence.config.fog.color, 
						this.currentSequence.config.fog.intensity
					);

				}

				if( this.scene.children.find(el => el.name === "mainMapMerged") ){

					const mainMapMerged = this.scene.children.find(el => el.name === "mainMapMerged");

					if( this.currentSequence.config.material ){
	
						this.bakedTexture = this.textureLoader.load(this.currentSequence.config.material.url);
	
						this.bakedTexture.flipY = false;
	
						this.bakedTexture.encoding = THREE.sRGBEncoding;
	
						this.bakedMaterial = new THREE.MeshBasicMaterial({
							map: this.bakedTexture
						});
	
						mainMapMerged.material = this.bakedMaterial;

	
					} else {
						// on rétablit le matérial de base 

						this.loadBaseBakedTexture();

						this.bakedMaterial = new THREE.MeshBasicMaterial({
							map: this.bakedTexture
						});
	
						mainMapMerged.material = this.bakedMaterial;

					}

				}

			},

			loadBaseBakedTexture(){

				if( !this.thisWorld.base.meshsInfos.map.baked ){ return; }

				this.bakedTexture = this.textureLoader.load(
					this.thisWorld.base.meshsInfos.map.baked
				);

				this.bakedTexture.flipY = false;

				this.bakedTexture.encoding = THREE.sRGBEncoding;

			},
 
			// ACTIONS
			actionDispatcher( sequence ){

				switch(sequence.type){
					case "blender-tube":

						// seq 1.0
						this.timelines.camera = this.blenderTubesManager._TweenBuilder();
						
						break;

					case "manual-camera-positionning":

						// seq 1.1
						this.timelines.camera = this.buildGeneralManualCameraTween(this.currentSequence.paths.steps);

						break;
				}

				// this.timelines.camera.
				// attach un onComplete qui détruit la variable this.timelines.camera

				if( this.timelines.camera ){

					this.timelines.camera.eventCallback("onComplete", () => {
	
						console.log("vidage de this.timelines.camera");
						this.timelines.camera = null;
	
					});
	
					this.gltf.length && this.timelines.camera.play();

				}

			},

			// MANUAL CAMERA POSITIONNING INITS
			buildGeneralManualCameraTween( steps ){

				console.log("buildGeneralManualCameraTween() -> steps : ", steps);

				const moveTl = new TimelineMax();

				this.currentStepToBuild = 0;

				for(let i = 0; i <= steps.length - 1; i++){

					moveTl.add(this.buildSpecificManualCameraTween(steps[i]));

				}

				moveTl.pause();

				return moveTl;

			},

			buildSpecificManualCameraTween( currentStep ){

				return new SpecificManualCameraTweenBuilder({
					currentPlaces: this.currentPlaces,
					currentCamera: this.currentCamera,
					currentStep: currentStep
				});

			},

			// USESLESS METHODS
			pointCameraTo( transitionInfos ){

				// triggered when this.currentTarget is changed (watch)

				this.orbit.enabled = false;

				if( transitionInfos.position instanceof THREE.Vector3 ){

					const animatedObject = {
						x: this.oldTarget.position.x,
						y: this.oldTarget.position.y,
						z: this.oldTarget.position.z
					};

					const tl = new TimelineMax();

					tl.to(
						animatedObject, 
						transitionInfos.global.duration, 
						{
							x: transitionInfos.position.x,
							y: transitionInfos.position.y,
							z: transitionInfos.position.z,
							ease: transitionInfos.ease,

							onUpdate: (that) => {

								const transitionVectorToLookAt = new THREE.Vector3(
									animatedObject.x,
									animatedObject.y,
									animatedObject.z
								);

								that.currentCamera.lookAt(transitionVectorToLookAt);

							},
							onUpdateParams: [this],

							onComplete: (that) => {

								const finalVectorToLookAt = new THREE.Vector3(
									transitionInfos.position.x,
									transitionInfos.position.y,
									transitionInfos.position.z
								);


								that.orbit.target = that.currentTarget.position;

								that.currentCamera.lookAt(finalVectorToLookAt);

								that.orbit.enabled = true;

								that.oldTarget = that.currentTarget;

							},
							onCompleteParams: [this]

						});

				}

			},

			// ANIMATIONS
			tickThree(){

				// console.log("three tick triggerd");

				const elapsedTime = this.clock.getElapsedTime();

				const deltaTime = elapsedTime - this.oldElapsedTime;

				if( this.orbit ){

					this.orbit.update();

				}

				if( this.tubeTravelTargetPosition ){

					console.log("tubeTravelTargetPosition : au render ca lookat");

					this.currentCamera.lookAt(this.tubeTravelTargetPosition);

				}

				if( this.animationMixer ){

					// console.log("animation mixer update");
					this.animationMixer.update(deltaTime);

				}


				if( this.linkController ){

					this.linkController._controls.Update(deltaTime);

				}

				if( this.currentThirdPersonCamera ){

					this.currentThirdPersonCamera.Update(elapsedTime, this.mousePos);

				}

				// NOW COMPUTE RENDER
				this.renderer.render(this.scene, this.currentCamera);

				this.oldElapsedTime = elapsedTime;

			},

			mainTick(){

				// console.log("ok le tick à ", this.thisWorldKey);

				this.tickThree();

				(this.animateWorld && this.debug.animated) && window.requestAnimationFrame(this.mainTick);

			}

		}

	}

</script>

<style lang="scss" scoped>

	canvas {
		// position: fixed;
		// top: 0;
		// left: 0;
		outline: none;


		pointer-events: all;
		z-index: 3;
	}

	p {
		color: black;
		z-index: 5;
	}

</style>
