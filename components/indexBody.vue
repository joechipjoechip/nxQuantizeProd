<template>
	<div class="body-wrapper">

		<div v-show="benchmarkIsDone">
			<main-hub />
		</div>

		<benchmark-ui />

		<div class="button-experience-container"
			:style="{ 'visibility': benchmarkIsDone ? 'visible' : 'hidden' }"
		>

			<transition name="button-experience-transition">

				<div v-if="!cinemaIsReady" 
					class="button-experience-loading"
				>
					<loader-one class="loader-one"/>
					Loading ({{ $store.state.assetsLoadCount }}/8)
				</div>

			</transition>

			<transition name="button-experience-transition">

				<div v-if="cinemaIsReady"
					class="button-experience-ready"
					@click="$parent.isAtEntrance = false"
				>
					Start
				</div>

			</transition>

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

	@import "./assets/style/variables.scss";

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

			&-container {
				position: relative;
				font-family: 'Neue Haas Grotesk Text';
			}

			&-loading,
			&-ready {
				color: black;
				display: block;
				position: absolute;
				background-color: rgba(255,255,255,0.05);
				backdrop-filter: blur(5px);
				// margin: 2rem auto 0 auto;
				margin-top: 2rem;
				padding: 0.5rem 0;
				border-radius: 0.5rem;
				color: white;
				text-transform: uppercase;

				overflow: hidden;
                border: solid 1px rgba(255,255,255,0.05);

				transform: translateY(0px);
			}

			&-loading {
				width: 16rem;
				left: calc(50% - 8rem);
			}

			&-ready {
				width: 8rem;
				left: calc(50% - 4rem);
			}

			&-transition {

				&-enter-active,
				&-leave-active {
					transition: all 1s ease;
				}

				&-enter-from,
				&-leave-to {
					opacity: 0;
					transform: translateY(50px);
				}

			}
		}

	}

	.loader-one {
		height: 1rem;
		opacity: 0.3;
	}

</style>