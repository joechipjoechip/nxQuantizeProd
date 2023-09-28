<template>
	<div class="app-wrapper">

		<div class="primal-curtain" v-if="!backgroundIsLaunched && primalCurtainIsDisplayed">
			<p>
				Loading de la baaase ...
			</p>
		</div>

		<div v-if="isAtEntrance" v-show="isAtEntrance && backgroundIsLaunched">

			<index-body class="body" />
	
			<component :is="'indexBackground'" class="background" :canvasSizeRef="canvasSizeRef" />

		</div>

		<div v-if="!primalCurtainIsDisplayed && backgroundIsLaunched && benchmarkIsOver" v-show="!isAtEntrance">
			<component :is="'cinemaNew'" :canvasSizeRef="canvasSizeRef" />
		</div>

	</div>
</template>

<script>
	import IndexBody from '@/components/indexBody.vue';

	export default {
  		components: { 
			"index-body": IndexBody 
		},
		data(){
			return {
				canvasSizeRef: {
					width: window.innerWidth,
					height: window.innerHeight
				},
				isAtEntrance: true,
				backgroundIsLaunched: false,
				primalCurtainIsDisplayed: true,
				benchmarkIsOver: false
			}
		},
		mounted(){

			this.$nuxt.$on("benchmark-is-done", this.startBigLoad);

			window.addEventListener("resize", this.onResize);

		},
		beforeDestroy(){

			this.$nuxt.$off("benchmark-is-done", this.startBigLoad);

			window.removeEventListener("resize", this.onResize);

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

					this.$nuxt.$emit("please-start-benchmark", {})

				}
				
			},	
		},
		methods: {
			startBigLoad(){
				this.benchmarkIsOver = true
				console.log("startBigKLoads triggered")
				// @import cinemaNew from '@/components/cinemaNew.vue';
				import(`@/components/cinemaNew.vue`);

			},

			onResize(){
				this.canvasSizeRef.width = window.innerWidth / this.$store.state.downScale;
				this.canvasSizeRef.height = window.innerHeight / this.$store.state.downScale;
			},
		}
		
	}
</script>

<style lang="scss">

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