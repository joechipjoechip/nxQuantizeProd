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
				oldPlace: null
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

			// currentTarget( newTarget ){

			// 	const { duration, ease } = this.core.env.mountainTwo.camera.changeMode;

			// 	const transitionInfos = {
			// 		position: newTarget.position, 
			// 		global: { duration },
			// 		startRef: 0,
			// 		ease: ease
			// 	};

			// 	this.pointCameraTo(transitionInfos);

			// },

		},
		mounted(){

			this.animation = {
				run: true
			};

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

					// this.scene.fog = new THREE.FogExp2(
					// 		this.config.scene.fog.color, 
					// 		this.config.scene.fog.intensity
					// );

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
					"/blender/sceneTestingKeyframes-sansContraintes.glb",
					(gltf) => {

						// ne pas confondre la "scene" de THREE avec la "scene" d'un model importé
						// le scene d'un model est un group qui est un ensemble des éléments qui constituent le model

						// gltf.scene.traverse((child) => {
						// 	// .traverse() sur la scene d'un gltf permet de parcourir tous les children de manière récursive (child dans le child dans le child etc..)
						// 	child.material = bakedMaterial;
						// });

						// mais maintenant que tous les models sont fusionnés en une seul géometry :

						gltf.scene.traverse((object) => {

							if (object.isCamera) {
								this.blenderCamera = object;
							}

							// console.log("object.name : ", object.name);

							if( object.name === "Cube003" ){
								this.plane = object;
							}

						});

						console.log("this.blenderCamera", this.blenderCamera);
						// on aura juste à switcher de camera, si on veut plusieurs points de vues sur 
						// meme scene / meme animation

						// this.blenderCamera.position.y += 0.5;


						console.log("this.plane", this.plane);

						// this.scene.add(this.elementsAtInit.landscape);
						this.scene.add(gltf.scene);







						// on créé le mixer (général, qui va TOUT animer, même la/les cameras)
						this.animationMixer = new THREE.AnimationMixer(gltf.scene);


						// on créé les clips
						// -> clips elements
						gltf.animations.forEach(anim => {

							const action = this.animationMixer.clipAction(anim);

							action.play();

						});

						//  + l'update du mixer dans le render, et ca y est, tout bouge ;)

					}
				);

				// LIGHTS
				this.elementsAtInit.lights.directional = new THREE.DirectionalLight(0x0000ff, 0.7);
				this.elementsAtInit.lights.directional2 = new THREE.DirectionalLight(0xff0000, 0.7);

				this.elementsAtInit.lights.directional.position.set(0,1, -4);
				this.elementsAtInit.lights.directional2.position.set(0,1, 4);

				this.scene.add(this.elementsAtInit.lights.directional);
				this.scene.add(this.elementsAtInit.lights.directional2);



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

			},

			initBlenderCurvesAndTubes( gltf ){


				// D'abord on récupère les objets vides crés dans blender
				this.elementsAtInit.curvePoints = gltf.scene.children.filter(child => child.name.indexOf("cameraPoint") !== -1);
				
				this.smoothedCurvePoints = this.elementsAtInit.curvePoints.map(object3d => {

					return new THREE.Vector3(
						object3d.position.x, 
						object3d.position.y, 
						object3d.position.z
					);

				});

				// Et Ensuite on construit tout ça :
				const parentPath = new THREE.Object3D();

				parentPath.name = "parentPath";

				const curve = new THREE.CatmullRomCurve3(this.smoothedCurvePoints, false, "chordal");

				// ADD TUBE
				const tubeGeometry = new THREE.TubeGeometry( curve, 64, 0.06, 8);


				// ADD GEOMETRY
				const material = new THREE.MeshLambertMaterial( { 
					color: 0xff00ff, 
					side: THREE.DoubleSide,
					wireframe: true,
					visible: this.core.env.mountainTwoBetter.sequences[0].debug?.seeTube ? true : false
				});

				this.tube = new THREE.Mesh( tubeGeometry, material );

				this.tube.name = "tube";

				parentPath.add( this.tube );

				this.scene.add(parentPath);

				this.cameraShouldTravel = true;

			},

			buildTubeTravellingTween(){

				const linkGroup = this.scene.children.find(child => child.name === "linkGltfScene");

				const link = linkGroup.children[0];

				// à décoréler des frames
				const tlToReturn = new TimelineMax();

				this.core.env.mountainTwoBetter.sequences.forEach(sequence => {

					const tlSequence = new TimelineMax();

					const globalDuration = sequence.global.duration;


					sequence.curveSteps.forEach((step, index) => {

						
						const tlStep = new TimelineMax();

						const thisStepDuration = ((globalDuration / 100) * step.duration);

						const alreadyPlayedStep = sequence.curveSteps.filter((onStep, indexSeq) => {

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

									console.log("time : ", time);
										
									const pos1 = this.tube.geometry.parameters.path.getPointAt(t);     

									const pos2 = this.tube.geometry.parameters.path.getPointAt(t2);
									
									this.currentCamera.position.copy(pos1);

									if( sequence.cameraType === "target" ){

										this.tubeTravelTargetPosition = link.position;

									} else {
										
										this.tubeTravelTargetPosition = pos2;

									}

									
	
								},

								onComplete: () => {

									console.log("this specific step is done : ", index);

									// this.tubeTravelTargetPosition = false;

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
				
				// this.currentCamera.position.copy(pos1);

				// // si on veut regarder droit devant la camera :
				// // this.currentCamera.lookAt(pos2);

				// // mais si on veut lookAt une target :
				// this.currentCamera.lookAt(linkPosition);


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
	
							// this.scene.fog = new THREE.FogExp2(
							// 		this.config.scene.fog.color, 
							// 		this.config.scene.fog.intensity
							// );
	
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

					this.timelines.camera = this.buildTubeTravellingTween();

					// en gros : ça c'est le lancement de séquence :
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

								console.log("ici cest quoi les bails : ", transitionInfos);


							},
							onCompleteParams: [this]

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

				const deltaTime = elapsedTime - this.oldElapsedTime;
				// if( this.orbit.enabled ){

				// 	this.orbit.update();

				// }

				if( this.tubeTravelTargetPosition ){
					console.log("au rednder ca lookat");

					// this.currentCamera.lookAt(this.tubeTravelTargetPosition);

				}


				if( this.animationMixer ){

					// this.blenderCamera.animationMixer.update(deltaTime);

					this.animationMixer.update(deltaTime);

				}

				// if( this.cameraShouldTravel ){

				// 	this.buildTubeTravellingTween(elapsedTime);

				// }

				this.oldElapsedTime = elapsedTime;

				// NOW COMPUTE RENDER

				if( this.blenderCamera ){

					this.blenderCamera.lookAt(this.plane.position);


					this.blenderCamera.fov = 75;
					this.blenderCamera.updateProjectionMatrix();

					this.blenderCamera.position.y + 5;

					
					this.renderer.render(this.scene, this.blenderCamera);

				} else {
					
					this.renderer.render(this.scene, this.currentCamera);
					
				}

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
