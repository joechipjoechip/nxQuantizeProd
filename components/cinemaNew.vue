<template>
	<div class="cinema-main_wrapper">

		<div v-if="core.debug.buttons" class="debug-buttons-container">
			<button @click="playPauseAnimationHandler">start/stop animation</button>
			<button @click="dropAndLoadAndSwitch">dropAndLoadAndSwitch</button>
		</div>

		<div 
			class="curtain"
			:class="{ 
				active: curtainActive,
				'long': longCurtainSequences.includes(sequenceID),
				'verylong': isFinishScene && !finishIsOver,
				'verylongfinal': isFinishScene && finishIsOver
			}"
		></div>

		<joystick
			v-if="$store.state.isMobile"
			ref="joystick"
		/>

		<mouse-handler v-else
			:canvasSizeRef="canvasSizeRef"
		/>

		<instancethree 
			v-if="(allIsLoaded && viewPos && !$parent.isAtEntrance)"
			class="three-wrapper"
			ref="instancethree"
			:canvasSizeRef="canvasSizeRef"
			:sequenceID="sequenceID"
			:glbs="glbs"
			:bobs="bobs"
			:textures="textures"
			:viewPos="viewPos"
			:debugStats="core.debug.stats"
		/>

		<div v-if="displayFinalHub"
			class="final-hub--wrapper"
		>
			<div class="final-hub--inner" :class="{ 'active': displayFinalHubActive }">
				<main-hub />

				<div
					@click="restartExperience"
					class="restart-button"
				>
					Restart Experience
				</div>
			</div>

			
		</div>

	</div>
</template>

<script>

	import { core } from '@/static/config/core.js';

	import Joystick from '@/components/joystick.vue';
	import MouseHandler from '@/components/mouseHandler.vue';
	import InstanceThree from "@/components/instanceThree.vue";
	import MainHub from '@/components/mainHub.vue';

	import { worlds } from '@/static/config/worlds.js';
	import { entities } from '@/static/config/entities.js';

	import { PrimaryLoadManager } from '@/components/primaryLoadManager.js';

	
	export default {

		components: {
			"instancethree": InstanceThree,
			"joystick": Joystick,
			"mouse-handler": MouseHandler,
			"main-hub": MainHub
		},

		props: {
			canvasSizeRef: {
				type: Object,
				required: true
			}
		},

		data(){
			return {
				core,
				sequenceID: "1.0",
				mousePos: {
					x: window.innerWidth / 2,
					y: window.innerHeight / 2
				},
				viewPos: { x:0, y:0 },
				timeoutID: {},
				isRecentering: false,
				curtainActive: true,
				longCurtainSequences: ["1.0", "7.14", "7.17"],
				isFinishScene: false,
				displayFinalHub: false,
				displayFinalHubActive: false,
				finishIsOver: false,

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
			"$store.state.audioBase"(){
				this.checkIfAllIsLoaded();
			},
			"$store.state.audioEndOne"(){
				this.checkIfAllIsLoaded();
			},
			"$store.state.audioEndTwo"(){
				this.checkIfAllIsLoaded();
			},

			allIsLoaded( newVal ){
				if( newVal ){
					this.$nuxt.$emit("cinema-is-ready", true);
					console.log("all assets are loaded");
				}
			},

			isFinishScene( newVal ){
				if( newVal ){
					this.curtainActive = true
				}
			},

			"$parent.isAtEntrance"( newVal ){
				if( !newVal ){
					this.initSound()
				}
			}

		},

		mounted(){

			this.initCommonValues();

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

		},
		
		beforeDestroy(){

			window.removeEventListener("blur", this.focusBlurHandler);
			window.removeEventListener("focus", this.focusBlurHandler);
			
			this.$nuxt.$off("assets-have-been-loaded", this.handleAssetsLoaded);

			this.$nuxt.$off("view-update-by-stick", this.viewUpdateByStick);
			this.$nuxt.$off("bob-input-update-by-stick", this.updateBobInputsByStick);

			this.$nuxt.$off("switch-sequence", this.sequenceSwitcher);
			this.$nuxt.$off("switch-scene", this.switchScene);
			this.$nuxt.$off("drop-and-load-and-switch", this.dropAndLoadAndSwitch);
			this.$nuxt.$off("please-update-sequence-id", this.updateSequenceID);

		},

		methods: {
			restartExperience(){
				window.location.reload();
			},

			updateSequenceID( newSequenceID ){
				this.sequenceID = newSequenceID;
			},

			initSound(){
				this.$store.commit("setAudioCurrent", this.$store.state.audioBase);
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
					&& this.$store.state.audioBase	 !== null
					&& this.$store.state.audioEndOne	 !== null
					&& this.$store.state.audioEndTwo	 !== null
				){

					this.allIsLoaded = true;

				} else {
					this.$store.commit("incrementAssetsLoadCount");
					console.log("a new or pending asset have been downloaded");
				}

			},

			focusBlurHandler( event ){

				// TODO : uncomment for prod
				if( event.type === "focus" ){
					this.playPauseAnimationHandler(true);
				} else {
					this.playPauseAnimationHandler(false);
				}

			},

			playPauseAnimationHandler( fromFocus ){

				const currentTimelines = this.$refs.instancethree?.sceneBundle.current.sequencesElements[this.sequenceID].timelines;

				if( currentTimelines ){

					const currentTimelinesKeys = Object.keys(currentTimelines);
	
					const goPlay = !this.$refs.instancethree.debug.animated;
	
					this.$refs.instancethree.debug.animated = !this.$refs.instancethree.debug.animated;
	
					if( goPlay && fromFocus ){
	
						this.$refs.instancethree.mainTick();
	
						this.$refs.instancethree.clock.start();
						this.playAllAudios();
	
					} else {
						this.$refs.instancethree.clock.stop();
	
						this.pauseAllAudios();
					}
	
	
					if( currentTimelinesKeys.length ){
	
						currentTimelinesKeys.forEach(tlKey => {
	
							if( !currentTimelines[tlKey] ){ return; }
	
							currentTimelines[tlKey].isActive() ? 
								currentTimelines[tlKey].pause() 
								: currentTimelines[tlKey].play();
	
						});
	
					}

				}

			},

			playAllAudios(){

				if( !this.$store.state.endedAudios ){
					this.$store.state.audioCurrent.play();
				}
				
				if( (this.$store.state.audioCurrent === this.$store.state.audioEndOne || this.$store.state.audioCurrent === this.$store.state.audioEndTwo) && !this.$store.state.endedAudios ){
					this.$store.state.audioEndOne.play();
					this.$store.state.audioEndTwo.play();
				}
			},
			
			pauseAllAudios(){
				this.$store.state.audioCurrent.pause();
				if( this.$store.state.audioCurrent === this.$store.state.audioEndOne || this.$store.state.audioCurrent === this.$store.state.audioEndTwo ){
					this.$store.state.audioEndOne.pause();
					this.$store.state.audioEndTwo.pause();
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
				// console.log("new sequence asked : ", newSequenceID);

				this.sequenceID = newSequenceID;

			},

			viewUpdateByStick( event ){

				this.viewPos = event;

			},

			updateBobInputsByStick( position ){

				this.$nuxt.$emit("bob-inputs-update", {
					shift: position.y > 0.9,
					forward: position.y > this.core.stick.inputThreshold,
					backward: position.y < this.core.stick.inputThreshold * -1,
					right: position.x > this.core.stick.inputThreshold,
					left: position.x < this.core.stick.inputThreshold * -1
				});

			},

		}
	}
</script>

<style lang="scss" scoped>

button {
	background-color: beige;
}

.cinema-main_wrapper {
	background-color: #000;
}

.curtain {
	z-index: 12;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: #000;
	will-change: opacity;
	opacity: 0;
	pointer-events: none;
	
	transition: opacity 0.4s ease;
	
	&.long {
		transition: opacity 1s ease;
	}
	&.verylong {
		background-color: #FFF;
		transition: opacity 6s ease !important;
	}
	&.verylongfinal {
		transition: opacity 6s ease !important;
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

.three-wrapper {
	z-index: 10;
}

.final-hub {

	&--wrapper {
		z-index: 15;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		display: flex;
		justify-content: center;
		align-items: center;
	}

	&--inner {
		opacity: 0;
		pointer-events: none;
		margin-top: 30%;
		
		transition: all 5s;
		
		&.active {
			opacity: 1;
			margin-top: 0%;
			pointer-events: all;
		}

	}

}

.restart-button {
	font-family: 'Neue Haas Grotesk Text';
	margin: 0 auto;
	text-align: center;
    width: 16rem;
    margin-top: 1rem;
    padding: 0.75rem;
    border-radius: 0 0 12rem 12rem;
    background-color: rgba(255,255,255,0.05);

	cursor: pointer;
	transition: background-color .15s;

	animation: startAnimation 3s infinite;

	&:hover {
		background-color: rgba(255,255,255,0.15);
	}
}

@keyframes startAnimation {
	0%, 100% {
		// background-color: rgba(255,255,255,0.15);
		border: solid 1px rgba(255,255,255,0.05);
	}

	25% {
		// background-color: rgba(255,255,255,0.35);
		border: solid 1px rgba(255,255,255,0.65);
	}
}

</style>
