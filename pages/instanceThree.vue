<template>
	<div>
		<div class="debug-space">
			<!-- <p v-if="currentCamera">current camera name : {{ currentCamera.name }}</p> -->
			<pre>
				<p v-if="sequenceID">current sequence : {{ sequenceID }}</p>
			</pre>
		</div>
		<canvas 
			class="webgl" 
			ref="canvas"
		/>
			<!-- @mousemove="mouseMoveHandler" -->
	</div>
</template>

<script>

	import { core } from '@/static/config/core.js';
	import { worlds } from '@/static/config/worlds.js';

	// GSAP
	import { TimelineMax } from 'gsap';

	// THREE
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
	import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

	export default {

		props: {
			sequenceID: {
				type: String,
				required: true
			}
		},

		data(){
			return {
				// Config from worlds.js
				worldConfig: worlds.find( world => world.sequences.find( seq => seq.id === this.sequenceID) ),

				// Loaders
				dracoLoader: new DRACOLoader(),
				glbLoader: new GLTFLoader(),
				textureLoader: new THREE.TextureLoader(),

				// Three elements
				frameRate: 1/30,
				deltaTime: 0,
				aspectRatio: window.innerWidth / window.innerHeight,
				camera: null,
				scene: new THREE.Scene(),
				sceneElements: {
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
				},
				renderer: null,
				clock: null,
				glbLoaded: false,
				texturesCreated: false,

				// Helpers
				orbit: null,

				// Others
				canvasSizeRef: { 
					width: window.innerWidth, 
					height: window.innerHeight
				},
				debug: {
					animated: true
				}
			}
		},

		computed: {

			assetsLoaded(){
				return this.glbLoaded && this.texturesCreated
			}

		},

		watch: {

			assetsLoaded( newVal ){

				if( newVal ){
					this.onceAssetsAreLoaded();
				}

			}

		},

		mounted(){

			// DRACO loader
			// to load compressed glTF (so glB files) we need a DracoLoader
			this.dracoLoader.setDecoderPath("draco/");
			this.glbLoader.setDRACOLoader(this.dracoLoader);

			this.camera = new THREE.PerspectiveCamera(75, this.aspectRatio, 0.1, 100);

			this.loadsManager();

		},

		methods: {

			onceAssetsAreLoaded(){

				this.applyBakedOnMeshes();

				this.composeScene();

				this.addHelpers();

				this.refreshScene();

				this.initRenderer();

				this.mainTick();

			},

			loadsManager(){

				this.loadGlb();

				this.loadTextures();

			},

			loadTextures(){

				Object.keys(this.worldConfig.main.meshInfos.world.imagePath).forEach(key => {

					this.sceneElements.misc[key].texture = this.textureLoader.load(this.worldConfig.main.meshInfos.world.imagePath[key]);

					this.createBakedMaterial(key);

				});

				this.texturesCreated = true;

			},

			createBakedMaterial( key ){

				this.sceneElements.misc[key].texture.flipY = false;
	
				this.sceneElements.misc[key].texture.encoding = THREE.sRGBEncoding;

				this.sceneElements.misc[key].material = new THREE.MeshBasicMaterial({
					map: this.sceneElements.misc[key].texture
				});

			},

			applyBakedOnMeshes(){

				Object.keys(this.worldConfig.main.meshInfos.world.imagePath).forEach(key => {

					this.sceneElements[key].material = this.sceneElements.misc[key].material;

				});

			},

			loadGlb(){

				Object.keys(this.worldConfig.main.meshInfos).forEach(key => {

					// load GLB files
					this.glbLoader.load(
						this.worldConfig.main.meshInfos[key].glbPath, 
						glbFile => { this.glbParser(glbFile) }
					);

				});

			},

			glbParser(glbFile){

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

				this.glbLoaded = true;

			},

			composeScene(){

				// Here we add landcape / sky? / bob?
				Object.keys(this.worldConfig.main.meshInfos.world.imagePath).forEach(key => {

					this.scene.add(this.sceneElements[key]);

				});

				this.camera.position = this.sceneElements.initialCamera.position;
				this.camera.rotation = this.sceneElements.initialCamera.rotation;

				this.scene.add(this.camera);

			},

			addHelpers(){

				this.orbit = new OrbitControls(this.camera, this.$refs.canvas);

				this.orbit.target = this.sceneElements.landscape.position;

				this.orbit.enabled = true;

				this.orbit.enableDamping = true;

			},

			refreshScene(){

				this.camera.updateProjectionMatrix();

			},

			initRenderer(){

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

			// RENDER
			tickThree(){

				

			},

			mainTick(){

				if( !this.debug.animated ) return;

				window.requestAnimationFrame(this.mainTick);

				this.deltaTime += this.clock.getDelta()



				// a lot of stuffs to animate here
				if( this.orbit ){
					this.orbit.update();
				}

				// etc..
				
				
				// NOW CHECK IF FRAMERATE IS GOOD
				if( this.deltaTime > this.frameRate ){

					// NOW COMPUTE RENDER
					this.renderer.render(this.scene, this.camera);

					this.deltaTime = this.deltaTime % this.frameRate;

				}
			}

		}

	}

</script>

<style lang="scss" scoped>

canvas {
  z-index: 3;
  // position: fixed;
  // top: 0;
  // left: 0;
  outline: none;
  pointer-events: all;
}

p {
  z-index: 5;
  color: black;
}

.debug-space {
  position: absolute;
  top: 25px;
  left: 5px;
  background-color: rgba(0,0,200, .5);
  pointer-events: none;

  * {
    padding: 0 15px;
    color: white;
  }
}
</style>
