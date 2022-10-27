<template>
	<div>

		<button @click="changeSequenceHandler">change scene</button>
		<button @click="stopAnimation">start/stop animation</button>
		<button @click="changeSequenceHandler">next sequence</button>

		<div 
			class="curtain"
			:class="{ active: curtainActive }"
		>
		</div>

		<instancethree 
			ref="instancethree"
			:sequenceID="sequenceID"
		/>

	</div>
</template>

<script>

	import instanceThree from "./instanceThree.vue";
	
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
				curtainActive: false
			}
		},

		mounted(){

			window.addEventListener("resize", this.onResize);

		},

		methods: {

			onResize(){
				// à refaire puisque maintenant le canvas est ici

				// this.$children.forEach(child => {
				// 	child.updateCanvasRefSize();
				// });

			},

			mouseMoveHandler( event ){
				
				this.mousePos = {
					x: (((event.offsetX + this.canvasSizeRef.width / 2) / this.canvasSizeRef.width) - 1) * 2,
					y: (((event.offsetY + this.canvasSizeRef.height / 2) / this.canvasSizeRef.height) - 1) * -2
				};

				console.log("mousepos : ", this.mousePos.x)

			},

			stopAnimation(){

				const currentTimelines = this.$refs.instancethree.scene1.sequencesElements[this.sequenceID].timelines;
				const currentTimelinesKeys = Object.keys(currentTimelines);

				this.$refs.instancethree.debug.animated = !this.$refs.instancethree.debug.animated;

				if( this.$refs.instancethree.debug.animated ){

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

			changeSequenceHandler(){
				// très basique pour l'instant, mais c'est bien
				// ce mécanisme qui change la séquence en cours pour linstant
				// (plus tard ce sera calé sur le currentTime de l'audio)

				console.log("change scene triggered");

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
							this.sequenceID = "1.1"
							break
					}


				}, 300)

				

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

.curtain{
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: #000000;
	pointer-events: none;
	opacity: 0;

	will-change: opacity;
	transition: opacity .3s ease;

	&.active {
		opacity: 1
	}
}

</style>
