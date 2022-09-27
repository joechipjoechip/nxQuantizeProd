<template>
	<div>

		<button @click="changeSceneHandler">change scene</button>

		<instance-three 
			ref="instance-three"
			:sequenceID="sequenceID"
		/>

	</div>
</template>

<script>

	import instanceThree from "./instanceThree.vue";
	
	export default {

		components: {
			"instance-three": instanceThree
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

</style>