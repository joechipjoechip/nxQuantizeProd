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

	import * as THREE from 'three';

	import * as dat from 'dat.gui';


	import { TimelineMax } from 'gsap';

	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

	import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

	import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

	import { CharacterController } from '@/components/characterController.js';
	import { ThirdPersonCamera } from '@/components/thirdPersonCamera.js';

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

				if( newVal.filter(child => child.name === "mainMapMerged")[0] ){

					this.orbit = new OrbitControls(this.currentCamera, this.$refs.canvas);

					this.orbit.target = this.elementsAtInit.landscape.position;

					this.orbit.enabled = true;

					this.orbit.enableDamping = true;
					
				}

			},

			currentCamera( newVal ){

				this.currentCameraSpecs = this.mainConfig.generatedCamerasSpecs[newVal.name];

				this.currentThirdPersonCamera = this.thirdPersonCamera[newVal.name];

			}

		},

		mounted(){

			Object.keys(this.mainConfig.generatedCamerasSpecs).forEach(key =>{

				this.generatedCameras[key] = null;

			});

			this.initThree();

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

					this.createGeneratedCameras();

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

				// on positionne le link
				// this.setupLink();

			},

			setupLink(){

				console.log("setupLink : ", this.link);

				if( this.link ){

					this.link.scale.set(0.06, 0.06, 0.06);

					this.link.rotation.x = 0.8;
					this.link.rotation.y = 2.1;

					// this.gui
					// 	.add(this.link.rotation, "x")
					// 	.step(0.1)
					// 	.min(-Math.PI * 2)
					// 	.max(Math.PI * 2)
					// 	.name("link x");

					// this.gui
					// 	.add(this.link.rotation, "y")
					// 	.step(0.1)
					// 	.min(-Math.PI * 2)
					// 	.max(Math.PI * 2)
					// 	.name("link y");
					
					// this.gui
					// 	.add(this.link.rotation, "z")
					// 	.step(0.1)
					// 	.min(-Math.PI * 2)
					// 	.max(Math.PI * 2)
					// 	.name("link z");



				}

			},

			createGeneratedCameras(){

				Object.keys(this.mainConfig.generatedCamerasSpecs).forEach(key => {

					this.buildOneGeneratedCamera(key);

				});

				// this.buildOneGeneratedCamera("gtaLike");

			},

			addLights(){

				const wellStoredLights = [];
				const lightsToCreate = [];

				// Blender exporte les lights en 2 objets distincts, 
				// donc on est obligé de retraiter la data pour l'organiser mieux
				for(let i = 0; i < this.elementsAtInit.lights.length; i = i + 2){

					wellStoredLights[i] = [];

					wellStoredLights[i].push(this.elementsAtInit.lights[i]);

					wellStoredLights[i].push(this.elementsAtInit.lights[i + 1]);

				};

				// the .filter is necessary to remove empty slots caused by the previous treatment
				wellStoredLights.filter(a => a).forEach((collection, indexCollection) => {

					lightsToCreate[indexCollection] = {};

					collection.forEach(entity => {
	
						if( entity instanceof THREE.PointLight ){
	
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

					lightToAdd.position.copy(light.position);

					lightToAdd.name = `light-${index + 1}`;

					// et on add à la scene
					this.scene.add(lightToAdd);

				});

			},

			buildOneGeneratedCamera( cameraType ){

				const aspectRatio = window.innerWidth / window.innerHeight;

				const cameraToAdd = new THREE.PerspectiveCamera(75, aspectRatio, 0.0001, 20);

				cameraToAdd.position.copy(this.linkController._controls._position);

				console.log("generation de la cam dynamique : target._controls : ", this.linkController._controls._position);

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

					console.log(`in ${this.thisWorldKey}, sequence.id: ${this.currentSequence.id} part aux tubes`);

					this.initBlenderCurvesAndTubes();

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


				this.renderer.setSize(window.innerWidth, window.innerHeight);

				this.renderer.outputEncoding = THREE.sRGBEncoding;

				this.renderer.setClearColor("#000000");

				this.clock = new THREE.Clock();

			},

			initGui(){

				this.gui = new dat.GUI({
					closed: true,
					width: 250
				});

				// ANIMATION
				this.gui
					.add(this.debug, "animated")
					.name("run animation");

				// FOG
				if( this.mainConfig.fog.enabled ){

					this.gui
						.add(this.mainConfig.fog, "intensity")
						.min(0)
						.max(2)
						.step(0.1)
						.name("scene fog")
						.onChange(() => {
	
							this.scene.fog = new THREE.FogExp2(
									this.mainConfig.fog.color, 
									this.mainConfig.fog.intensity
							);
	
					});

					this.gui
						.addColor(this.mainConfig.fog, "color")
						.name("fog color")
						.onChange(() => {
	
							this.scene.fog = new THREE.FogExp2(
									this.mainConfig.fog.color, 
									this.mainConfig.fog.intensity
							);
	
					});
					
				}

				// ELEMENTS
				if( this.mainConfig.guiConfig ){

					Object.keys(this.elementsAtInit).forEach(key => {
	
						const currentGuiFolder = this.gui.addFolder(key);
	
						this.mainConfig.guiConfig.elements[key] = {};
	
						// position / rotation
	
	
						Object.keys(this.mainConfig.guiConfig.actions).forEach(actionKey => {
	
							const currentGuiSubFolder = currentGuiFolder.addFolder(actionKey);
	
							this.mainConfig.guiConfig.elements[key][actionKey] = { x: 0, y: 0, z: 0 };
	
							Object.keys(this.mainConfig.guiConfig.elements[key][actionKey]).forEach(subKey => {
	
								currentGuiSubFolder
									.add(this.mainConfig.guiConfig.elements[key][actionKey], subKey)
									.name(`-> ${subKey}`)
									.min(this.mainConfig.guiConfig.actions[actionKey].min).max(this.mainConfig.guiConfig.actions[actionKey].max).step(this.mainConfig.guiConfig.actions[actionKey].step)
									.onChange(() => {
										console.log("onChange : ", this.elementsAtInit[key]);
										// this.elementsAtInit[key][actionKey].set(this.mainConfig.guiConfig.elements[key][actionKey]);
										this.elementsAtInit[key][actionKey][subKey] = this.mainConfig.guiConfig.elements[key][actionKey][subKey];
									});
	
							});
	
						});
	
					});
	
	
	
					// FUNCTIONS :
	
					// reveal infos camera :
					this.mainConfig.guiConfig.camera = {};
	
					// position
					this.mainConfig.guiConfig.camera.revealPosition = () => {
	
						const realCamera = this.scene.children.find(child => child instanceof THREE.PerspectiveCamera );
	
						console.log(realCamera);
	
					};
					this.gui.add(this.mainConfig.guiConfig.camera, "revealPosition").name("revealPosition()");
	
					// fov
					this.mainConfig.guiConfig.camera.revealFov = () => {
	
						const realCamera = this.scene.children.find(child => child instanceof THREE.PerspectiveCamera );
	
						console.log(realCamera.fov);
	
					};
					this.gui.add(this.mainConfig.guiConfig.camera, "revealFov").name("revealFov()");
	
	
					// play intro
					this.mainConfig.guiConfig.playIntro = () => {
	
						// seq 1.0
						// this.timelines.camera = this.buildTubeTravellingTween();

						// seq 1.1
						// this.timelines.camera = this.buildGeneralManualCameraTween(this.currentSequence.paths.steps);
	
						// en gros : ça c'est le lancement de séquence :
						// this.timelines.camera.play();
	
					};
					this.gui.add(this.mainConfig.guiConfig, "playIntro").name("playIntro()");
	
	
					// enable/disable orbit :
					this.mainConfig.guiConfig.orbitEnabler = () => {
	
						this.orbit.enabled = !this.orbit.enabled;
	
					};
					this.gui.add(this.mainConfig.guiConfig, "orbitEnabler").name("orbitEnabler()");

				}

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

						// mainMapMerged.receiveShadow = true;

						// mainMapMerged.receiveShadow = true;

						// mainMapMerged.material.needsUpdate = true;

	
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
						// this.timelines.camera = this.buildTubeTravellingTween();
						
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

			// BLENDER CURVES AND TUBES INITS
			initBlenderCurvesAndTubes(){

				const pathName = this.currentSequence?.pathName;

				if( !pathName || !this.gltf ){ return; }

				// D'abord on récupère les objets vides crés dans blender
				this.elementsAtInit.curvePoints = this.gltf.scene.children.filter(child => child.name.indexOf(pathName) !== -1);
				
				this.smoothedCurvePoints = this.elementsAtInit.curvePoints?.map(object3d => {

					return new THREE.Vector3(
						object3d.position.x, 
						object3d.position.y, 
						object3d.position.z
					);

				});

				// Et Ensuite on construit tout ça :
				const parentPath = new THREE.Object3D();

				parentPath.name = "parentPath";

				const curve = new THREE.CatmullRomCurve3(this.smoothedCurvePoints || 0, false, "chordal");

				// ADD TUBE
				const tubeGeometry = new THREE.TubeGeometry( curve, 64, 0.06, 8);


				// ADD GEOMETRY
				const material = new THREE.MeshLambertMaterial( { 
					color: 0xff00ff, 
					side: THREE.DoubleSide,
					wireframe: true,
					visible: this.thisWorld.sequences[0].debug?.seeTube ? true : false
				});

				this.tube = new THREE.Mesh( tubeGeometry, material );

				this.tube.name = "tube";

				parentPath.add( this.tube );

				this.scene.add(parentPath);

				this.cameraShouldTravel = true;

			},

			buildTubeTravellingTween(){

				const linkGroup = this.scene.children.find(child => child.name === "link");

				// const link = linkGroup.children[0];
				const link = this.scene.children.find(child => child.name === "mainMapMerged");

				// à décoréler des frames
				const tlToReturn = new TimelineMax();

				const tlSequence = new TimelineMax();

				const globalDuration = this.currentSequence.global.duration;


				this.currentSequence.curveSteps.forEach((step, index) => {

					
					const tlStep = new TimelineMax();

					const thisStepDuration = ((globalDuration / 100) * step.duration);

					const alreadyPlayedStep = this.currentSequence.curveSteps.filter((onStep, indexSeq) => {

						if( indexSeq <  index ){
							return onStep;
						}

					});

					let alreadyPlayedDuration = alreadyPlayedStep.reduce((acc, step) => {

						const specificStepDuration = ((globalDuration / 100) * step.duration);

						return acc + specificStepDuration;

					}, 0);

					// console.log("alreadyPlayedDuration : ", alreadyPlayedDuration);
					// console.log("this step duration : ", thisStepDuration);

					const animatedObject = {
						time: alreadyPlayedDuration
					};

					const timeToReach = alreadyPlayedDuration + thisStepDuration;

					tlStep.to(
						animatedObject, 
						thisStepDuration, 
						{
							time: timeToReach,
							ease: step.stepEase,

							onUpdate: () => {

								const time = animatedObject.time;

								const looptime = globalDuration;

								const t = ((time % looptime) / looptime);

								const t2 = (((time + 0.2) % looptime) / looptime);

								// console.log("time : ", time);
									
								const pos1 = this.tube.geometry.parameters.path.getPointAt(t);     

								const pos2 = this.tube.geometry.parameters.path.getPointAt(t2);
								
								this.currentCamera.position.copy(pos1);

								if( this.currentSequence.type.indexOf("target") !== -1 ){

									this.tubeTravelTargetPosition = link.position;

								} else {
									
									this.tubeTravelTargetPosition = pos2;

								}

								

							},

							onComplete: () => {

								console.log("this specific step is done : ", index);

								this.tubeTravelTargetPosition = false;

							}

						}

					);

					tlSequence.add(tlStep);

				});

				tlToReturn.add(tlSequence);

// 

				tlToReturn.pause();

				return tlToReturn;




				// const linkGroup = this.scene.children.find(child => child.name === "linkGltfScene");

				// const linkPosition = linkGroup.children[0].position;





				// const looptime = 10; //velocity
				
				// const t = (time % looptime) / looptime;

				// const t2 = ((time + 0.1) % looptime) / looptime;
					
				// const pos1 = this.tube.geometry.parameters.path.getPointAt(t);     

				// const pos2 = this.tube.geometry.parameters.path.getPointAt(t2);
				
				// this.currentCamera.position.copy(pos1);

				// // si on veut regarder droit devant la camera :
				// // this.currentCamera.lookAt(pos2);

				// // mais si on veut lookAt une target :
				// this.currentCamera.lookAt(linkPosition);


			},

			// MANUAL CAMERA POSITIONNING INITS
			buildGeneralManualCameraTween( steps ){

				console.log("buildGeneralManualCameraTween() -> steps : ", steps);
				// buildGeneralManualCameraTween works with tweens
				// donc c'est indépendant des logiques raf / tick()

				const moveTl = new TimelineMax();

				this.currentStepToBuild = 0;

				for(let i = 0; i <= steps.length - 1; i++){

					moveTl.add(this.buildSpecificManualCameraTween(steps[i]));

				}

				moveTl.pause();

				return moveTl;

			},

			buildSpecificManualCameraTween( currentStep ){

				this.currentPlace = this.currentPlaces.find(place => place.id === currentStep.global.placeString);

				const tl = new TimelineMax();

				// We store actual camera position, in a very scoped object


				// POSITION
				if( this.currentPlace.position ){

					const animatedObject = {};

					animatedObject.position = this.currentCamera.position;
					animatedObject.position = this.currentCamera.position;

					tl.to(
						animatedObject.position, 
						{
							duration: this.currentPlace.position.duration * (currentStep.global.duration / 100), 
							x : this.currentPlace.position.x,
							y : this.currentPlace.position.y,
							z : this.currentPlace.position.z,
							ease: this.currentPlace.position.ease,

							onUpdate: (that) => {

								// and at update we update the real camera position
								that.currentCamera.position.set(
									animatedObject.position.x,
									animatedObject.position.y,
									animatedObject.position.z
								);

							},
							onUpdateParams: [this],
							onComplete: () => {

								console.log("onComplete du tween de position");

							}
						}, 
						this.currentPlace.position.startRef * (currentStep.global.duration / 100)
					);

				}


				// ROTATION
				if( this.currentPlace.rotation ){

					this.currentTarget

					const animatedObject = {};

					animatedObject.rotation = this.currentCamera.rotation;

					tl.to(
						animatedObject.rotation, 
						{
							duration: this.currentPlace.rotation.duration * (currentStep.global.duration / 100),
							x : this.currentPlace.rotation.x,
							y : this.currentPlace.rotation.y,
							z : this.currentPlace.rotation.z,
							ease: this.currentPlace.rotation.ease,

							onStart: () => {
								console.log("onStart du tween de rotation : isUsingTarget : ", currentStep.global.isUsingTarget);
							},
		
							onUpdate: (that) => {

								if( currentStep.global.isUsingTarget && this.currentTarget ){

									that.currentCamera.lookAt(this.currentTarget)

								} else {

									// and at update we update the real camera rotation
									that.currentCamera.rotation.set(
										animatedObject.rotation.x,
										animatedObject.rotation.y,
										animatedObject.rotation.z
									);

								}
		
		
							},
							onUpdateParams: [this],
							onComplete: () => {

								console.log("onComplete de rotation");

							}
						},
						this.currentPlace.rotation.startRef * (currentStep.global.duration / 100)
					);

				}


				// FOV : 
				if( this.currentPlace.fov && this.oldFov ){

					const animatedObject = {};

					// currentCamera.updateProjectionMatrix();

					animatedObject.fov = this.oldFov;

					tl.to(
						animatedObject, 
						{
							duration: this.currentPlace.fov.duration * (currentStep.global.duration / 100), 
							fov : this.currentPlace.fov.value,
							ease: this.currentPlace.fov.ease,
	
							onUpdate: (that, currentFov) => {

								// console.log("onUpdate : currentFov : ", currentFov);

								that.oldFov = currentFov;

								that.currentCamera.fov = currentFov;

								that.currentCamera.updateProjectionMatrix();
		
							},
							onUpdateParams: [this, animatedObject.fov]
						},
						this.currentPlace.fov.startRef * (currentStep.global.duration / 100)
					);

				}

				// if onComplete (on THE STEP, NOT THE PLACE winky winky)
				if( currentStep.onComplete ){

					const animatedObject = {};

					animatedObject.completeness = 0;

					tl.to(animatedObject, 0.1, {

						completeness: 1,

						onUpdate: () => {

							console.log("onUpdate du onComplete de currentStep (camera tween) - fade possible"); 

						},

						onComplete: (that) => {


							that.stepCompleteHandler(currentStep);

						},
						onCompleteParams: [this]
					})
				}

				return tl;

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

			stepCompleteHandler(step){

				const action = step.onComplete.action;

				console.log("stepCompleteHandler : action : ", action);

				switch ( action ){

					case "change-target":

						this.oldTarget = this.elementsAtInit.landscape;

						this.currentTarget = this.elementsAtInit[step.onComplete.targetString];

						// if( step.onComplete.options ){
							// TODO : prendre en compte les nouvelles step.onComplete.options.orbitlimits pour le orbit
						// }

						break

					default:
						console.log("switchCase triggered defaulttt");
						break
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
