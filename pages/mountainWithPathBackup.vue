<template>
	<div>
		<canvas class="webgl" ref="canvas"></canvas>
		<p>BAKED MOUNTAIN</p>
	</div>
</template>

<script>

	import * as THREE from 'three';

	import * as dat from 'dat.gui';

	import { TimelineMax } from 'gsap';

	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

	import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

	import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

	import { core } from '@/static/config/core.js';

	export default {

		data(){
			return{
				core,
				scene: null,
				orbit: null,
				currentTarget: null,
				oldTarget: null,
				animation: {
					run: true
				},
				config: {
					scene: {
						fog: core.env.mountainTwo.fog
					}
				},
				elementsAtInit: {
					lights: {
						directional: null
					},
					landscape: null,
					link: null
				},
				timelines: {},
				cameraMode: null,
				// une place est un point de vue caméra position/rotation/fov
				currentPlaces: core.env.mountainTwo.camera.paths.intro.places,
				currentPlace: null,
				oldPlace: null,
				cameraOldTarget: null,
				cameraCurrentTarget: null,
				cameraCurrentTransitionTarget: null
			}
		},

		computed: {

			currentCamera: function(){

				if( this.scene ) {

					return this.scene.children.find(child => child instanceof THREE.PerspectiveCamera);

				} 

				return false;

			}

		},

		watch: {

			"animation.run"( newVal ){

				if( newVal ){

					console.log("let s run");

					this.mainTick();

				} else {

					console.log("let s stop");

				}
			},

			cameraCurrentTarget( newTarget ){

				if( !newTarget ){
					return;
				}

				// const { duration, ease } = this.core.env.mountainTwo.camera.changeMode;

				const ease = "linear";
				const duration = 3;

				const transitionInfos = {
					position: newTarget.position, 
					global: { duration },
					startRef: 0,
					ease: ease
				};

				this.pointCameraTo(transitionInfos);

			},

		},
		mounted(){

			// this.animation = {
			// 	run: true
			// };

			this.gui = new dat.GUI({
				closed: false,
				width: 250
			});


			this.initThree();

			// à partir d'ici, tout doit être attrapé à partir de this.scene.children (instance of + name)

			this.initsAfterThree();

			this.initGui();

			this.mainTick();

		},

		methods: {

			initThree(){

				let sizes = {
					width: window.innerWidth,
					height: window.innerHeight
				};

				// BASE : 
				// Scene
				this.scene = new THREE.Scene();

				if( this.config.scene.fog.enabled ){

					this.scene.fog = new THREE.FogExp2(
							this.config.scene.fog.color, 
							this.config.scene.fog.intensity
					);

				}


				// LOADERS
				const textureLoader = new THREE.TextureLoader();

				// DRACO loader
				// si on a compressé le model à l'export dans blender, on aura besoin d'un DRACOLoader
				const dracoLoader = new DRACOLoader();
				dracoLoader.setDecoderPath("draco/");

				// ATTENTION : ne pas oublier d'aller copier les fichier .js qui se trouvent dans static/draco

				// GLTF loader
				const gltfLoader = new GLTFLoader();
				gltfLoader.setDRACOLoader(dracoLoader);

				// Textures
				const bakedTexture = textureLoader.load("/blender/lastMountainTwo.jpg");

				// obligé d'inversé
				bakedTexture.flipY = false;

				// on restandardise l'encodage
				// (ne pas oublier d'également le spécifier au renderer)
				bakedTexture.encoding = THREE.sRGBEncoding;


				

				// MATERIALS
				// baked materials
				const bakedMaterial = new THREE.MeshBasicMaterial({
					map: bakedTexture
				});

				// MODEL
				gltfLoader.load(
					"/blender/mountainTwoAndPath.glb",
					(gltf) => {

						// ne pas confondre la "scene" de THREE avec la "scene" d'un model importé
						// le scene d'un model est un group qui est un ensemble des éléments qui constituent le model

						// gltf.scene.traverse((child) => {
						// 	// .traverse() sur la scene d'un gltf permet de parcourir tous les children de manière récursive (child dans le child dans le child etc..)
						// 	child.material = bakedMaterial;
						// });

						// mais maintenant que tous les models sont fusionnés en une seul géometry :
						this.elementsAtInit.landscape = gltf.scene.children.find(child => child.name === "merged");

						this.initCameraPaths(gltf);

						// this.elementsAtInit.cameraPath = gltf.scene.children.find(child => child.name === "CameraPath1");

						this.elementsAtInit.landscape.material = bakedMaterial;

						this.scene.add(this.elementsAtInit.landscape);

						this.orbit.target = this.elementsAtInit.landscape.position;
						this.orbit.enabled = true;

					}
				);

				gltfLoader.load(
					"/blender/persos/link/linkOnMountain.glb",
					(gltf) => {

						// ne pas confondre la "scene" de THREE avec la "scene" d'un model importé
						// le scene d'un model est un group qui est un ensemble des éléments qui constituent le model
						this.elementsAtInit.link = {};

						this.elementsAtInit.link = gltf.scene.children.find(child => child.name === "linkMerged");

						// recup des materials des 3 sous childrens
						const recupMaterialInfos = [];

						this.elementsAtInit.link.children.forEach((child, index) => {

							recupMaterialInfos.push(child.material);

							child.material = new THREE.MeshToonMaterial();
							child.material = new THREE.MeshToonMaterial(recupMaterialInfos[index]);


						});

						// this.elementsAtInit.link.material = new THREE.MeshBasicMaterial({ color: 0xff0000 })

						console.log("hey link is : ", this.elementsAtInit.link);

						// important !!!
						gltf.scene.name = "linkGltfScene";
						this.scene.add(gltf.scene);

						// this.elementsAtInit.link.position.set(new THREE.Vector3(0,0, -3));
						// this.elementsAtInit.link.scale.set(300,300,300);
						
					}
				);

				// LIGHTS
				this.elementsAtInit.lights.directional = new THREE.DirectionalLight(0xffffff, 0.4);

				this.elementsAtInit.lights.directional.position.set(0,0, -4);

				this.scene.add(this.elementsAtInit.lights.directional);



				// Camera
				const aspectRatio = sizes.width / sizes.height;
				this.elementsAtInit.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.0001, 100);

				// init camera infos
				const cameraInitialInfos = this.core.env.mountainTwo.camera.paths.initial;

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

				// init this.oldFov
				this.oldFov = this.elementsAtInit.camera.fov;

				// then add it to the scene
				this.scene.add(this.elementsAtInit.camera);

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


				this.renderer.setSize(sizes.width, sizes.height);

				this.renderer.outputEncoding = THREE.sRGBEncoding;

				this.renderer.setClearColor("#000000");

				this.clock = new THREE.Clock();

				this.orbit = new OrbitControls(this.currentCamera, this.$refs.canvas);

				this.orbit.enableDamping = true;

				this.scopeElements();

			},

			scopeElements(){

				this.camera = this.scene.children.find(child => child instanceof THREE.PerspectiveCamera );

				this.camera.name = "camera";

			},

			initCameraPaths( gltf ){

				// D'abord on récupère les objets vides crés dans blender
				this.elementsAtInit.cameraPoints = gltf.scene.children.filter(child => child.name.indexOf("cameraPoint") !== -1);
				
				this.actualCameraTravelPoints = this.elementsAtInit.cameraPoints.map(object3d => {

					return new THREE.Vector3(
						object3d.position.x, 
						object3d.position.y, 
						object3d.position.z
					);

				});

				console.log("this.actualCameraTravelPoints : ", this.actualCameraTravelPoints);

				// Et Ensuite on construit tout ça :
				const parentPath = new THREE.Object3D();
				parentPath.name = "parentPath";


				const curve = new THREE.CatmullRomCurve3(this.actualCameraTravelPoints, false, "chordal");

				// ADD TUBE
				const tubeGeometry = new THREE.TubeGeometry( curve, 12, 1, 6);


				// ADD GEOMETRY
				const material = new THREE.MeshLambertMaterial( { 
					color: 0xff00ff, 
					side: THREE.DoubleSide,
					wireframe: true 
				});

				this.tube = new THREE.Mesh( tubeGeometry, material );

				this.tube.name = "tube";

				parentPath.add( this.tube );

				this.scene.add(parentPath);

			},

			buildTravellingTween(){

				const linkGroup = this.scene.children.find(child => child.name === "linkGltfScene");

				const link = linkGroup.children[0];

				console.log("link : ", link);

				// à décoréler des frames
				const tlToReturn = new TimelineMax();

				this.core.env.mountainTwoBetter.sequences.forEach(sequence => {

					const tlSequence = new TimelineMax();

					const globalDuration = sequence.global.duration;


					sequence.steps.forEach((step, index) => {

						
						const tlStep = new TimelineMax();

						const thisStepDuration = ((globalDuration / 100) * step.duration);

						const alreadyPlayedStep = sequence.steps.filter((onStep, indexSeq) => {

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
										
									const pos1 = this.tube.geometry.parameters.path.getPointAt(t);

									// Then update camera position
									this.camera.position.copy(pos1);

									// For the .lookAt
									if( step.target ){
										// on pointe vers la target

										this.cameraCurrentTarget = link;

									} else {
										// on pointe droit devant la cam (sur le path)

										this.cameraCurrentTarget = null;

										const t2 = (((time + 0.1) % looptime) / looptime);
	
										const pos2 = this.tube.geometry.parameters.path.getPointAt(t2);

										this.cameraForwardPosition = pos2;

									}


									// console.log(`
									// 	time : ${time}
									// 	t : ${t}
									// 	t2 : ${t2}
									// 	pos1 : 
									// 		x: ${pos1.x} 
									// 		y: ${pos1.y}
									// 		z: ${pos1.z}
									// 	pos2 : 
									// 		x: ${pos2.x} 
									// 		y: ${pos2.y}
									// 		z: ${pos2.z}
									// `);
	
								}

							}

						);
	
						tlSequence.add(tlStep);
	
					});

					tlToReturn.add(tlSequence);

				});

				tlToReturn.pause();

				return tlToReturn;




				// const linkGroup = this.scene.children.find(child => child.name === "linkGltfScene");

				// const linkPosition = linkGroup.children[0].position;





				// const looptime = 10; //velocity
				
				// const t = (time % looptime) / looptime;

				// const t2 = ((time + 0.1) % looptime) / looptime;
					
				// const pos1 = this.tube.geometry.parameters.path.getPointAt(t);     

				// const pos2 = this.tube.geometry.parameters.path.getPointAt(t2);
				
				// this.camera.position.copy(pos1);

				// // si on veut regarder droit devant la camera :
				// // this.camera.lookAt(pos2);

				// // mais si on veut lookAt une target :
				// this.camera.lookAt(linkPosition);


			},

			initsAfterThree(){

				// choses et d'autres

				this.currentTarget = this.core.env.mountainTwo.camera.paths.initialTarget;

				this.oldTarget = this.core.env.mountainTwo.camera.paths.initialTarget;

			},

			initGui(){

				// ANIMATION
				this.gui
					.add(this.animation, "run")
					.name("run animation");

				// FOG
				if( this.config.scene.fog.enabled ){

					this.gui
						.add(this.config.scene.fog, "intensity")
						.min(0)
						.max(2)
						.step(0.1)
						.name("scene fog")
						.onChange(() => {
	
							this.scene.fog = new THREE.FogExp2(
									this.config.scene.fog.color, 
									this.config.scene.fog.intensity
							);
	
					});

					this.gui
						.addColor(this.config.scene.fog, "color")
						.name("fog color")
						.onChange(() => {
	
							this.scene.fog = new THREE.FogExp2(
									this.config.scene.fog.color, 
									this.config.scene.fog.intensity
							);
	
					});
					
				}

				// ELEMENTS
				Object.keys(this.elementsAtInit).forEach(key => {

					const currentGuiFolder = this.gui.addFolder(key);

					this.core.main.guiConfig.elements[key] = {};

					// position / rotation


					Object.keys(this.core.main.guiConfig.actions).forEach(actionKey => {

						const currentGuiSubFolder = currentGuiFolder.addFolder(actionKey);

						this.core.main.guiConfig.elements[key][actionKey] = { x: 0, y: 0, z: 0 };

						Object.keys(this.core.main.guiConfig.elements[key][actionKey]).forEach(subKey => {

							currentGuiSubFolder
								.add(this.core.main.guiConfig.elements[key][actionKey], subKey)
								.name(`-> ${subKey}`)
								.min(this.core.main.guiConfig.actions[actionKey].min).max(this.core.main.guiConfig.actions[actionKey].max).step(this.core.main.guiConfig.actions[actionKey].step)
								.onChange(() => {
									console.log("onChange : ", this.elementsAtInit[key]);
									// this.elementsAtInit[key][actionKey].set(this.core.main.guiConfig.elements[key][actionKey]);
									this.elementsAtInit[key][actionKey][subKey] = this.core.main.guiConfig.elements[key][actionKey][subKey];
								});

						});

					});

				});



				// FUNCTIONS :

				// reveal infos camera :
				this.core.main.guiConfig.camera = {};

				// position
				this.core.main.guiConfig.camera.revealPosition = () => {

					const realCamera = this.scene.children.find(child => child instanceof THREE.PerspectiveCamera );

					console.log(realCamera);

				};
				this.gui.add(this.core.main.guiConfig.camera, "revealPosition").name("revealPosition()");

				// fov
				this.core.main.guiConfig.camera.revealFov = () => {

					const realCamera = this.scene.children.find(child => child instanceof THREE.PerspectiveCamera );

					console.log(realCamera.fov);

				};
				this.gui.add(this.core.main.guiConfig.camera, "revealFov").name("revealFov()");


				// play intro
				this.core.main.guiConfig.playIntro = () => {

					// this.cameraMode = "stepAnimated";

					// this.timelines.camera = this.handleCameraPositionSteps(this.core.env.mountainTwo.camera.paths.intro.steps);

					// this.timelines.camera.play();

					this.cameraForwardPosition = null;

					// this.cameraCurrentTarget = this.elementsAtInit.landscape;

					this.timelines.camera = this.buildTravellingTween();

					this.timelines.camera.eventCallback("onComplete", () => {

						console.log("ok le onComplete de la mega timeline");

						this.cameraForwardPosition = null;

					});

					this.timelines.camera.play();

				};
				this.gui.add(this.core.main.guiConfig, "playIntro").name("playIntro()");


				// enable/disable orbit :
				this.core.main.guiConfig.orbitEnabler = () => {

					this.orbit.enabled = !this.orbit.enabled;

				};
				this.gui.add(this.core.main.guiConfig, "orbitEnabler").name("orbitEnabler()");

			},

			handleCameraPositionSteps( steps ){
				// handleCameraPositionSteps works with tweens
				// donc c'est indépendant des logiques raf / tick()

				const moveTl = new TimelineMax();

				this.currentStepToBuild = 0;

				for(let i = 0; i <= steps.length - 1; i++){

					moveTl.add(this.buildCameraTweens(steps[i], this.core.env.mountainTwo.camera));

				}

				console.log("la moveTl entière : ", moveTl);

				moveTl.pause();

				return moveTl;

			},

			buildCameraTweens( currentStep, cameraMain ){

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

								console.log("wsh le onComplete de position");

							}
						}, 
						this.currentPlace.position.startRef * (currentStep.global.duration / 100)
					);

				}


				// ROTATION
				if( this.currentPlace.rotation){

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
		
							onUpdate: (that, cameraMain) => {

								if( cameraMain.status.isUsingTarget && this.currentTarget ){

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
							onUpdateParams: [this, cameraMain],
							onComplete: () => {

								console.log("wsh le onComplete de rotation");

							}
						},
						this.currentPlace.rotation.startRef * (currentStep.global.duration / 100)
					);

				}


				// FOV : 
				if( this.currentPlace.fov && this.oldFov ){

					console.log("dabord, y a quoi dans this.oldFov ? : ", this.oldFov);

					const animatedObject = {};

					// currentCamera.updateProjectionMatrix();

					animatedObject.fov = this.oldFov;

					console.log("oldPlace fov (animated base) : ", animatedObject.fov);

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

							console.log("onUpdate du furur currentStep.onComplete"); 

						},

						onComplete: (that) => {


							that.stepCompleteHandler(currentStep);

						},
						onCompleteParams: [this]
					})
				}

				return tl;

			},

			pointCameraTo( transitionInfos ){

				// triggered when this.currentTarget is changed (watch)

				this.isRotatingToNewTarget = true;

				this.orbit.enabled = false;

				if( transitionInfos.position instanceof THREE.Vector3 ){

					const animatedObject = {
						x: this.cameraForwardPosition.x,
						y: this.cameraForwardPosition.y,
						z: this.cameraForwardPosition.z
					};

					const tl = new TimelineMax();

					tl.to(
						animatedObject, 
						0.5, 
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

								// that.currentCamera.lookAt(transitionVectorToLookAt);
								that.cameraCurrentTransitionTarget = transitionVectorToLookAt;

							},
							onUpdateParams: [this],

							onComplete: (that) => {

								console.log("trigger du complete du pointCameraTo");

								that.isRotatingToNewTarget = false;

								that.cameraCurrentTransitionTarget = null;

								// that.orbit.enabled = true;

							},
							onCompleteParams: [this]

							// onComplete: (that) => {

							// 	const finalVectorToLookAt = new THREE.Vector3(
							// 		transitionInfos.position.x,
							// 		transitionInfos.position.y,
							// 		transitionInfos.position.z
							// 	);


							// 	that.orbit.target = that.currentTarget.position;

							// 	that.currentCamera.lookAt(finalVectorToLookAt);

							// 	that.orbit.enabled = true;

							// 	that.oldTarget = that.currentTarget;

							// 	console.log("ici cest quoi les bails : ", transitionInfos);


							// },
							// onCompleteParams: [this]

						});

				}

			},

			stepCompleteHandler(step){

				const action = step.onComplete.action;

				console.log("du stepCompleteHandler : action : ", action);

				switch ( action ){

					case "change-target":

						this.oldTarget = this.elementsAtInit.landscape;

						this.currentTarget = this.elementsAtInit[step.onComplete.targetString];

						// if( step.onComplete.options ){
							// TODO : prendre en compte les nouvelles step.onComplete.options.orbitlimits pour le orbit
						// }

						break

					default:
						console.log("defaulttt")
						break
				}

			},

			tickThree(){

				// console.log("three tick triggerd");

				const elapsedTime = this.clock.getElapsedTime();

				// const deltaTime = elapsedTime - this.oldElapsedTime;
				if( this.orbit.enabled ){

					this.orbit.update();

				}

				if( this.cameraForwardPosition && !this.isRotatingToNewTarget ){

					console.log("au render, on passe dans forwad")

					this.currentCamera.lookAt(this.cameraForwardPosition);

				} else if( this.cameraCurrentTransitionTarget ){

					console.log("au render, on passe dans current transition : ", this.cameraCurrentTransitionTarget);
					
					this.currentCamera.lookAt(this.cameraCurrentTransitionTarget);

				} else if( this.cameraCurrentTarget ){

					console.log("au render, on passe dans current : ", this.cameraCurrentTarget);

					this.currentCamera.lookAt(this.cameraCurrentTarget);

				}

				this.oldElapsedTime = elapsedTime;

				// NOW COMPUTE RENDER
				this.renderer.render(this.scene, this.currentCamera);

			},

			mainTick(){

				this.tickThree();

				this.animation.run && window.requestAnimationFrame(this.mainTick);

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
		color: white;
		z-index: 5;
	}

</style>
