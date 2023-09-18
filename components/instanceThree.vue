<template>
	<div>
		<div class="debug-space">
			<!-- <pre>
				<p v-if="sequenceID">current sequence : {{ sequenceID }}</p>
				<p v-if="viewPos">viewPos : {{ viewPos }}</p>
			</pre> -->
			<div ref="currentFPS" class="stats">{{ currentFPSValue }}</div>
			<div ref="downScale" class="stats">{{ $store.state.downScale }}</div>
			<div v-if="sequenceID" class="stats">{{ sequenceID }}</div>
			<div v-if="$store.state.audioCurrent" class="stats">{{ $store.state.audioCurrent.currentTime }}</div>
			<div v-if="currentSequence" class="stats">next step : {{ currentSequence.until }}</div>
			<div v-if="currentSequence" class="stats">bad cpu : {{ $store.state.badComputer }}</div>
		</div>

		<canvas 
			class="webgl" 
			ref="canvas"
		/>

	</div>
</template>

<script>
	
	import { worlds } from '@/static/config/worlds.js';
	import { SceneBuilder } from '@/components/sceneBuilder.js';
	import { SequencesManager } from '@/components/sequencesManager.js';

	import { disposeScene } from '@/components/sceneDisposer.js'

	// THREE
	import * as THREE from 'three';

	export default {

		props: {

			sequenceID: {
				type: String,
				required: true
			},

			canvasSizeRef: {
				type: Object,
				required: true
			},

			glbs: {
				type: Array,
				required: true
			},

			textures: {
				type: Array,
				required: true
			},

			bobs: {
				type: Array,
				required: true
			},

			viewPos: {
				type: Object,
				required: true
			}

		},

		data(){

			return {
				// Config from worlds.js
				worlds,

				// Animation
				frameRate: 1/60,
				deltaTime: 0,

				startTime: performance.now(),
				currentFPSValue: 0,
				frames: 0,

				// Others
				lastKnownSequenceID: "1.0",
				loopIsAsked: false,
				loopClock: null,
				choiceIsDisplayed: false,
				choiceHaveBeenMade: false,
				endingIsStarted: false,
				endingSelected: "",

				endFlyPrayTimer: 16.5,
				endChoiceTimer: 43.43,
				finishTimeCode: 0,

				nextWorldIndex: 0,
				initialLoadDone: false,

				debug: {
					animated: true,
					stats: true,
					end: true,
					finish: true
				},

				currentBobName: null,

				skeleton: {
					current: null,
					primary: null,
					secondary: null
				},
				
				sceneBundle: {
					current: null,
					primary: null,
					secondary: null
				},

				sequencesManager: {
					current: null,
					primary: null,
					secondary: null
				},

			}

		},

		computed: {
			worldConfig(){
				return this.worlds.find( world => world.sequences.find( seq => seq.id === this.sequenceID ) )
			},
			currentSequence(){
				if( this.$store.state.currentChoice === "Two" && parseInt(this.sequenceID.split(".")[1]) >= 17 ){
					return this.worlds.find(world => world.name.includes("end02")).sequences.find(seq => seq.id === this.sequenceID)
				} else {
					return this.worldConfig.sequences.find(seq => seq.id === this.sequenceID)
				}
			}
		},

		watch: {

			"skeleton.current"(newVal){

				this.sceneBundle.current = this.sceneBundle[newVal.type];
				
				this.sequencesManager.current = this.sequencesManager[newVal.type];
				
				newVal.refreshBobs(this.bobs, this.sceneBundle.current.scene);

				this.sequencesManager.current.sequenceChangeHandler(this.sequenceID);

				newVal.recomputeCameraAspectRatio(this.canvasSizeRef);

			},

			"sceneBundle.primary.name"(){
				if( !this.initialLoadDone ){
					this.checkIfAllScenesAreReady();
				}
			},
			"sceneBundle.secondary.name"(){
				if( !this.initialLoadDone ){
					this.checkIfAllScenesAreReady();
				}
			},

			sequenceID(newVal, oldVal){
				this.sequencesManager.current.sequenceChangeHandler(newVal, oldVal);
			},

			"$store.state.downScale"(newVal){

				console.log("downscale watcher triggered : ", newVal);

				const newWidth = window.innerWidth / this.$store.state.downScale;
				const newHeight = window.innerHeight / this.$store.state.downScale;

				if( this.sequencesManager.current.composer ){
					this.sequencesManager.current.composer.setSize(newWidth, newHeight);
				} else {
					this.renderer.setSize(newWidth, newHeight);
				}

				this.skeleton.current.recomputeCameraAspectRatio(this.canvasSizeRef);

				// and update parent value for mousePositions consistency
				this.$parent.canvasSizeRef.width = newWidth;
				this.$parent.canvasSizeRef.height = newHeight;

			},

			initialLoadDone( newVal ){
				if( newVal ){

					this.$store.state.audioBase.addEventListener("ended", this.handleAudioEnded);

					this.$store.state.audioCurrent.play();

				}
			},

			loopIsAsked( newVal ){
				if( newVal ){
					this.loopClock = new THREE.Clock()
				}
			},

			endingIsStarted( newVal ){
				if( newVal && this.$store.state.badComputer ){
					this.setDownScale(2.5);
				}
			},

			"$store.state.currentChoice"( newVal ){
				if( newVal === "One"){
					this.finishTimeCode = 85;
				} else {
					this.finishTimeCode = 104.5;
				}
			}

		},

		mounted(){

			this.$nuxt.$on("please-stop-loop", this.stopLoop);
			
			this.createBundle(0, "primary");
			this.createBundle(1, "secondary");
			
		},
		
		beforeDestroy(){
			this.$nuxt.$off("please-stop-loop", this.stopLoop);
		},

		methods: {
			adjustMisc(){

				if( this.$store.state.badComputer ){
					// this.frameRate = 1/30;
					// this.arbitraryFpsIdeal = 30;
					this.setDownScale(2);
				}

			},

			async createBundle(worldIndex, slotKey){

				this.skeleton[slotKey] = new SceneBuilder({
					worldConfig: this.worlds[worldIndex], 
					sequenceID: this.sequenceID,
					canvas: this.$refs.canvas,

					glb: this.glbs[worldIndex],
					texture: this.textures[worldIndex],
					bobs: this.bobs,
					type: slotKey
				});

				this.sceneBundle[slotKey] = await this.skeleton[slotKey].returnBundle();

				this.createSequencesManager(slotKey);

				this.nextWorldIndex++;

			},

			createSequencesManager(bundleSlot){

				this.sequencesManager[bundleSlot] = new SequencesManager(
					this.sceneBundle[bundleSlot],
					this.$parent,
					this.renderer,
					this.clock,
					this.canvasSizeRef,
					this
				);

			},

			checkIfAllScenesAreReady(){
				
				if( !this.initialLoadDone && this.sceneBundle.primary && this.sceneBundle.secondary ){

					this.initRenderer(this.sceneBundle.primary.worldConfig);

					this.initFirstSequencesManagers();

					this.skeleton.current = this.skeleton.primary;

					this.adjustMisc();

					this.mainTick();

					this.initialLoadDone = true;

				}

			},

			initFirstSequencesManagers(){

				this.createSequencesManager("primary");
				this.createSequencesManager("secondary");

				this.sequencesManager.current = this.sequencesManager.primary;

				this.sequencesManager.current.sequenceChangeHandler(this.sequenceID, "0.0");

			},

			switchScene( newSceneAndSequenceID ){

				console.log("newsceneAndSequenceID : ", newSceneAndSequenceID);

				if( this.sceneBundle.current.name === this.sceneBundle.primary.name ){

					this.skeleton.current = this.skeleton.secondary;

				} else {

					this.skeleton.current = this.skeleton.primary;

				}

			},

			async dropAndLoadAndSwitch(){

				if( this.nextWorldIndex > this.worlds.length ){ return; }

				// DROP la scene non courante
				const slotToDropKey = Object.keys(this.sceneBundle).find(key => this.sceneBundle[key].name !== this.sceneBundle.current.name);

				this.dropScene(slotToDropKey);

				// utiliser le slot libéré pour y mettre le nouveau sequencesManager (skeleton + bundle)
				this.createBundle(this.nextWorldIndex, slotToDropKey).then(() => {

					this.switchScene();
					this.$nuxt.$emit("please-update-sequence-id", this.computeNextSequenceID(this.sequenceID));
				});
				
			},

			dropScene( slotToDropKey ){

				let sequencesManagerToDrop = this.sequencesManager[slotToDropKey];

				if( !sequencesManagerToDrop ){
					console.log("ratage du dropScene : ", slotToDropKey);
				}

				disposeScene(sequencesManagerToDrop.sceneBundlePassed.scene);

				sequencesManagerToDrop = null;


			},
			
			initRenderer( currentWorldConfig ){

				// Renderer
				this.renderer = new THREE.WebGLRenderer({
					canvas: this.$refs.canvas,
					// antialias : ne peut pas être déclaré en dehors de l'instanciation
					// antialias: true
				});

				this.renderer.setSize(this.canvasSizeRef.width, this.canvasSizeRef.height);

				this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

				this.renderer.setClearColor(currentWorldConfig.main.spaceColor);

				this.renderer.outputEncoding = THREE.sRGBEncoding;

				this.renderer.shadowMap.enabled = true;

				// this.renderer.shadowMap.type = THREE.PCFShadowMap;

				this.clock = new THREE.Clock();

			},

			// RENDER
			mainTick(){

				if( !this.debug.animated ) return;

				this.deltaTime += this.clock.getDelta();
				
				// NOW CHECK IF FRAMERATE IS GOOD
				if( this.deltaTime >= this.frameRate ){

					this.checkCurrentTime();
	
					this.sequencesManager.current.checkStuffsToAnimateAtRender(this.deltaTime, this.viewPos);

					// NOW COMPUTE RENDER
					if( this.sequencesManager.current.composer ){
						// console.log("use composer : ", this.sequencesManager.current.name);
						
						this.sequencesManager.current.composer.render();
						
					} else {
						// console.log("use classic renderer : ", this.sceneBundle.current.name);

						this.renderer.render(this.sceneBundle.current.scene, this.sceneBundle.current.camera);

					}

					this.deltaTime = this.deltaTime % this.frameRate;

				}

				if( this.loopClock ){
					this.checkLoopClock();
				}

				window.requestAnimationFrame(this.mainTick);

			},

			checkCurrentTime(){


				if( this.endingIsStarted ){

					console.log("end currentTime is : ", this.$store.state[`audioEnd${this.$store.state.currentChoice}`].currentTime);

					if( !this.currentSequence.alreadyTriggered && this.$store.state[`audioEnd${this.$store.state.currentChoice}`].currentTime >= this.finishTimeCode && !this.finishIsStarted ){
						// finish scene

						this.handleFinishScene();


					} else if ( !this.currentSequence.alreadyTriggered && this.$store.state[`audioEnd${this.$store.state.currentChoice}`].currentTime >= this.currentSequence.until ) {
						// classic ending sequences chaining

						console.log("ending handleSequencing triggered");

						this.handleSequencing();

					}

				} else {

					if( !this.loopIsAsked && this.$store.state.audioBase.currentTime >= (this.$store.state.audioBase.duration - 0.1) ){
						// console.log("if -> end time is almost reached");
						this.startLoops();
					}
					
					if( !this.currentSequence.alreadyTriggered && !this.$store.state.audioBase.paused && this.$store.state.audioCurrent.currentTime >= this.currentSequence.until ){
	
						this.handleSequencing();
	
					}

				}

			},

			handleSequencing(){

				const nextSequenceID = this.computeNextSequenceID(this.sequenceID);
				const nextSceneID = this.computeNextSceneID(this.sequenceID);

				switch( this.currentSequence.nextInstruction ){

					case "switch-scene":
						// console.log("le switch case donne bien switch-scene");
						this.$nuxt.$emit("switch-scene", nextSceneID);
						// this.$nuxt.$emit("switch-sequence", nextSequenceID);
						break;

					case "switch-sequence":
						// console.log("nexxt sequence id : ", nextSequenceID);

						this.$nuxt.$emit("switch-sequence", nextSequenceID);
						break;

					case "drop-and-load-and-switch":
						// drop inactive
						// store current
						// load new one
						this.$nuxt.$emit("drop-and-load-and-switch", {});
						break;

				}

				this.currentSequence.alreadyTriggered = true;

			},

			computeNextSequenceID( chapterString ){
				const parsed = chapterString.split(".")

				parsed[1] = parseInt(parsed[1]) + 1;

				return parsed.join(".");
			},

			computeNextSceneID( chapterString ){
				const parsed = chapterString.split(".")

				parsed[0] = parseInt(parsed[0]) + 1;

				return parsed.join(".");
			},

			setDownScale(newRatio){

				// console.log("setDownScale has been triggered : ", this.sceneBundle.current);
				this.$store.commit('setDownScale', newRatio);

			},

			handleAudioEnded(){

				if( !this.loopIsAsked ){
					console.log("! ! ! ! ! ! ! ! ! fallback 'ended' started loop ! ! ! ! ! ! ! ! !");
					this.startLoops();
				}
				
			},
			
			startLoops(){

				console.log("startLoops triggered");

				this.loopIsAsked = true;
				
				console.log("audio loop : ", this.$store.state.audioLoopNeutral)

				
				this.$store.state.audioLoopNeutral.play();
				this.$store.state.audioLoopNeutral.volume(1);

				this.$store.state.audioLoopDrumOne.play();
				this.$store.state.audioLoopDrumOne.volume(0);
				
				this.$store.state.audioLoopDrumTwo.play();
				this.$store.state.audioLoopDrumTwo.volume(0);
				
				setTimeout(()=>{
					this.$store.state.audioBase.pause();
					this.$store.state.audioBase.removeEventListener("ended", this.handleAudioEnded);
				}, 300);

			},

			stopLoop(){

				console.log("ok stop neutral loop");
				this.$store.state.audioLoopNeutral.stop();

			},

			checkLoopClock(){

				console.log("checkLoopClock : ", this.loopClock.getElapsedTime());

				// @TODO : remove this
				if( this.debug.end ){
					this.endFlyPrayTimer = 2
					this.endChoiceTimer = 6
	
					if( this.debug.finish ){

						setTimeout(() => {
							this.$store.commit("setAudioTimecode", 95);
						}, 1000)

					}

		
				}

				if( !this.choiceIsDisplayed && !this.choiceHaveBeenMade && this.loopClock.getElapsedTime() >= this.endFlyPrayTimer ){
					this.$nuxt.$emit("drop-and-load-and-switch");
					this.choiceIsDisplayed = true;
				}
				
				if( this.choiceIsDisplayed && !this.choiceHaveBeenMade && this.loopClock.getElapsedTime() >= this.endChoiceTimer ){

					this.choiceIsDisplayed = false;
					this.choiceHaveBeenMade = true;

					if( this.$store.state.currentChoice === "Two" ){
						
						this.$nuxt.$emit("drop-and-load-and-switch");
					}

					this.$nuxt.$emit("drop-and-load-and-switch");
					
					this.dropLoops();

					this.startEnding();

				}

			},

			dropLoops(){

				// this.$store.state.audioLoopNeutral.stop();
				// already done in sequencesManager

				this.$store.state.audioLoopDrumOne.stop();
				this.$store.state.audioLoopDrumTwo.stop();

				this.loopClock.stop();
				this.loopClock = null;

			},

			startEnding(){

				this.endingIsStarted = true;

				this.$store.commit("setAudioCurrent", this.$store.state[`audioEnd${this.$store.state.currentChoice}`])

				this.$store.state[`audioEnd${this.$store.state.currentChoice}`].play();

			},

			handleFinishScene(){

				console.log("handleFinishScene well triggered")

				this.finishIsStarted = true;

				this.dropScene("primary");

				this.dropScene("secondary");

				this.createBundle(this.worlds.length - 1, "primary").then(() => {
					this.skeleton.current = this.skeleton.primary;
				});

			}

		}

	}

</script>

<style lang="scss" scoped>

canvas {
  z-index: 3;
  width: 100% !important;
  height: 100% !important;
  // position: fixed;
  // top: 0;
  // left: 0;
  outline: none;
  pointer-events: all;
}

p {
  z-index: 5;
  color: black;
//   color: #ffbb00;
}

.debug-space {
  position: absolute;
  top: 15px;
  left: 15px;
  padding: 0;
  margin: 0;
  background-color: rgba(0,0,200, .5);
  pointer-events: none;

  * {
    padding: 0 15px;
    margin: 0;
    color: white;
  }
}
</style>
