<template>
	<div class="body-wrapper">

		<!-- <div v-show="benchmarkIsDone"> -->
			<main-hub />
		<!-- </div> -->

		<benchmark-ui />

		<!-- <p @click="cinemaIsReady = !cinemaIsReady">toggle</p> -->

		<div class="button-experience-container">

			<transition name="button-experience-transition">

				<div v-if="!cinemaIsReady" 
					class="button-experience-loading"
				>
					<loader-one class="loader-one"/>
					Loading ({{ $store.state.assetsLoadCount }}/5)
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
				margin-top: 0.65rem;
				padding: 0.5rem 0;
				border-radius: 0.5rem;
				color: white;
				text-transform: uppercase;

				overflow: hidden;
                border: solid 1px rgba(255,255,255,0.05);

				top: 0;

				
			}

			&-loading,
			&-ready {
				border-radius: 0 0 5rem 5rem;
				padding-bottom: 0.75rem;
			}

			&-loading {
				width: 16rem;
				left: calc(50% - 8rem);
				cursor: progress;
			}
			
			&-ready {
				font-size: 1.75rem;
				width: 10rem;
				left: calc(50% - 5rem);
				cursor: pointer;

				transition: background-color .15s;

				animation: startAnimation 3s infinite;

				&:hover {
					background-color: rgba(255,255,255,0.25);
				}
			}

			&-transition {

				&-enter-active,
				&-leave-active {
					transition: opacity .4s ease,
								top .4s ease;
				}

				&-enter-from,
				&-leave-to {
					opacity: 0;
					top: 50px;
				}

			}

		}

	}

	@keyframes startAnimation {
		0%, 100% {
			// background-color: rgba(255,255,255,0.15);
			border: solid 1px rgba(255,255,255,0.3);
		}

		25% {
			// background-color: rgba(255,255,255,0.35);
			border: solid 1px rgba(255,255,255,1);
		}
	}

	.loader-one {
		height: 1rem;
		opacity: 0.3;
	}



</style>