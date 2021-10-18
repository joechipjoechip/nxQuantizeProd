<template>
	<div>

		<button @click="changeSceneHandler">change scene</button>
		<button @click="onChangeCam">change cam</button>
		<!-- <audio 
			src=""
		></audio> -->
		<!-- @onTimeUpdate="onTimeUpdateHandler" -->

		<world 
			v-for="worldKey in worldsKeys"
			v-show="worldKey === visibleWorldKey"
			:ref="worldKey"
			:key="worldKey"

			:mainConfig="core.main"
			:thisWorld="core.worlds[worldKey]" 
			:thisWorldKey="worldKey"

			:visibleWorldKey="visibleWorldKey"
			:visibleSequenceID="visibleSequenceID"
		/>
		<!-- :is-visible="true" -->
	</div>
</template>

<script>

	// core.env.mountainTwo

	import { core } from '@/static/config/core.js';

	import world from "./world.vue";

	// + import fichierjs de la timelineglobale
	
	export default {
		components: {
			world
		},
		data(){
			return {
				core,
				visibleSequenceID: "",
				worldsKeys: Object.keys(core.worlds),
				visibleWorldKey: "mountainTwo"
			}
		},
		watch: {

			visibleSequenceID( newVal ){
				
				// on définit le currentWorld depuis la séquence ID, donc :

				this.worldsKeys.forEach(worldKey => {

					this.core.worlds[worldKey].sequences.forEach(seq => {

						if( seq.id === newVal ){

							this.visibleWorldKey = worldKey;

						}

					});

				});

			}

		},
		mounted(){

			this.visibleSequenceID = "1.0";

			window.addEventListener("resize", this.onResize);

			// on va peut être initialiser le this.renderer ici, en fait

		},
		methods: {

			onResize(){
				// explication : pour être le plus opti possible
				// on évite de mettre un listener sur window depuis chaque world
				// donc on le fait ici (1 seul listener donc)
				// et on demande aux children d'update leur valeur canvasSizeRef propres

				this.$children.forEach(child => {
					child.updateCanvasRefSize();
				});

			},

			onChangeCam(){

				this.$refs[this.visibleWorldKey][0].onCanvasClickHandler();
				
			},
			onTimeUpdateHandler(){

				console.log("onUpdate de l'audio ici");

			},

			changeSceneHandler(){

				console.log("change scene triggered");

				switch(this.visibleSequenceID){
					case "1.0":
						this.visibleSequenceID = "1.1"
						break
					case "1.1":
						this.visibleSequenceID = "1.2"
						break
					case "1.2":
						this.visibleSequenceID = "1.3"
						break
					default:
						this.visibleSequenceID = "1.0"
						break
				}

			}

		}
	}
</script>

<style lang="scss" scoped>

</style>