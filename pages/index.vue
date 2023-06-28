<template>
	<div class="app-wrapper">

		<index-body class="body" />

		<index-background class="background"
			:canvasSizeRef="canvasSizeRef"
		/>

		<mouse-handler
			:canvasSizeRef="canvasSizeRef"
		/>

	</div>
</template>

<script>
	import IndexBody from '../components/indexBody.vue';
	import indexBackground from '../components/indexBackground.vue';

	export default {
  		components: { indexBackground, IndexBody },
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