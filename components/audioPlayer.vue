<template>

	<div></div>


</template>

<script>

	import sound from "@/static/assets/audio/onyi-base.mp3";

	export default {
		// props: {},
		data(){
			return {

			}
		},

		mounted() {
			const audio = new Audio(sound)

			audio.play()
		},

	}
</script>

<style>
	
</style>