<template>
	<div>
		<div v-if="debugStats" class="debug-space">
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
			<div v-if="currentSequence" class="stats">very bad cpu : {{ $store.state.veryBadComputer }}</div>
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
			},

			debugStats: {
				type: Boolean,
				default: false
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
				// composerIsAllowed: true,

				endFlyPrayTimer: 16.5,
				endChoiceTimer: 43.43,
				finishTimeCode: 0,
				finalHubDelay: 18,
				finalCurtainDelay: 45,
				decayTimeForEndSequences: 0,

				nextWorldIndex: 0,
				initialLoadDone: false,
				debugFinishHasBeenAsked: false,

				debug: {
					animated: true,
					firstPart: 130,
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

			"canvasSizeRef.width"( newVal ){
				this.acteResizeOnRenderers()
			},
			"canvasSizeRef.height"( newVal ){
				this.acteResizeOnRenderers()
			},

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
					this.$store.state.audioCurrent.play();
				}
			},
			endingIsStarted( newVal ){
				if( newVal ){

					if( this.debug.finish && this.debugFinishTimeCode ){

						setTimeout(() => {
							this.$store.commit("setAudioTimecode", this.debugFinishTimeCode);
						}, 500)

					}

					if( this.$store.state.veryBadComputer ){
						this.setDownScale(4.75);
					}

					if( this.$store.state.badComputer ){
						this.setDownScale(2.75);
					}

				}
			},

			"$store.state.currentChoice"( newVal ){

				if( newVal === "One"){

					this.finishTimeCode = 139;
					this.debugFinishTimeCode = 100;
					this.decayTimeForEndSequences = 54.1;

				} else {

					this.finishTimeCode = 162;
					this.debugFinishTimeCode = 120;
					this.decayTimeForEndSequences = 57.75;

				}

			}

		},

		mounted(){
			
			this.createBundle(0, "primary");
			this.createBundle(1, "secondary");

			if( this.debug.firstPart ){

				setTimeout(() => {
	
					this.$store.commit("setAudioTimecode", this.debug.firstPart);
	
				}, 800);

			}
			
		},

		methods: {

			acteResizeOnRenderers(){

				this.renderer.setSize(this.canvasSizeRef.width, this.canvasSizeRef.height);
	
				if( this.sequencesManager.current.composer ){
					this.sequencesManager.current.composer.setSize(this.canvasSizeRef.width, this.canvasSizeRef.height);
				}

				this.skeleton.current.recomputeCameraAspectRatio(this.canvasSizeRef);

			},

			adjustMisc(){

				if( this.$store.state.badComputer ){
					this.setDownScale(2);
				}

				if( this.$store.state.veryBadComputer ){
					this.setDownScale(3);
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
					type: slotKey,
					vm: this
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
					// powerPreference: "high-performance"
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

				window.requestAnimationFrame(this.mainTick);

			},

			checkCurrentTime(){

				// console.log("currentTime de audioCurrent : ", this.$store.state.audioCurrent.currentTime)

				if( this.choiceHaveBeenMade && !this.endingIsStarted && this.sequenceID !== "7.15"){

					if( this.$store.state.audioCurrent.currentTime >= (this.currentSequence.until + this.decayTimeForEndSequences) ){
						this.handleSequencing();
					}
					
				} else if( this.endingIsStarted ){

					// console.log("end currentTime is : ", this.$store.state[`audioEnd${this.$store.state.currentChoice}`].currentTime);

					if( !this.currentSequence.alreadyTriggered && this.$store.state.audioCurrent.currentTime >= this.finishTimeCode - 6 && !this.finishIsStarted && !this.$parent.isFinishScene ){
						// handle final curtain
						
						this.$parent.isFinishScene = true;
						// console.log("le parent : ", this.$parent);


					} else if( !this.currentSequence.alreadyTriggered && this.$store.state.audioCurrent.currentTime >= this.finishTimeCode && !this.finishIsStarted ){
						// finish scene

						this.handleFinishScene();


					} else if ( !this.currentSequence.alreadyTriggered && this.$store.state.audioCurrent.currentTime >= (this.currentSequence.until + this.decayTimeForEndSequences) ) {
						// classic ending sequences chaining

						// console.log("ending handleSequencing triggered");

						this.handleSequencing();

					}

				} else {

					if( !this.loopIsAsked && this.$store.state.audioBase.currentTime >= (this.$store.state.audioBase.duration - 0.45) ){

						this.startLoops();
						this.handleSequencing();

						
					}
					
					if( !this.currentSequence.alreadyTriggered && this.$store.state.audioCurrent.currentTime >= this.currentSequence.until ){
	
						this.handleSequencing();
	
					}

				}

			},

			handleSequencing(){

				const nextSequenceID = this.computeNextSequenceID(this.sequenceID);
				const nextSceneID = this.computeNextSceneID(this.sequenceID);

				this.handleExceptionsForSequencing();

				switch( this.currentSequence.nextInstruction ){

					case "switch-scene":
						this.$nuxt.$emit("switch-scene", nextSceneID);
						break;

					case "switch-sequence":
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

			handleExceptionsForSequencing(){

				if( this.sequenceID === "7.15" ){
					// séquence du choice

					this.choiceIsDisplayed = false;
					this.choiceHaveBeenMade = true;
					this.endingIsStarted = true;

					if( this.$store.state.currentChoice === "Two" ){
						this.$store.commit("setAudioCurrent", this.$store.state.audioEndTwo);
						this.$nuxt.$emit("drop-and-load-and-switch");
					}

				}

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
			
			startLoops(){

				console.log("startLoops triggered");

				this.loopIsAsked = true;

				this.$store.state.audioEndOne.play();
				this.$store.state.audioEndOne.volume = 1;
				
				this.$store.state.audioEndTwo.play();
				this.$store.state.audioEndTwo.volume = 0;

				this.$store.commit("setAudioCurrent", this.$store.state.audioEndOne);

				
				
				setTimeout(()=>{
					this.$store.commit("setAudioBase", null);

					if( this.debug.end ){
						this.$store.state.audioEndOne.currentTime = 50;
						this.$store.state.audioEndTwo.currentTime = 50;
					}

				}, 3500);


			},

			handleFinishScene(){

				console.log("handleFinishScene well triggered")

				this.finishIsStarted = true;

				this.dropScene("primary");

				this.dropScene("secondary");

				
				this.createBundle(this.worlds.length - 1, "primary").then(() => {
					this.skeleton.current = this.skeleton.primary;
					this.handleFinishExceptions();
				});

			},

			handleFinishExceptions(){

				this.sceneBundle.current.bobs.linkShaderPlastic._controls._target.children[0].material = new THREE.MeshPhongMaterial({
					color: 0x000000,
					// specular: 0x050505,
					specular: 0x4e0061,
					shininess: 1,
					reflectivity: 1,
					reflectionRatio: 1,
					emissive: 0x0b000e,
					emissiveIntensity: 0.1,
					transparent: true,
					opacity: 0.98
				});

				setTimeout(() => {
					// activer le final hub
					console.log("display final hub");
					this.$parent.displayFinalHub = true;

					setTimeout(() => this.$parent.displayFinalHubActive = true, 1000)

				}, this.finalHubDelay * 1000)

				setTimeout(() => {
					// activer le final hub
					console.log("please reload");

					this.$parent.curtainActive = true;

					setTimeout(() => {
						this.debug.animated = false;
					}, 6000)
					
				}, this.finalCurtainDelay * 1000)

				this.adjustDownscaleForFinish();
			},

			adjustDownscaleForFinish(){

				if( this.$store.state.badComputer || this.$store.state.veryBadComputer ){
					this.setDownScale(1);
				}

			},

			handleComposerEnabling( newSequenceID ){

				// console.log("handleComposerEnabling triggered with : ", newSequenceID);
				
				// if( this.$store.state.bloomDisabler && this.$store.state.composerDisableSequences.includes(newSequenceID) ){
				// 	this.composerIsAllowed = false;
				// } else {
				// 	this.composerIsAllowed = true;
				// }

			}

		}

	}

</script>

<style lang="scss" scoped>

canvas {
  z-index: 3;
  width: 100vw !important;
  height: 100vh !important;
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
