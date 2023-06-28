<template>
	<div>
		hello ! let's go : 
		<button>
			<nuxt-link to="cinemaNew">GO</nuxt-link>
		</button>

		<index-background
			:canvasSizeRef="canvasSizeRef"
		/>

		<mouse-handler
			:canvasSizeRef="canvasSizeRef"
		/>

	</div>
</template>

<script>
	import indexBackground from '../components/indexBackground.vue'
	export default {
  		components: { indexBackground },
		data(){
			return {
				canvasSizeRef: {
					width: window.innerWidth,
					height: window.innerHeight
				}
			}
		}
		
	}
</script>

<style scoped>

</style>