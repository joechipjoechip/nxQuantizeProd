<template>
	<div>
		<canvas ref="canvasofvideo"></canvas>
		<canvas ref="canvasofthree"></canvas>
		<!-- <video ref="video" autoplay loop muted src="/videos/testWindowShot1.mp4"></video> -->
		<!-- <video ref="video" autoplay loop muted src="/videos/wave.mov"></video> -->
		<!-- <video ref="video" autoplay loop muted src="/videos/touchdesigner.mov"></video> -->
		<video 
			ref="video"
			muted autoplay playsinline loop preload
			src="/videos/testTravelling.mp4"
		></video>
		<button @click="onPlayClick">Play video</button>
	</div>
</template>

<script>

	import * as THREE from 'three';

	import * as dat from 'dat.gui';

	import { params } from "./../static/config/params.js";

	// import gsap from 'gsap';

	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

	export default {
		data(){
			return {
				config: params,
				elements: {},
				sizes: {
					width: 800,
					height: 600
				},
				animation: {
					run: true
				},
				helpers: {
					axes: false,
					orbitControls: true
				},
			};
		},
		watch: {

			"animation.run"( newVal ){

				if( newVal ){

					console.log("let s run");

					this.$refs.video.play();

					this.mainTick();

				} else {

					console.log("let s stop");

					this.$refs.video.pause();

				}
			}

		},
		mounted(){

			// this.initGlobalEvents();

			this.initCanvas();

			this.initThree();

			// Start animations
			this.mainTick();

		},
		methods: {

			onPlayClick(){

				this.$refs.video.play();

			},

			initGlobalEvents(){

				window.addEventListener("resize", (e) => {
					// update values
					sizes = {
						width: window.innerWidth,
						height: window.innerHeight
					};

					// update camera
					for(const camera of this.cameras){
						camera.aspect = sizes.width / sizes.height;
						camera.updateProjectionMatrix();
					}

					// update renderer
					renderer.setSize(sizes.width, sizes.height);

					// renderer.setPixelRatio(window.devicePixelRatio);
					// on limite le pixelratio à 2 pour garder de la perf
					renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

				});

				window.addEventListener("dblclick", (e) => {

					const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
					// webkit --> safari

					if( !fullscreenElement ){

						// go fullscreen

						if( this.$refs.canvas.requestFullscreen ){

							this.$refs.canvas.requestFullscreen();

						}
						else if( this.$refs.canvas.webkitRequestFullscreen ){

							this.$refs.canvas.webkitRequestFullscreen()

						}

					} 
					else {
						// leave fullscreen

						if( document.exitFullscreen ){

							document.exitFullscreen();

						}
						else if( document.webkitExitFullscreen ){

							document.webkitExitFullscreen();

						}

					}

				});


			},

			initCanvas(){
				
				// 1 - Canvas which receive Video
				this.$refs.canvasofvideo.width = this.sizes.width;
				this.$refs.canvasofvideo.height = this.sizes.height;

				this.ctxCanvasOfVideo = this.$refs.canvasofvideo.getContext("2d");

				// 1 - Global settings for this canvas
				this.ctxCanvasOfVideo.fillStyle = 'red';
				this.ctxCanvasOfVideo.globalCompositeOperation = 'lighter';

				this.canvasTexture = new THREE.CanvasTexture(this.canvasofvideo);
				this.canvasTexture.image = this.$refs.canvasofvideo;
				

				// 2 - Canvas which receive Three
				this.$refs.canvasofthree.width = this.sizes.width;
				this.$refs.canvasofthree.height = this.sizes.height;

			},

			initGui(){

				const gui = new dat.GUI({
					closed: false,
					width: 400
				});

				gui
					.add(this.animation, "run")
					.name("run animation");

				// SPOTLIGHTS
				Object.keys(this.config.lights).filter(key => key.indexOf("spotlight") !== -1 ).forEach((key, index) => {

					const guiString = `guiSpotlight${index}`;

					const guiSpot = gui.addFolder(guiString);

					guiSpot
						.add(this.elements[key], "intensity")
						.name("intensity")
						.min(0)
						.max(3)
						.step(0.1);

					guiSpot
						.add(this.elements[key], "angle")
						.name("angle")
						.min(-Math.PI)
						.max(Math.PI * 2)
						.step(0.1);

					guiSpot
						.add(this.elements[key], "penumbra")
						.name("penumbra")
						.min(0)
						.max(3)
						.step(0.01);

					guiSpot
						.add(this.elements[key], "decay")
						.name("decay")
						.min(0)
						.max(3)
						.step(0.01);

					guiSpot
						.add(this.elements[key], "distance")
						.name("distance")
						.min(-100)
						.max(100)
						.step(0.1);

					guiSpot
						.add(this.elements[key].position, "x")
						.name("x")
						.min(-10)
						.max(10)
						.step(0.1);
					guiSpot
						.add(this.elements[key].position, "y")
						.name("y")
						.min(-10)
						.max(10)
						.step(0.1);
					guiSpot
						.add(this.elements[key].position, "z")
						.name("z")
						.min(-10)
						.max(10)
						.step(0.1);

					guiSpot
						.addColor(this.config.lights.spotlight1, "color")
						.onChange(() => {
							this.elements[key].color.set(this.config.lights.spotlight1.color);
						});

				});

			},

			initThree(){

				// NOTE : mesh / lights / cameras are stored in this.elements
				// at the end of this initThree(), all items of this.elements are added to the scene

				const nbSubdivisions = 256;

				// SCENE
				this.scene = new THREE.Scene();

				// SANDPLANE
				const sandGeometry = new THREE.PlaneGeometry(10, 10, nbSubdivisions, nbSubdivisions);

				const sandMaterial = this.buildCustomMaterial();

				const sandDepthMaterial = this.buildCustomDepthMaterial();

				this.elements.sandPlane = new THREE.Mesh(sandGeometry, sandMaterial);

				this.elements.sandPlane.customDepthMaterial = sandDepthMaterial;

				this.elements.sandPlane.position.set(0,0,0);

				// this.elements.sandPlane.rotation.x = Math.PI / -2;

				// LIGHTS
				this.buildLights();

				// ENVIRONMENT MAP
				this.buildEnvMap();
				
				// CAMERA
				this.buildCamera();

				// FILL THE SCENE with elements :
				Object.keys(this.elements).forEach( key => {

					this.scene.add(this.elements[key]);

				});

				// HELPERS
				this.initThreeHelpers();

				// RENDER
				this.buildRenderer();

				// TICK Stuffs
				this.clock = new THREE.Clock();

				this.oldElapsedTime = 0;

				this.initGui();

			},

			initThreeHelpers(){

				// AXES HELPER
				if( this.helpers.axes ){

					const axesHelper = new THREE.AxesHelper(2);

					this.scene.add(axesHelper);

				}

				// ORBIT CONTROLS
				if( this.helpers.orbitControls ){

					this.orbitControls = new OrbitControls(this.elements.camera, this.$refs.canvasofthree);

					this.orbitControls.enableDamping = true;

				}

			},

			tickThree(){

				// console.log("three tick triggerd");

				const elapsedTime = this.clock.getElapsedTime();

				// const deltaTime = elapsedTime - this.oldElapsedTime;

				this.orbitControls.update();

				this.oldElapsedTime = elapsedTime;

				this.canvasTexture.needsUpdate = true;

				// NOW COMPUTE RENDER
				this.renderer.render(this.scene, this.elements.camera);

			},

			tickCanvas(){

				// console.log("canvas tick triggered");

				this.ctxCanvasOfVideo.clearRect(0,0, this.sizes.width, this.sizes.height);
				
				this.ctxCanvasOfVideo.drawImage(this.$refs.video, 0, 0, this.sizes.width, this.sizes.height);

				this.ctxCanvasOfVideo.ellipse(this.sizes.width/2, this.sizes.height/2, 90, 90, 45 * Math.PI/180, 0, 2 * Math.PI);

				this.ctxCanvasOfVideo.fill();

			},

			mainTick(){

				this.tickCanvas();

				this.tickThree();

				this.animation.run && window.requestAnimationFrame(this.mainTick);

			},

			updateAllMAterials(){
				// usefull to trigger in a gltf loader callback

				this.scene.traverse(child => {

					if( child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial ){

						// child.material.envMap = environmentMap;
						// useless now parcequ'on a utilisé un moyen plus simple plus bas : 
						// --> this.scene.environment = environmentMap;


						child.material.envMapIntensity = 5;

						child.material.needsUpdate = true;

						child.castShadow = true;
						child.receiveShadow = true;

					}

				});

			},

			buildRenderer(){

				this.renderer = new THREE.WebGLRenderer({
					canvas: this.$refs.canvasofthree
				});

				this.renderer.setSize(this.sizes.width, this.sizes.height);

				this.renderer.shadowMap.enabled = true;

				this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

			},

			buildCamera(){

				const aspectRatio = this.sizes.width / this.sizes.height;

				this.elements.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 800);

				this.elements.camera.position.set(0, 0, 8);

			},

			buildLights(){

				Object.keys(this.config.lights).filter(key => key.indexOf("spotlight") !== -1 ).forEach((key, index) => {

					const lightString = `spotlight${index}`;

					this.elements[lightString] = new THREE.SpotLight(
						this.config.lights[key].color, 
						this.config.lights[key].intensity, 
						this.config.lights[key].length, 
						this.config.lights[key].angle, 
						this.config.lights[key].penumbra, 
						this.config.lights[key].decay
					);

					this.elements[lightString].position.set(
						this.config.lights[key].position.x,
						this.config.lights[key].position.y,
						this.config.lights[key].position.z
					);

					// this.elements.directionalLightHelper = new THREE.SpotLightHelper(this.elements[lightString]);

				});

			},

			buildEnvMap(){

				const envMapPath = "/envMap/sky3";
				const cubeTextureLoader = new THREE.CubeTextureLoader();
				this.envMap = cubeTextureLoader.load([
					`${envMapPath}/px.png`,
					`${envMapPath}/nx.png`,
					`${envMapPath}/py.png`,
					`${envMapPath}/ny.png`,
					`${envMapPath}/pz.png`,
					`${envMapPath}/nz.png`
				]);

				this.envMap.encoding = THREE.sRGBEncoding;

				// mettre l'envMap en fond de la scene :
				this.scene.background = this.envMap;
				this.scene.environment = this.envMap;

			},

			buildCustomMaterial(){

				const textureLoader = new THREE.TextureLoader();

				const sandTextureColor 		= textureLoader.load("textures/Sand_007-2_COLOR.jpg");
				const sandTextureNormal 	= textureLoader.load("textures/Sand_007-2_NRM.jpg");
				const sandTextureOcclusion 	= textureLoader.load("textures/Sand_007-2_OCC.jpg");
				const sandTextureSpec 		= textureLoader.load("textures/Sand_007-2_SPEC.png");

				const customMaterial = new THREE.MeshPhongMaterial({
					map: sandTextureColor,
					normalMap: sandTextureNormal,
					aoMap: sandTextureOcclusion,
					aoMapIntensity: 1,
					specular: this.config.shaders.dig.specular,
					specularMap: sandTextureSpec,
					shininess: 50,
					envMapIntensity: 5,
					envMap: this.envMap,
					reflecticity: 1
				});

				// OK ! now let's fusion this standard/phong material with our custom shader :
				customMaterial.onBeforeCompile = shader => {

					shader.uniforms.uCanvasDigTexture = { value: this.canvasTexture };

					shader.uniforms.uDeepMax = { value: this.config.shaders.dig.deepmax };

					shader.uniforms.uTexture = { value: sandTextureColor };

					// VERTEX
					shader.vertexShader = shader.vertexShader.replace(
						"#include <common>", this.config.shaders.dig.vertex.common
					);

					shader.vertexShader = shader.vertexShader.replace(
						"#include <beginnormal_vertex>", this.config.shaders.dig.vertex.normal
					);

					shader.vertexShader = shader.vertexShader.replace(
						"#include <begin_vertex>", this.config.shaders.dig.vertex.beginVertex
					);

					// FRAGMENT
					shader.fragmentShader = shader.fragmentShader.replace(
						"#include <common>", this.config.shaders.dig.fragment.common
					);

					shader.fragmentShader = shader.fragmentShader.replace(
						"#include <color_fragment>", this.config.shaders.dig.fragment.color
					);
					
				};

				return customMaterial;

			},

			buildCustomDepthMaterial(){

				// DepthMaterial's aim is to get good core shadows

				const depthMaterial = new THREE.MeshDepthMaterial({
					depthPacking: THREE.RGBADepthPacking
				});

				// let's update the customDepthMaterial as well
				depthMaterial.onBeforeCompile = shader => {

					shader.uniforms.uCanvasDigTexture = { value: this.canvasTexture };

					shader.uniforms.uDeepMax = { value: this.config.shaders.dig.deepmax };

					shader.vertexShader = shader.vertexShader.replace(
						"#include <common>", this.config.shaders.dig.vertex.common
					);

					shader.vertexShader = shader.vertexShader.replace(
						"#include <begin_vertex>", 
						this.config.shaders.dig.vertex.normal
							.replace("<beginnormal_vertex>", "<begin_vertex>")
							.replace("objectNormal", "transformed")
					);

				};

				return depthMaterial;

			}

		}
	}
</script>

<style lang="scss" scoped>

	video {
		opacity: 0;
		width: 800px;
		height: 600px;
	}

	canvas {
		border: solid 1px red;
	}

</style>