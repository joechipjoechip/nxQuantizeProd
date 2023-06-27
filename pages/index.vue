<template>
	<div>
		hello ! let's go : 
		<button>
			<nuxt-link to="cinemaNew">GO</nuxt-link>
		</button>

		<index-background></index-background>
	</div>
</template>

<script>
	import indexBackground from '../components/indexBackground.vue'
	export default {
  		components: { indexBackground },
		
	}
</script>

<style scoped>

</style>