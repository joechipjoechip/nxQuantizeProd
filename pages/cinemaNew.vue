<template>
	<div>

		<button @click="changeSequenceHandler">change scene</button>
		<button @click="stopAnimation">start/stop animation</button>
		<button @click="changeSequenceHandler">next sequence</button>

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
				}
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

				this.$refs.instancethree.debug.animated = !this.$refs.instancethree.debug.animated;

				if( this.$refs.instancethree.debug.animated ){
					this.$refs.instancethree.mainTick();
				}

			},

			changeSequenceHandler(){
				// très basique pour l'instant, mais c'est bien
				// ce mécanisme (refait) qui change la séquence en cours
				// pour l'instant

				console.log("change scene triggered");

				const oldSequenceID = this.sequenceID;

				switch(this.sequenceID){
					case "1.0":
						this.sequenceID = "1.1"
						break
					case "1.1":
						this.sequenceID = "1.2"
						break
					default:
						this.sequenceID = "1.0"
						break
				}

				// free memory and ressources
				this.$refs.instancethree.scene1.sequencesElements[oldSequenceID] = null;

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

  &.running {
    background-color: greenyellow;
  }

  &.stoped {
    background-color: red;
  }
}
</style>