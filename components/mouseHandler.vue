<template>
	<div></div>
</template>

<script>
	export default {
		props: {
			canvasSizeRef: {
				type: Object,
				required: true
			}
		},
		mounted(){
			window.addEventListener("mousemove", this.handleMouseMove);
		},
		beforeDestroy(){
			window.removeEventListener("mousemove", this.handleMouseMove);
		},
		methods: {
			handleMouseMove( event ){
				console.log("wsh le mouvemove handler")

				this.$nuxt.$emit("mouse-pos-update", {
					x: (((event.offsetX + this.canvasSizeRef.width / 2) / this.canvasSizeRef.width) - 1) * 2,
					y: (((event.offsetY + this.canvasSizeRef.height / 2) / this.canvasSizeRef.height) - 1) * -2
				});
			}
		}
	}
</script>

<style scoped>

</style>