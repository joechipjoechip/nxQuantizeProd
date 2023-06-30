<template>
	<div class="app-wrapper">

		<div v-show="isAtEntrance">

			<index-body class="body" />
	
			<index-background class="background"
				:canvasSizeRef="canvasSizeRef"
			/>
	
			<mouse-handler
				:canvasSizeRef="canvasSizeRef"
			/>

		</div>

		<div v-if="backgroundIsLaunched" v-show="!isAtEntrance">
			<cinema-new />
		</div>


	</div>
</template>

<script>
	import IndexBody from '@/components/indexBody.vue';
	import indexBackground from '@/components/indexBackground.vue';
	import cinemaNew from '@/components/cinemaNew.vue';

	export default {
  		components: { indexBackground, IndexBody },
		data(){
			return {
				canvasSizeRef: {
					width: window.innerWidth,
					height: window.innerHeight
				},
				isAtEntrance: true,
				backgroundIsLaunched: false
			}
		}
		
	}
</script>

<style lang="scss" scoped>

	.app-wrapper {
		width: 100%;	
		height: 100%;
		position: relative;
	}

	.background {
		z-index: 5;
		position: fixed;
		top: 0;
		left: 0;

		width: 100%;
		height: 100%;
	}

	.body {
		z-index: 10;
		position: relative;

		// temp for the "animation button"
		top: 20px;
	}

</style>