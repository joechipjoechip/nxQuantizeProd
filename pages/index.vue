<template>
	<div class="app-wrapper">

		<div class="primal-curtain" v-if="!backgroundIsLaunched && primalCurtainIsDisplayed">
			<p>
				Loading de la baaase ...
			</p>
		</div>

		<div v-if="isAtEntrance" v-show="isAtEntrance && backgroundIsLaunched">

			<index-body class="body" />
	
			<component is="indexBackground" class="background" :canvasSizeRef="canvasSizeRef" />
	
			<mouse-handler
				:canvasSizeRef="canvasSizeRef"
			/>

		</div>

		<div v-if="!primalCurtainIsDisplayed && backgroundIsLaunched" v-show="!isAtEntrance">
			<component is="cinemaNew" />
		</div>

	</div>
</template>

<script>
	import IndexBody from '@/components/indexBody.vue';

	export default {
  		components: { IndexBody },
		data(){
			return {
				canvasSizeRef: {
					width: window.innerWidth,
					height: window.innerHeight
				},
				isAtEntrance: true,
				backgroundIsLaunched: false,
				primalCurtainIsDisplayed: true
			}
		},
		watch: {
			primalCurtainIsDisplayed( newVal ){
				if( !newVal ){
					import(`@/components/indexBackground.vue`);
				}
			},
			backgroundIsLaunched( newVal ){

				if( newVal ){
					this.primalCurtainIsDisplayed = false
					// @import cinemaNew from '@/components/cinemaNew.vue';
					import(`@/components/cinemaNew.vue`);
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
	
	.primal-curtain {
		width: 100%;	
		height: 100vh;
		position: relative;
		background-color: white;
		color: green;

		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		align-items: center;
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