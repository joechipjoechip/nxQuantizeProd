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
				scene: new THREE.Scene(),
				dracoLoader: new DRACOLoader(),
				glbLoader: new GLTFLoader(),
				textureLoader: new THREE.TextureLoader(),
				worldConfig: worlds.find( world => world.sequences.find( seq => seq.id === this.sequenceID)),
				sceneElements: {
					landscape: null,
					sky: null,
					bob: null,
					lights: [],
					baked: {
						texture: null,
						material: null
					}
				}
			}
		},

		mounted(){

			// DRACO loader
			// si on a compressé le model à l'export dans blender (donc un .glb), 
			// on aura besoin d'un DRACOLoader
			this.dracoLoader.setDecoderPath("draco/");
			this.glbLoader.setDRACOLoader(dracoLoader);


		},

		methods: {

			loadsManager(){


				this.loadTexture();
				this.loadGlb();

			},

			loadGlb(){

				this.loadBaked()

				this.glbLoader.load(
					this.worldConfig.main.meshInfos.glbPath, 
					glbFile => { this.glbParser(glbFile) }
				);
			},

			glbParser(glbFile){

				glbFile.scene.traverse(child => {
	
					// find map
					if( child.name === this.worldConfig.main.meshInfos.mapName ){

						this.sceneElements.landscape = child;

						this.sceneElements.landscapeShadow = child.clone();

					}

					// find lights
					if( child.name.indexOf("light-") !== -1 ){

						this.sceneElements.lights.push(child);

					}

					// find character's position
					if( child.name.indexOf(`bob-position`) ){

						this.sceneElements.bob = child;

					}

				})

			},

			loadTexture(){


				this.sceneElements.baked.texture = this.textureLoader.load(this.worldConfig.main.meshInfos.bakedTexturePath);
	
				this.sceneElements.baked.texture.flipY = false;

				this.sceneElements.baked.texture.encoding = THREE.sRGBEncoding;

				this.sceneElements.baked.material = new THREE.MeshBasicMaterial({
					map: this.sceneElements.baked.texture
				});


				// j'en suis al
				// mainMapMerged.material = this.bakedMaterial;


		

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
  width: 350px;
  height: 400px;
  background-color: rgba(0,0,200, .3);
}
</style>
