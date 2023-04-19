<template>
	<div class="cinema-main_wrapper">

		<div class="debug-buttons-container">
			<button @click="playPauseAnimationHandler">start/stop animation</button>
			<button @click="switchScene">switch scene</button>
			<button @click="dropAndLoadAndSwitch">drop and load and switch</button>
			<button @click="changeSequenceHandler">next sequence</button>
		</div>

		<div 
			class="curtain"
			:class="{ 
				active: curtainActive,
				'first': this.sequenceID === '1.0'
			}"
		>
		</div>

		<joystick
			v-if="$store.state.isMobile"
			ref="joystick"
		/>

		<mouse-handler v-else
			:canvasSizeRef="canvasSizeRef"
		/>


		<instancethree 
			v-if="(allIsLoaded && viewPos)"
			ref="instancethree"
			:canvasSizeRef="canvasSizeRef"
			:sequenceID="sequenceID"
			:glbs="glbs"
			:bobs="bobs"
			:textures="textures"
			:viewPos="viewPos"
		/>

	</div>
</template>

<script>

	import { core } from '@/static/config/core.js';

	import Joystick from '@/components/joystick.vue';
	import MouseHandler from '@/components/mouseHandler.vue';
	import InstanceThree from "./instanceThree.vue";

	import { worlds } from '@/static/config/worlds.js';
	import { entities } from '@/static/config/entities.js';

	import { PrimaryLoadManager } from '@/components/primaryLoadManager.js';

	import sound from "@/static/assets/audio/onyi-base.mp3";

	
	export default {

		components: {
			"instancethree": InstanceThree,
			"joystick": Joystick,
			"mouse-handler": MouseHandler
		},

		data(){
			return {
				core,
				// cette valeur, à terme, sera une props envoyée par 
				// le component qui écoutera l'audio
				sequenceID: "1.0",
				mousePos: {
					x: window.innerWidth / 2,
					y: window.innerHeight / 2
				},
				viewPos: { x:0, y:0 },
				timeoutID: {},
				isRecentering: false,
				canvasSizeRef: { 
					width: window.innerWidth, 
					height: window.innerHeight
				},

				curtainActive: true,

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
			},

			"$store.state.downScale"(newVal){
				this.onResize();
			}

		},

		mounted(){

			this.initCommonValues();

			window.addEventListener("resize", this.onResize);
			window.addEventListener("blur", this.focusBlurHandler);
			window.addEventListener("focus", this.focusBlurHandler);

			this.$nuxt.$on("assets-have-been-loaded", this.handleAssetsLoaded);

			this.$nuxt.$on("view-update-by-stick", this.viewUpdateByStick);
			this.$nuxt.$on("bob-input-update-by-stick", this.updateBobInputsByStick);

			this.$nuxt.$on("switch-scene", this.switchScene);
			this.$nuxt.$on("switch-sequence", this.sequenceSwitcher);
			this.$nuxt.$on("drop-and-load-and-switch", this.dropAndLoadAndSwitch);

			this.$nuxt.$on("please-update-sequence-id", this.updateSequenceID);
			
			// launch all assets loads
			new PrimaryLoadManager(this);
			
			this.initSound();

		},
		
		beforeDestroy(){
			
			this.$nuxt.$off("assets-have-been-loaded", this.handleAssetsLoaded);

			this.$nuxt.$off("view-update-by-stick", this.viewUpdateByStick);
			this.$nuxt.$off("bob-input-update-by-stick", this.updateBobInputsByStick);

			this.$nuxt.$off("switch-sequence", this.sequenceSwitcher);
			this.$nuxt.$off("switch-scene", this.switchScene);
			this.$nuxt.$off("drop-and-load-and-switch", this.dropAndLoadAndSwitch);
			this.$nuxt.$off("please-update-sequence-id", this.updateSequenceID);

		},

		methods: {

			updateSequenceID( newSequenceID ){

				this.sequenceID = newSequenceID;

			},

			initSound(){
				const audio = new Audio(sound);
				this.$store.commit("setAudio", audio);


				// debug currenttime
				this.$store.commit("setAudioTimecode", 84);

			},

			initCommonValues(){

				this.mousePos = {
					x: (((this.canvasSizeRef.width / 2) / this.canvasSizeRef.width) - 1) * 2,
					y: (((this.canvasSizeRef.height / 2) / this.canvasSizeRef.height) - 1) * -2
				};

			},

			handleAssetsLoaded( assetsPack ){

				this[assetsPack.type] = assetsPack.assets;

			},

			checkIfAllIsLoaded(){

				if( 
					this.bobs.length		 === Object.keys(entities.bobs).length
					&& this.textures.length  === worlds.length
					&& this.glbs.length 	 === worlds.length
					&& this.$store.audio	 !== null
				){

					this.allIsLoaded = true;

				} else {
					console.log("nope, le allIsLoaded reste à false ");
				}

			},

			onResize(){

				this.canvasSizeRef.width = window.innerWidth / this.$store.state.downScale;
				this.canvasSizeRef.height = window.innerHeight / this.$store.state.downScale;

			},

			focusBlurHandler( event ){

				if( event.type === "focus" ){
					this.playPauseAnimationHandler(true);
				} else {
					this.playPauseAnimationHandler(false);
				}

			},

			playPauseAnimationHandler( fromFocus ){

				const currentTimelines = this.$refs.instancethree.sceneBundle.current.sequencesElements[this.sequenceID].timelines;
				const currentTimelinesKeys = Object.keys(currentTimelines);

				const goPlay = !this.$refs.instancethree.debug.animated;

				this.$refs.instancethree.debug.animated = !this.$refs.instancethree.debug.animated;

				if( goPlay && fromFocus ){

					this.$refs.instancethree.mainTick();

					this.$refs.instancethree.clock.start();
					this.$store.state.audio.play();

				} else {
					this.$refs.instancethree.clock.stop();

					this.$store.state.audio.pause();
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

			switchScene( sceneID ){

				// console.log("le switchScene de cinema est bien triggered", sceneID);

				this.curtainActive = true;

				setTimeout(() => {
					this.sequenceID = sceneID;
					this.$refs.instancethree.switchScene(sceneID);
				}, 800);

			},

			dropAndLoadAndSwitch(){
				// console.log("oui le dropandloadandswitch de cinema est bien triggered");

				this.curtainActive = true;


				setTimeout(() => {
					this.$refs.instancethree.dropAndLoadAndSwitch();
					// this.sequenceID = "2.2";
				}, 800);

			},

			sequenceSwitcher( newSequenceID ){
				console.log("new sequence asked : ", newSequenceID);

				this.sequenceID = newSequenceID;

			},

			changeSequenceHandler(){
				// très basique pour l'instant, mais c'est bien
				// ce mécanisme qui change la séquence en cours pour linstant
				// (plus tard ce sera calé sur le currentTime de l'audio)

				// console.log("change sequence triggered");

				this.curtainActive = true;

				setTimeout(() => {

					switch(this.sequenceID){
						case "1.0":
							this.sequenceID = "1.1"
							break
						case "1.1":
							this.sequenceID = "1.2"
							break
						case "1.2":
							this.sequenceID = "1.3"
							break
						case "1.3":
							this.sequenceID = "1.4"
							break
						default:
							this.sequenceID = "1.0"
							break
					}

				}, 800);

			},

			viewUpdateByStick( event ){

				this.viewPos = event;

			},

			updateBobInputsByStick( position ){

				const inputs = {
					shift: position.y > 0.9,
					forward: position.y > this.core.stick.inputThreshold,
					backward: position.y < this.core.stick.inputThreshold * -1,
					right: position.x > this.core.stick.inputThreshold,
					left: position.x < this.core.stick.inputThreshold * -1
				};

				this.$nuxt.$emit("bob-inputs-update", inputs);

			},

		}
	}
</script>

<style lang="scss" scoped>

body {
	padding: 0;
	margin: 0;
}

button {
	background-color: #b50000;
	background-color: beige;
}

.cinema-main_wrapper {
	position: relative;
}

.curtain {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: #000;
	transition: opacity .8s ease;
	will-change: opacity;
	opacity: 0;
	pointer-events: none;

	&.first {
		transition: opacity 5s ease;
	}

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
