<template>
	<div class="body-wrapper">

		<div v-show="benchmarkIsDone">
			<main-hub />
		</div>

		<benchmark-ui />

		<div :style="{ 'visibility': benchmarkIsDone ? 'visible' : 'hidden' }">

			<button v-if="!cinemaIsReady" 
				class="button-experience" 
				disabled
			>
				<loader-one class="loader-one"/>
				Loading ({{ $store.state.assetsLoadCount }} / 8)
			</button>

			<button v-else 
				class="button-experience"
				@click="$parent.isAtEntrance = false"
			>
				Play
			</button>

		</div>
		
	</div>
</template>

<script>
	import MainHub from '@/components/mainHub.vue';
	import BenchmarkUi from '@/components/benchmarkUi.vue';
	import LoaderOne from '@/components/micro/loaderOne.vue';
	
	export default {
	components: { 
		"main-hub": MainHub,
		"benchmark-ui": BenchmarkUi,
		"loader-one": LoaderOne
	},
    data() {
        return {
            cinemaIsReady: false,
			benchmarkIsDone: false
        };
    },
    mounted() {
        this.$nuxt.$on("cinema-is-ready", this.handleCinemaIsReady);
        this.$nuxt.$on("benchmark-is-done", this.handleBenchmarkDone);
    },
    beforeDestroy() {
		this.$nuxt.$off("cinema-is-ready", this.handleCinemaIsReady);
		this.$nuxt.$off("benchmark-is-done", this.handleBenchmarkDone);
    },
    methods: {
        handleCinemaIsReady(event) {
            if (event) {
                this.cinemaIsReady = true;
            }
        },

		handleBenchmarkDone(){
			this.benchmarkIsDone = true;
		}
    }
}
</script>

<style lang="scss" scoped>

	.body {
		&-wrapper {
			text-align: center;

			top: 0;
			left: 0;

			width: 100%;
			height: 100vh;

			display: flex;
			flex-flow: column nowrap;
			justify-content: center;
		}
	}

	.button {

		&-experience {
			display: inline-block;
			background-color: white;
			margin: 2rem auto 0 auto;
			padding: 0.5rem 1.25rem;
			border-radius: 0.5rem;
		}

	}

	.loader-one {
		height: 1rem;
		opacity: 0.3;
	}

</style>