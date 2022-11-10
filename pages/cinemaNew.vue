<template>
	<div>

		<div class="debug-buttons-container">
			<button @click="changeSceneHandler">change scene</button>
			<button @click="playPauseAnimationHandler">start/stop animation</button>
			<button @click="changeSequenceHandler">next sequence</button>
		</div>

		<div 
			class="curtain"
			:class="{ active: curtainActive }"
		>
		</div>

		<instancethree 
			v-if="allIsLoaded"
			ref="instancethree"
			:sequenceID="sequenceID"
			:glbs="glbs"
			:bobs="bobs"
			:textures="textures"
		/>

	</div>
</template>

<script>

	import instanceThree from "./instanceThree.vue";

	import { worlds } from '@/static/config/worlds.js';
	import { entities } from '@/static/config/entities.js';

	import { PrimaryLoadManager } from '@/components/primaryLoadManager.js';

	
	export default {

		components: {
			"instancethree": instanceThree
		},

		data(){
			return {
				// cette valeur, à terme, sera une props envoyée par 
				// le component qui écoutera l'audio
				sequenceID: "1.0",
				mousePos: {
					x: window.innerWidth / 2,
					y: window.innerHeight / 2
				},
				curtainActive: false,

				allIsLoaded: false,
				glbs: [],
				textures: [],
				bobs: []
			}
		},

		watch: {
			glbs(){
				this.checkIfAllIsLoaded();
			},
			textures(){
				this.checkIfAllIsLoaded();
			},
			bobs(){
				this.checkIfAllIsLoaded();
			},

			allIsLoaded( newVal ){
				if( newVal ){
					console.log("all assets are loaded");
				}
			}
		},

		mounted(){

			window.addEventListener("resize", this.onResize);
			window.addEventListener("blur", this.focusBlurHandler);
			window.addEventListener("focus", this.focusBlurHandler);

			this.$nuxt.$on("assets-have-been-loaded", this.handleAssetsLoaded);

			new PrimaryLoadManager(this);

		},

		beforeDestroy(){

			this.$nuxt.$off("assets-have-been-loaded", this.handleAssetsLoaded);

		},

		methods: {

			handleAssetsLoaded( assetsPack ){

				this[assetsPack.type] = assetsPack.assets;

			},

			checkIfAllIsLoaded(){

				if( 
					this.bobs.length		 === Object.keys(entities.bobs).length
					&& this.textures.length  === worlds.length
					&& this.glbs.length 	 === worlds.length
				){

					this.allIsLoaded = true;

				} else {
					console.log("nope, le allIsLoaded reste à false ");
				}

			},

			onResize(){
				// à refaire puisque maintenant le canvas est ici

				// this.$children.forEach(child => {
				// 	child.updateCanvasRefSize();
				// });

			},

			focusBlurHandler( event ){

				if( event.type === "focus" ){
					this.playPauseAnimationHandler(true);
				} else {
					this.playPauseAnimationHandler(false);
				}

			},

			mouseMoveHandler( event ){
				
				this.mousePos = {
					x: (((event.offsetX + this.canvasSizeRef.width / 2) / this.canvasSizeRef.width) - 1) * 2,
					y: (((event.offsetY + this.canvasSizeRef.height / 2) / this.canvasSizeRef.height) - 1) * -2
				};

				// console.log("mousepos : ", this.mousePos.x)

			},

			playPauseAnimationHandler( fromFocus ){

				const currentTimelines = this.$refs.instancethree.sceneBundle.current.sequencesElements[this.sequenceID].timelines;
				const currentTimelinesKeys = Object.keys(currentTimelines);

				const goPlay = !this.$refs.instancethree.debug.animated;

				this.$refs.instancethree.debug.animated = !this.$refs.instancethree.debug.animated;

				if( goPlay && fromFocus ){

					this.$refs.instancethree.mainTick();

					this.$refs.instancethree.clock.start();

				} else {
					this.$refs.instancethree.clock.stop();
				}


				if( currentTimelinesKeys.length ){

					currentTimelinesKeys.forEach(tlKey => {

						if( !currentTimelines[tlKey] ){ return; }

						currentTimelines[tlKey].isActive() ? 
							currentTimelines[tlKey].pause() 
							: currentTimelines[tlKey].play();

					});

				}


			},

			changeSceneHandler(){

				this.$refs.instancethree.changeSceneHandler();

			},

			changeSequenceHandler(){
				// très basique pour l'instant, mais c'est bien
				// ce mécanisme qui change la séquence en cours pour linstant
				// (plus tard ce sera calé sur le currentTime de l'audio)

				console.log("change sequence triggered");

				this.curtainActive = true;

				switch(this.$refs.instancethree.sequenceID){
					case "1.0":
						this.$refs.instancethree.sequenceID = "1.1"
						break
					case "1.1":
						this.$refs.instancethree.sequenceID = "1.2"
						break
					case "1.2":
						this.$refs.instancethree.sequenceID = "1.3"
						break
					case "1.3":
						this.$refs.instancethree.sequenceID = "1.4"
						break
					default:
						this.$refs.instancethree.sequenceID = "1.0"
						break
				}

				// free memory and ressources
				// this.$refs.instancethree.scene1.sequencesElements[oldSequenceID] = null;

			}

		}
	}
</script>

<style lang="scss" scoped>

body {
  padding: 0;
  margin: 0;
}

button {
  background-color: beige;
}

.curtain {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  transition: opacity .3s ease;
  will-change: opacity;
  opacity: 0;
  pointer-events: none;

  &.active {
    opacity: 1;
  }
}

.debug-buttons-container {
  position: absolute;
  top: 0;
  left: 200px;
}
</style>
