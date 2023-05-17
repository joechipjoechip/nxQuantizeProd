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
			<div v-if="currentSequence" class="stats">isAdjustingDownScale : {{ isAdjustingDownScale }}</div>
			<div v-if="currentSequence" class="stats">performanceTimeoutID : {{ performanceTimeoutID }}</div>
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

	import { loopify } from '@/components/loopify.js';

	const frameRate = 1/60;

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
				frameRate,
				deltaTime: 0,

				arbitraryFpsIdeal: 60,
				arbitraryFpsLimit: 50,
				arbitraryDownScaleLimit: 1.5,

				currentFPS: 0,
				startTime: performance.now(),
				currentFPSValue: 0,
				frames: 0,
				isAdjustingDownScale: false,
				performanceTimeoutID: null,

				// sequenceID: "1.0",
				lastKnownSequenceID: "1.0",

				// Others
				debug: {
					animated: true,
					stats: true
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

				nextWorldIndex: 0,
				initialLoadDone: false

			}

		},

		computed: {
			worldConfig(){
				return this.worlds.find( world => world.sequences.find( seq => seq.id === this.sequenceID ) )
			},
			currentSequence(){
				return this.worldConfig.sequences.find(seq => seq.id === this.sequenceID)
			}
		},

		watch: {

			"skeleton.current"(newVal){

				this.clearDownScaleTimeout();

				this.sceneBundle.current = this.sceneBundle[newVal.type];
				
				this.sequencesManager.current = this.sequencesManager[newVal.type];
				
				this.skeleton.current.refreshBobs(this.bobs, this.sceneBundle.current.scene);

				this.sequencesManager.current.sequenceChangeHandler(this.sequenceID);

			},

			"sceneBundle.primary.name"(){
				this.checkIfAllScenesAreReady();
			},
			"sceneBundle.secondary.name"(){
				this.checkIfAllScenesAreReady();
			},

			sequenceID(newVal, oldVal){

				this.sequencesManager.current.sequenceChangeHandler(newVal, oldVal);

				if( this.performanceTimeoutID ){
					this.clearDownScaleTimeout();
				}
			},

			"canvasSizeRef.width"(){

				this.renderer.setSize(this.canvasSizeRef.width, this.canvasSizeRef.height);

				Object.keys(this.skeleton).forEach(skeletonKey => {

					this.skeleton[skeletonKey].onResize(this.canvasSizeRef);
					
				});
			},

			initialLoadDone( newVal ){
				if( newVal ){

					this.$store.state.audioBase.addEventListener("ended", this.handleAudioEnded);

					this.$store.state.audioCurrent.play();

				}
			}

		},

		mounted(){

			this.createBundle(0, "primary");
			this.createBundle(1, "secondary");
			console.log(" à à à à à àà  loopify : ", loopify);

			// this.arbitraryFpsLimit = this.$store.state.isMobile ? 25 : 50;
			// this.arbitraryFpsIdeal = this.$store.state.isMobile ? 30 : 60;

		},

		methods: {

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
					this.viewPos,
					this
				);

			},

			checkIfAllScenesAreReady(){
				
				if( !this.initialLoadDone && this.sceneBundle.primary && this.sceneBundle.secondary ){

					this.initRenderer(this.sceneBundle.primary.worldConfig);

					this.createSequencesManagers();

					this.skeleton.current = this.skeleton.primary;

					this.mainTick();

					this.initialLoadDone = true;

				}

			},

			createSequencesManagers(){

				this.sequencesManager.primary = new SequencesManager(
					this.sceneBundle.primary,
					this.$parent,
					this.renderer,
					this.clock,
					this.canvasSizeRef,
					this.viewPos,
					this
				);

				this.sequencesManager.secondary = new SequencesManager(
					this.sceneBundle.secondary,
					this.$parent,
					this.renderer,
					this.clock,
					this.canvasSizeRef,
					this.viewPos,
					this
				);

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

				this.disposeScene(sequencesManagerToDrop.sceneBundlePassed.scene);

				sequencesManagerToDrop = null;


			},

			sceneTraverse(obj, fn){

				if (!obj) return

				fn(obj)

				if (obj.children && obj.children.length > 0) {
					obj.children.forEach(o => {
						this.sceneTraverse(o, fn)
					})
				}
			},

			disposeScene( scene ){

				this.sceneTraverse(scene, o => {

					if (o.geometry) {
						o.geometry.dispose();
					}

					if (o.material) {
						if (o.material.length) {
							for (let i = 0; i < o.material.length; ++i) {
								o.material[i].dispose();
							}
						}
						else {
							o.material.dispose();
						}
					}
				})          

				scene = null;
	
			},
			
			initRenderer( currentWorldConfig ){

				// Renderer
				this.renderer = new THREE.WebGLRenderer({
					canvas: this.$refs.canvas,
					// ne peut pas être déclaré en dehors de l'instanciation
					antialias: true
				});

				this.renderer.setSize(this.canvasSizeRef.width, this.canvasSizeRef.height);

				this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

				this.renderer.setClearColor(currentWorldConfig.main.spaceColor);

				this.renderer.outputEncoding = THREE.sRGBEncoding;

				this.renderer.shadowMap.enabled = true;

				this.renderer.shadowMap.type = THREE.PCFShadowMap;

				this.clock = new THREE.Clock();

			},

			// RENDER
			mainTick(){

				if( !this.debug.animated ) return;

				this.deltaTime += this.clock.getDelta();

				this.computeFPS();

				this.checkCurrentTime();

				this.sequencesManager.current.checkStuffsToAnimateAtRender(this.deltaTime, this.viewPos);

				
				// NOW CHECK IF FRAMERATE IS GOOD
				if( this.deltaTime >= this.frameRate ){

					this.handleFpsAndDownScaling();

					// NOW COMPUTE RENDER
					if( this.sequencesManager.current.composer ){
						// console.log("use composer : ", this.sequencesManager.current.name);
						
						this.sequencesManager.current.composer.render();
						
					} else if( this.sceneBundle.current ) {
						// console.log("use classic renderer : ", this.sceneBundle.current.name);

						this.renderer.render(this.sceneBundle.current.scene, this.sceneBundle.current.camera);

					}

					this.deltaTime = this.deltaTime % this.frameRate;

				}

				window.requestAnimationFrame(this.mainTick);

			},

			checkCurrentTime(){

				// console.log("current time : ", this.$store.state.audioCurrent.currentTime);
				// console.log("current until : ", this.currentSequence.until);

				if( this.$store.state.audioCurrent.currentTime >= this.currentSequence.until && !this.currentSequence.alreadyTriggered ){

					const nextSequenceID = this.computeNextSequenceID(this.sequenceID);
					const nextSceneID = this.computeNextSceneID(this.sequenceID);

					const dropNextChapterID = this.computeNextSceneID(nextSequenceID);

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
							console.log("oui le switch/case drop and load and switch est bien triggered");
							this.$nuxt.$emit("drop-and-load-and-switch", {});
							break;

					}

					this.currentSequence.alreadyTriggered = true;

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

			computeFPS(){
				const t = performance.now();
				const dt = t - this.startTime;

				if( dt > 100 ){
					this.currentFPSValue = parseInt(this.frames * 1000 / dt);

					this.frames = 0;
					this.startTime = t;
				}
				this.frames++;
			},

			setDownScale(newRatio){

				// console.log("setDownScale has been triggered : ", this.sceneBundle.current);

				this.$store.commit('setDownScale', newRatio);

			},

			handleFpsAndDownScaling(){

				if( this.isAdjustingDownScale ){ return; }

				if( this.currentFPSValue > this.arbitraryFpsLimit && this.$store.state.downScale !== 1 ){

					this.setDownScale(1);

					this.clearDownScaleTimeout();

					return;

				}
				
				if( this.currentFPSValue < this.arbitraryFpsLimit || this.$store.state.downScale > this.arbitraryDownScaleLimit ){
					// console.log("adjusting start : fps value : ----> ", this.currentFPSValue);

					this.isAdjustingDownScale = true;

					this.performanceTimeoutID = setTimeout(() => {
						
						if( this.currentFPSValue < this.arbitraryFpsLimit || this.$store.state.downScale > this.arbitraryDownScaleLimit ){
							// console.log("adjusting verify (in timeout): fps value : ", this.currentFPSValue);

							const diff = (((this.arbitraryFpsIdeal - this.currentFPSValue) / 10) + 1) * 1.3;

							if( diff > 1 ){
								this.setDownScale(diff);
							}

							this.isAdjustingDownScale = false;

						} else {
							// console.log("finally cancelled because fps is now : ", this.currentFPSValue);
							this.clearDownScaleTimeout();

						}

					}, 1000);

				} else {

					this.clearDownScaleTimeout();

				}

			},

			clearDownScaleTimeout(){
				
				if( this.performanceTimeoutID ){

					clearTimeout(this.performanceTimeoutID);
					this.performanceTimeoutID = null;
					this.isAdjustingDownScale = false;

				}

			},

			handleAudioEnded(){

				console.dir(this.$store.state.audioLoop);
				const fileReader = new FileReader();

				const loopFile = fileReader.readAsArrayBuffer(new Blob([this.$store.state.audioLoop], { type: 'audio/wav' }));

				const loopBlob = new Blob([loopFile], { type: 'audio/wav' })

				console.log("hey : ", typeof loopBlob);


				console.log("! ! ! ! ! ! ! ! ! ok launch loop now ! ! ! ! ! ! ! ! ! ");
				this.$store.state.audioBase.removeEventListener("ended", this.handleAudioEnded);
				// ?

				loopify(
					loopFile, 
					function(err, loop) {
					// If something went wrong, `err` is supplied
					if (err) {
						console.log("loopify error -------> ", err);
					}

					// Play it whenever you want
					loop.play();
				});

				// this.$store.commit("setAudioCurrent", this.$store.state.audioLoop);

				// this.$store.state.audioCurrent.play();

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
