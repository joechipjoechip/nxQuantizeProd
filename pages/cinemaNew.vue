<template>
	<div>

		<button @click="changeSceneHandler">change scene</button>
		<button @click="stopAnimation">start/stop animation</button>

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
				sequenceID: "1.0"
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

			stopAnimation(){

				this.$refs.instancethree.debug.animated = !this.$refs.instancethree.debug.animated;

				if( this.$refs.instancethree.debug.animated ){
					this.$refs.instancethree.mainTick();
				}

			},

			changeSceneHandler(){
				// très basique pour l'instant, mais c'est bien
				// ce mécanisme (refait) qui change la séquence en cours
				// pour l'instant

				console.log("change scene triggered");

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

			}

		}
	}
</script>

<style lang="scss" scoped>

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